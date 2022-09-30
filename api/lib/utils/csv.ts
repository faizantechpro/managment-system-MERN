import { parse, Options } from 'csv-parse';

const csv = {
  parser: function <T extends {} = {}>(
    fileStream: NodeJS.ReadableStream,
    options: Options
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const parser = parse(options, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });

      fileStream.pipe(parser);
    });
  },
};

export default csv;
