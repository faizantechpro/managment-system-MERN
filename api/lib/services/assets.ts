import { Range, StatResponse } from '@directus/drive';
import path from 'path';
import sharp, { ResizeOptions } from 'sharp';
import { storage } from '../storage';
import { Transformation } from '../types';
import { Semaphore } from 'async-mutex';

import { FileModel } from '../database';

sharp.concurrency(1);

// Note: don't put this in the service. The service can be initialized in multiple places, but they
// should all share the same semaphore instance.
const semaphore = new Semaphore(5);

export class AssetsService {
  async getAsset(
    tenant: string,
    id: string,
    transformation: Transformation,
    range?: Range
  ): Promise<{ stream: NodeJS.ReadableStream; file: any; stat: StatResponse }> {
    const file = await FileModel.findOne({
      where: { id },
    });

    if (!file) {
      throw new Error('File not found');
    }

    const fileSize = file?.filesize || 0;

    if (range) {
      if (range.start >= fileSize || (range.end && range.end >= fileSize)) {
        throw new Error('range is invalid');
      }
    }

    const type = file?.type;

    // We can only transform JPEG, PNG, and WebP
    if (
      type &&
      Object.keys(transformation).length > 0 &&
      ['image/jpeg', 'image/png', 'image/webp'].includes(type)
    ) {
      const resizeOptions = this.parseTransformation(transformation);
      const filenameDisk = file?.filename_disk || '';
      const assetFilename =
        path.basename(filenameDisk, path.extname(filenameDisk)) +
        this.getAssetSuffix(transformation) +
        path.extname(filenameDisk);

      const { exists } = await storage.disk(file.storage).exists(assetFilename);

      if (exists) {
        return {
          stream: storage.disk(file.storage).getStream(assetFilename, range),
          file,
          stat: await storage.disk(file.storage).getStat(assetFilename),
        };
      }

      // Check image size before transforming. Processing an image that's too large for the
      // system memory will kill the API. Sharp technically checks for this too in it's
      // limitInputPixels, but we should have that check applied before starting the read streams
      const { width, height } = file;

      if (!width || !height || width > 6000 || height > 6000) {
        throw new Error(
          `Image is too large to be transformed, or image size couldn't be determined.`
        );
      }

      return await semaphore.runExclusive(async () => {
        const readStream = storage
          .disk(file.storage)
          .getStream(filenameDisk, range);
        const transformer = sharp({
          limitInputPixels: Math.pow(6000, 2),
          sequentialRead: true,
        })
          .rotate()
          .resize(resizeOptions);

        if (transformation.quality) {
          transformer.toFormat(type.substring(6) as 'jpeg' | 'png' | 'webp', {
            quality: Number(transformation.quality),
          });
        }

        await storage
          .disk(file.storage)
          .put(assetFilename, readStream.pipe(transformer), type);

        return {
          stream: storage.disk(file.storage).getStream(assetFilename, range),
          stat: await storage.disk(file.storage).getStat(assetFilename),
          file,
        };
      });
    } else {
      const filenameDisk = file?.filename_disk || '';
      const readStream = storage
        .disk(file?.storage)
        .getStream(filenameDisk, range);
      const stat = await storage.disk(file?.storage).getStat(filenameDisk);
      return { stream: readStream, file, stat };
    }
  }

  private parseTransformation(transformation: Transformation): ResizeOptions {
    const resizeOptions: ResizeOptions = {};

    if (transformation.width)
      resizeOptions.width = Number(transformation.width);
    if (transformation.height)
      resizeOptions.height = Number(transformation.height);
    if (transformation.fit) resizeOptions.fit = transformation.fit;
    if (transformation.withoutEnlargement)
      resizeOptions.withoutEnlargement = Boolean(
        transformation.withoutEnlargement
      );

    return resizeOptions;
  }

  private getAssetSuffix(transformation: Transformation) {
    if (Object.keys(transformation).length === 0) return '';

    return (
      '__' +
      Object.entries(transformation)
        .sort((a, b) => (a[0] > b[0] ? 1 : -1))
        .map((e) => e.join('_'))
        .join(',')
    );
  }
}
