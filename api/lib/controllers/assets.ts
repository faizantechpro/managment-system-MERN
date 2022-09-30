import { Router } from 'express';
import validate from 'uuid-validate';

import { storage } from '../storage';
import asyncHandler from '../utils/async-handler';
import { FileModel } from '../database';
import fileDownload from 'lib/utils/fileDownload';
import { Op, WhereOptions } from 'sequelize';
import { defaultTenantId } from 'lib/utils/constants';
import { Forbidden } from 'lib/middlewares/exception';

const router = Router();

router.get(
  '/:pk',

  // Check if file exists and if you have permission to read it
  asyncHandler(async (req, res, next) => {
    /**
     * We ignore everything in the id after the first 36 characters (uuid length). This allows the
     * user to add an optional extension, or other identifier for use in external software (#4067)
     */
    const id = req.params.pk?.substring(0, 36);
    const { tenant } = req.user;
    const { from } = req.query;

    /**
     * This is a little annoying. Postgres will error out if you're trying to search in `where`
     * with a wrong type. In case of directus_files where id is a uuid, we'll have to verify the
     * validity of the uuid ahead of time.
     */
    const isValidUUID = validate(id, 4);
    if (isValidUUID === false) throw new Forbidden();

    const where: WhereOptions = { id, tenant_id: tenant };
    if (from === 'lesson') {
      where.tenant_id = {
        [Op.in]: [tenant, defaultTenantId],
      };
    }

    const file = await FileModel.findOne({
      attributes: ['id', 'storage', 'filename_disk'],
      where,
    });
    if (!file) throw new Forbidden();

    const { exists } = await storage
      .disk(file.storage)
      .exists(file.filename_disk as string);
    if (!exists) throw new Forbidden();

    return next();
  }),

  // Return file
  asyncHandler(async (req, res) => {
    await fileDownload(req, res);
  })
);

export default router;
