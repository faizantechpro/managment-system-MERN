import formatTitle from '@directus/format-title';
import Busboy from 'busboy';
import express from 'express';
import Joi from 'joi';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import {
  feedFileServiceFactory,
  feedLogServiceFactory,
  FilesService,
} from '../services';
import { PrimaryKey } from '../types';
import asyncHandler from '../utils/async-handler';
import { toArray } from '../utils/to-array';
import { FileAttributes } from '../database/models/file';
import { Forbidden, InvalidPayload } from 'lib/middlewares/exception';

const env = process.env;

const router = express.Router();

export const multipartHandler = asyncHandler(async (req: any, res, next) => {
  if (req.is('multipart/form-data') === false) return next();

  const busboy = new Busboy({ headers: req.headers });
  const savedFiles: PrimaryKey[] = [];
  const service = new FilesService();

  const existingPrimaryKey = req.params.pk || undefined;

  /**
   * The order of the fields in multipart/form-data is important. We require that all fields
   * are provided _before_ the files. This allows us to set the storage location, and create
   * the row in directus_files async during the upload of the actual file.
   */

  let disk: string = toArray(env.STORAGE_LOCATIONS as string)[0];
  const payload: Partial<FileAttributes> & { organization_id?: string } = {
    tenant_id: req.user.tenant,
  };
  let fileCount = 0;
  let organizationId = '';

  busboy.on(
    'field',
    (fieldname: keyof FileAttributes | 'organization_id', val: any) => {
      if (fieldname === 'storage') {
        disk = val;
      }
      if (val !== '') {
        payload[fieldname] = val;
      }

      if (fieldname === 'organization_id') {
        organizationId = val;
      }
    }
  );

  busboy.on(
    'file',
    async (
      fieldname: string,
      fileStream: any,
      filename: string,
      encoding: any,
      mimetype: any
    ) => {
      // feels so hacky.... forgive me
      // TODO clean it up
      if (
        organizationId &&
        req.user &&
        req.user.jwt.scope === 'guest' &&
        req.user.jwt.resource_access.organization[0].id !== organizationId
      ) {
        return next(new Forbidden());
      }

      fileCount++;

      if (!payload.title) {
        payload.title = formatTitle(path.parse(filename).name);
      }

      if (req.user.id) {
        payload.uploaded_by = req.user.id;
      } else if (req.user.jwt.shared_by_id) {
        payload.uploaded_by = req.user.jwt.shared_by_id;
      }

      const payloadWithRequiredFields: Partial<FileAttributes> & {
        filename_download: string;
        type: string;
        storage: string;
      } = {
        ...payload,
        filename_download: filename,
        type: mimetype,
        storage: payload.storage || disk,
      };

      try {
        const primaryKey = await service.uploadOne(
          fileStream,
          payloadWithRequiredFields,
          existingPrimaryKey
        );
        savedFiles.push(primaryKey);
        tryDone();
      } catch (error) {
        busboy.emit('error', error);
      }
    }
  );

  busboy.on('error', (error: Error) => {
    next(error);
  });

  busboy.on('finish', () => {
    tryDone();
  });

  req.pipe(busboy);

  function tryDone() {
    if (savedFiles.length === fileCount) {
      res.locals.savedFiles = savedFiles;
      res.locals.payload = payload;
      return next();
    }
  }
});

const importSchema = Joi.object({
  url: Joi.string().required(),
  data: Joi.object(),
});

router.post(
  '/import',
  asyncHandler(async (req, res) => {
    const { error } = importSchema.validate(req.body);

    if (error) {
      throw new InvalidPayload(error.message);
    }

    const service = new FilesService();

    const primaryKey = await service.importOne(req.body.url, {
      ...req.body.data,
      tenant_id: req.user.tenant,
    });

    const record = await service.readOne(primaryKey, req.query);
    res.locals.payload = { data: record || null };

    res.json(primaryKey);
  })
);

router.get(
  '/files/:pk',
  asyncHandler(async (req, res) => {
    const service = new FilesService();

    const record = await service.readOne(req.params.pk, req.query);

    res.json({ data: record || null });
  })
);

router.patch(
  '/files/:pk',
  multipartHandler,
  asyncHandler(async (req, res, next) => {
    const service = new FilesService();

    await service.updateOne(req.params.pk, req.body);

    try {
      const record = await service.readOne(req.params.pk, req.query);
      res.locals.payload = { data: record || null };
    } catch (error) {
      if (error instanceof Forbidden) {
        return next();
      }

      throw error;
    }

    res.json(res.locals.payload);
  })
);

router.delete(
  '/files/:pk',
  asyncHandler(async (req, res) => {
    const feedFileService = feedFileServiceFactory(req.user);
    const activityFile = await feedFileService.getActivityFilesByFileId(
      req.params.pk
    );

    if (activityFile) {
      await feedFileService.deleteActivityFile(req.params.pk);
    }

    const service = new FilesService();
    await service.deleteOne(req.params.pk);

    res.json();
  })
);

router.delete(
  '/files/:pk/activity',
  asyncHandler(async (req, res) => {
    const { id: userId } = req.user;
    const feedLogService = feedLogServiceFactory(req.user);
    const feedFileService = feedFileServiceFactory(req.user);

    const activityFile = await feedFileService
      .deleteActivityFile(req.params.pk)
      .catch((err) => console.log(err));

    if (activityFile) {
      const { contact_id, organization_id, deal_id } = activityFile || {};

      const service = new FilesService();
      const { filename_download, filesize, type } = await service.readOne(
        req.params.pk,
        {}
      );
      await service.deleteOne(req.params.pk).catch((err) => console.log(err));

      const dataObject = {
        filename_download,
        filesize,
        type,
      };

      const body = {
        id: uuidv4(),
        assigned_user_id: userId,
        modified_user_id: userId,
        created_by: userId,
        contact_id,
        organization_id,
        deal_id,
        ...dataObject,
      };

      await feedLogService.create({
        ...body,
        type: 'fileDeleted',
        summary: 'File Deleted',
        object_data: dataObject,
        tenant_id: req.user.tenant,
      });

      return res.json({
        id: req.params.pk,
      });
    } else {
      return res
        .status(404)
        .json({ error: 'This file was removed', code: 404 });
    }
  })
);

router.put(
  '/files/:pk/activity/',
  asyncHandler(async (req, res) => {
    const { id: userId } = req.user;
    const { name } = req.body;
    const feedLogService = feedLogServiceFactory(req.user);
    const feedFileService = feedFileServiceFactory(req.user);

    const activityFile = await feedFileService
      .getActivityFilesByFileId(req.params.pk)
      .catch((err) => console.log(err));

    if (activityFile) {
      const { contact_id, organization_id, deal_id } = activityFile || {};

      const service = new FilesService();
      await service
        .updateOne(req.params.pk, { filename_download: name, title: name })
        .catch((err) => console.log(err));

      const { filename_download, filesize, type } = await service.readOne(
        req.params.pk,
        {}
      );

      const dataObject = {
        filename_download,
        filesize,
        type,
      };

      const body = {
        id: uuidv4(),
        assigned_user_id: userId,
        modified_user_id: userId,
        created_by: userId,
        contact_id,
        organization_id,
        deal_id,
        ...dataObject,
      };

      await feedLogService.create({
        ...body,
        type: 'fileRename',
        summary: 'File Rename',
        object_data: dataObject,
        tenant_id: req.user.tenant,
      });

      return res.json({
        id: req.params.pk,
      });
    } else {
      return res.status(403).json({ error: 'Forebidden', code: 404 });
    }
  })
);

export default router;
