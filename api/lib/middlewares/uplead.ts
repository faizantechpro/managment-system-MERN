import { RequestHandler } from 'express';
import proxy from 'express-http-proxy';

const UPLEAD_APIKEY = process.env.UPLEAD_APIKEY;
const UPLEAD_APIURL = process.env.UPLEAD_APIURL || 'https://api.uplead.com';

const proxyOptions = {
  proxyReqPathResolver: (req: any) => {
    const { originalUrl } = req;
    const url = originalUrl.replace(/^\/api\/prospects/, '/v2');
    return url;
  },
  proxyReqOptDecorator: (proxyReqOpts: any, srcReq: any) => {
    proxyReqOpts.headers = {
      'Content-Type': 'application/json',
      Authorization: `${UPLEAD_APIKEY}`,
    };
    return proxyReqOpts;
  },
};

const uplead: RequestHandler = proxy(UPLEAD_APIURL, proxyOptions);

export default uplead;
