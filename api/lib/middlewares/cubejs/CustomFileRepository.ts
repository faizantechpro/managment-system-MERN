import path from 'path';
import { FileRepository } from '@cubejs-backend/server-core';

/**
 * What is this class, why do we need it??? Because: https://github.com/Identifee/cube.js/blob/aa880fe35e827338f71d7cb5649354896d4f205a/packages/cubejs-backend-standalone/FileRepository.js#L12
 *
 * When using typescript, you really should not be doing anything like this: path.join(process.cwd(), this.repositoryPath);
 * Typescript is transpiled to JS and files are placed in /dist and when running locally, the source directory is used. cwd() will then
 * result in a path like `${cwd}/src/schema`. This will work on local but not when we move into production /dist usage. It will also
 * break whenever we launch the express server from some other place other than the repository root as cwd will then change from something
 * like "/home/user/src/schema" to "/home/src/schema" (LOL!!).
 *
 * Either way, too many cases to handle so instead we must override the FileRepository class and add the TS way
 * to handle this issue
 */
export class CustomFileRepository extends FileRepository {
  constructor() {
    // TS way to generate path. This allows us to use a schema path RELATIVE to this class. This way
    // it doesn't matter if we're on local using src/lib files or running in prod using src/dist
    const repositoryPath = path.join(__dirname, './schema');
    super(repositoryPath);
    (this.repositoryPath as any) = repositoryPath;
  }

  public localPath(): string {
    return this.repositoryPath;
  }
}
