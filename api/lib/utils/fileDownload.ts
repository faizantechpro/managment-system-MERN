import { Range } from '@directus/drive';
import ms from 'ms';

import { AssetsService } from '../services/assets';
import { Transformation } from '../types/assets';

const env = process.env;

const fileDownload = async (req: any, res: any) => {
  const pk = req?.params?.pk || req?.params?.id;
  const id = pk.substring(0, 36);
  const service = new AssetsService();

  const transformation: Transformation = {} as Transformation;

  let range: Range | undefined = undefined;

  if (req.headers.range) {
    // substring 6 = "bytes="
    const rangeParts = req.headers.range.substring(6).split('-');

    range = {
      start: rangeParts[0] ? Number(rangeParts[0]) : 0,
      end: rangeParts[1] ? Number(rangeParts[1]) : undefined,
    };

    if (Number.isNaN(range.start) || Number.isNaN(range.end)) {
      throw new Error(`range not in range?`);
    }
  }

  const { stream, file, stat } = await service.getAsset(
    req.user.tenant,
    id,
    transformation,
    range
  );

  const access = 'private';

  res.attachment(file.filename_download);
  res.setHeader('Content-Type', file.type);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader(
    'Cache-Control',
    `${access}, max-age=${ms(env.ASSETS_CACHE_TTL as string) / 1000}`
  );

  if (range) {
    res.setHeader(
      'Content-Range',
      `bytes ${range.start}-${range.end || stat.size - 1}/${stat.size}`
    );
    res.status(206);
    res.setHeader(
      'Content-Length',
      (range.end ? range.end + 1 : stat.size) - range.start
    );
  } else {
    res.setHeader('Content-Length', stat.size);
  }

  if ('download' in req.query === false) {
    res.removeHeader('Content-Disposition');
  }

  if (req.method.toLowerCase() === 'head') {
    res.status(200);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', stat.size);

    return res.end();
  }

  stream.pipe(res);
};

export default fileDownload;
