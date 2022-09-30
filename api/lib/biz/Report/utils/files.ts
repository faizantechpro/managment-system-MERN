import * as fs from 'fs';
import * as path from 'path';

/**
 * Given a file path RELATIVE to public directory, a binary chunk will be returned.
 * This is then to be used as base64 in any img or style tags. This is because
 * puppeteer cannot render images by URL in headless.
 */
export function fileToBinaryChunk(filePath: string) {
  const pathToPublic = path.join(__dirname, '/../../../../../public');
  return fs.readFileSync(`${pathToPublic}${filePath}`).toString('base64');
}

/**
 * Returns the proper src value for img binary chunk
 *
 * @param filePath Relative to /public directory!
 */
export function imgAsBinary(filePath: string) {
  return `data:image/png;base64,${fileToBinaryChunk(filePath)}`;
}

/**
 * Returns the proper href value for css binary chunk
 *
 * @param filePath Relative to /public directory!
 */
export function cssAsBinary(filePath: string) {
  return `data:text/css;charset=utf-8;base64,${fileToBinaryChunk(filePath)}`;
}
