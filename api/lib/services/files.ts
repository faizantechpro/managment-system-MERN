import formatTitle from '@directus/format-title';
import axios, { AxiosResponse } from 'axios';
import parseEXIF from 'exif-reader';
import { parse as parseICC } from 'icc';
import { clone } from 'lodash';
import { extension } from 'mime-types';
import path from 'path';
import sharp from 'sharp';
import url from 'url';
import { emitAsyncSafe } from '../middlewares/emitter';

import logger from '../logger';
import { storage as privateStorage, publicStorage } from '../storage';
import { PrimaryKey } from '../types';
import parseIPTC from '../utils/parse-iptc';
import { toArray } from '../utils/to-array';
import { FileModel } from '../database/index';
import { FileAttributes, FileCreateAttributes } from '../database/models/file';
import { v4 as uuidv4 } from 'uuid';
import { feedLogServiceFactory } from './feed';
import { AuthUser } from 'lib/middlewares/auth';
import { Forbidden, ServiceUnavailable } from 'lib/middlewares/exception';
const env = process.env;

export class FilesService {
  /**
   * Upload a single new file to the configured storage adapter
   */
  async uploadOne(
    stream: NodeJS.ReadableStream,
    data: Partial<FileAttributes>,
    isPublic = false,
    primaryKey?: PrimaryKey
  ): Promise<PrimaryKey> {
    const storage = isPublic ? publicStorage : privateStorage;
    const payload = clone(data);
    payload.is_public = isPublic;

    if (primaryKey !== undefined) {
      await FileModel.update(payload, { where: { id: primaryKey } });

      // If the file you're uploading already exists, we'll consider this upload a replace. In that case, we'll
      // delete the previously saved file and thumbnails to ensure they're generated fresh
      const disk = storage.disk(payload.storage);

      for await (const file of disk.flatList(String(primaryKey))) {
        await disk.delete(file.path);
      }
    } else {
      payload.id = uuidv4();

      await FileModel.create(payload as FileAttributes);
      primaryKey = payload.id;
    }

    const fileExtension =
      (payload.type && extension(payload.type)) ||
      path.extname(payload.filename_download as string);

    payload.filename_disk = primaryKey + '.' + fileExtension;
    console.log(payload);

    if (!payload.type) {
      payload.type = 'application/octet-stream';
    }

    try {
      console.log(`uploading to s3`, payload.id);
      await storage
        .disk(data.storage)
        .put(payload.filename_disk, stream, payload.type);
    } catch (err) {
      logger.warn(`Couldn't save file ${payload.filename_disk}`, err);
      throw new ServiceUnavailable(
        `Couldn't save file ${payload.filename_disk}`
      );
    }

    const { size } = await storage
      .disk(data.storage)
      .getStat(payload.filename_disk);
    payload.filesize = size;

    if (
      [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/tiff',
      ].includes(payload.type)
    ) {
      const buffer = await storage
        .disk(data.storage)
        .getBuffer(payload.filename_disk);
      const meta = await sharp(buffer.content, {}).metadata();

      if (meta.orientation && meta.orientation >= 5) {
        payload.height = meta.width;
        payload.width = meta.height;
      } else {
        payload.width = meta.width;
        payload.height = meta.height;
      }

      payload.filesize = meta.size;
      payload.metadata = {};

      if (meta.icc) {
        try {
          payload.metadata.icc = parseICC(meta.icc);
        } catch (err) {
          logger.warn(`Couldn't extract ICC information from file`, err);
        }
      }

      if (meta.exif) {
        try {
          payload.metadata.exif = parseEXIF(meta.exif);
        } catch (err) {
          logger.warn(`Couldn't extract EXIF information from file`, err);
        }
      }

      if (meta.iptc) {
        try {
          payload.metadata.iptc = parseIPTC(meta.iptc);
          payload.title = payload.title || payload.metadata.iptc.headline;
          payload.description =
            payload.description || payload.metadata.iptc.caption;
        } catch (err) {
          logger.warn(`Couldn't extract IPTC information from file`, err);
        }
      }
    }

    // update file
    await FileModel.update(payload, { where: { id: primaryKey } });

    emitAsyncSafe(`files.upload`, {
      event: `files.upload`,
      accountability: null,
      collection: 'files',
      item: primaryKey,
      action: 'upload',
      payload,
      schema: 'files',
      database: 'core',
    });

    return primaryKey;
  }

