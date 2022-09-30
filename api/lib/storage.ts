import camelcase from 'camelcase';
import {
  LocalFileSystemStorage,
  Storage,
  StorageManager,
  StorageManagerConfig,
} from '@directus/drive';
import { AmazonWebServicesS3Storage } from '@directus/drive-s3';
import { toArray } from './utils/to-array';
import { set } from 'lodash';

const env = process.env;

export let storage: StorageManager;
export let publicStorage: StorageManager;

export function init() {
  storage = new StorageManager(getStorageConfig());
  publicStorage = new StorageManager(getStorageConfig(true));
  registerDrivers(storage);
  registerDrivers(publicStorage);
}

function getStorageConfig(isPublic = false): StorageManagerConfig {
  const config: StorageManagerConfig = {
    disks: {},
  };

  const locations = toArray(env.STORAGE_LOCATIONS as string);

  locations.forEach((location: string) => {
    location = location.trim();

    const diskConfig = {
      driver: env[`STORAGE_${location.toUpperCase()}_DRIVER`] as string,
      config: getConfigFromEnv(`STORAGE_${location.toUpperCase()}_`),
    };

    if (isPublic) diskConfig.config.bucket = diskConfig.config.publicBucket;
    delete diskConfig.config.publicUrl;
    delete diskConfig.config.driver;

    config.disks![location] = diskConfig;
  });

  return config;
}

function registerDrivers(storage: StorageManager) {
  const usedDrivers: string[] = [];

  for (const [key, value] of Object.entries(env)) {
    if ((key.startsWith('STORAGE') && key.endsWith('DRIVER')) === false)
      continue;
    if (value && usedDrivers.includes(value) === false) usedDrivers.push(value);
  }

  usedDrivers.forEach((driver) => {
    const storageDriver = getStorageDriver(driver);

    if (storageDriver) {
      storage.registerDriver<Storage>(driver, storageDriver);
    }
  });
}

function getStorageDriver(driver: string) {
  switch (driver) {
    case 'local':
      return LocalFileSystemStorage;
    case 's3':
      return AmazonWebServicesS3Storage;
  }
}

export function getConfigFromEnv(
  prefix: string,
  omitPrefix?: string | string[]
): any {
  const config: any = {};

  for (const [key, value] of Object.entries(env)) {
    if (key.toLowerCase().startsWith(prefix.toLowerCase()) === false) continue;

    if (omitPrefix) {
      let matches = false;

      if (Array.isArray(omitPrefix)) {
        matches = omitPrefix.some((prefix) =>
          key.toLowerCase().startsWith(prefix.toLowerCase())
        );
      } else {
        matches = key.toLowerCase().startsWith(omitPrefix.toLowerCase());
      }

      if (matches) continue;
    }

    if (key.includes('__')) {
      const path = key
        .split('__')
        .map((key, index) =>
          index === 0
            ? camelcase(camelcase(key.slice(prefix.length)))
            : camelcase(key)
        );
      set(config, path.join('.'), value);
    } else {
      config[camelcase(key.slice(prefix.length))] = value;
    }
  }

  return config;
}