  async createOne(
    data: FileCreateAttributes & {
      tenant_id: string;
      contact_id?: string;
      deal_id?: string;
      organization_id?: string;
    },
    user: AuthUser
  ): Promise<PrimaryKey> {
    const feedLogService = feedLogServiceFactory(user);

    const { contact_id, deal_id, organization_id, ...fileData } = data;

    const fileObj = await FileModel.create(fileData);
    const file = fileObj.toJSON();

    const feedPayload = {
      id: file.id,
      filename_download: file.filename_download,
      filesize: file.filesize,
      type: file.type,
      uploaded_on: file.uploaded_on,
    };
    await feedLogService.create({
      tenant_id: data.tenant_id,
      summary: 'File uploaded',
      type: 'file',
      object_data: feedPayload,
      created_by: file.uploaded_by!,
      contact_id,
      organization_id,
      deal_id,
    });

    return file.id;
  }

  async readOne(key: PrimaryKey, query?: any): Promise<FileAttributes> {
    const file = await FileModel.findOne({ where: { id: key } });

    // TODO lol what? this should be 404....
    if (!file) {
      throw new Forbidden();
    }

    return file;
  }

  async updateOne(key: PrimaryKey, data: any): Promise<PrimaryKey> {
    const file = await FileModel.update(data, { where: { id: key } });

    // TODO lol what? this should be 404....
    if (!file) {
      throw new Forbidden();
    }

    return key;
  }

  /**
   * Import a single file from an external URL
   */
  async importOne(
    importURL: string,
    body: Partial<FileAttributes>
  ): Promise<PrimaryKey> {
    // const fileCreatePermissions = this.schema.permissions.find(
    // 	(permission) => permission.collection === 'directus_files' && permission.action === 'create'
    // );

    // if (this.accountability?.admin !== true && !fileCreatePermissions) {
    // 	throw new Forbidden();
    // }

    let fileResponse: AxiosResponse<NodeJS.ReadableStream>;

    try {
      fileResponse = await axios.get<NodeJS.ReadableStream>(importURL, {
        responseType: 'stream',
      });
    } catch (err) {
      logger.warn(`Couldn't fetch file from url "${importURL}"`, err);
      throw new ServiceUnavailable(
        `Couldn't fetch file from url "${importURL}"`
      );
    }

    const parsedURL = url.parse(fileResponse.request.res.responseUrl);
    const filename: string = path.basename(parsedURL.pathname as string);

    const payload: Partial<FileAttributes> = {
      id: uuidv4(),
      tenant_id: body.tenant_id,
      filename_download: filename,
      storage: toArray(env.STORAGE_LOCATIONS as string)[0],
      type: fileResponse.headers['content-type'],
      title: formatTitle(filename),
      ...(body || {}),
    };

    return await this.uploadOne(fileResponse.data, payload);
  }

  /**
   * Delete a file
   */
  async deleteOne(key: PrimaryKey, opts?: any): Promise<PrimaryKey> {
    await FileModel.destroy({ where: { id: key } });
    return key;
  }

  /**
   * Delete multiple files
   */
  // async deleteMany(keys: PrimaryKey[], opts?: MutationOptions): Promise<PrimaryKey[]> {
  // 	const files = await FileModel.findAll(keys, { attributes: ['id', 'storage'] });

  // 	if (!files) {
  // 		throw new Forbidden();
  // 	}

  // 	await super.deleteMany(keys);

  // 	for (const file of files) {
  // 		const disk = storage.disk(file.storage);

  // 		// Delete file + thumbnails
  // 		for await (const { path } of disk.flatList(file.id)) {
  // 			await disk.delete(path);
  // 		}
  // 	}

  // 	if (cache && env.CACHE_AUTO_PURGE && opts?.autoPurgeCache !== false) {
  // 		await cache.clear();
  // 	}

  // 	return keys;
  // }

  /**
   * @deprecated Use `uploadOne` instead
   */
  async upload(
    stream: NodeJS.ReadableStream,
    data: Partial<FileAttributes> & {
      filename_download: string;
      storage: string;
    },
    primaryKey?: PrimaryKey
  ): Promise<PrimaryKey> {
    logger.warn(
      'FilesService.upload is deprecated and will be removed before v9.0.0. Use uploadOne instead.'
    );

    return await this.uploadOne(stream, data, false, primaryKey);
  }

  /**
   * @deprecated Use `importOne` instead
   */
  async import(
    importURL: string,
    body: Partial<FileAttributes>
  ): Promise<PrimaryKey> {
    return await this.importOne(importURL, body);
  }
}
