import { Router } from 'express';

import { feedLogServiceFactory, sendReportToEmail } from 'lib/services';
import asyncHandler from '../utils/async-handler';
import { FilesService } from '../services';
import ParseSequelizeResponse from 'lib/utils/parseSequelizeResponse';
import fileDownload from 'lib/utils/fileDownload';

const router = Router();
const path = '/organizations/reports';

router.post(
  `${path}/share/`,
  asyncHandler(async (req, res) => {
    const {
      email,
      reportName,
      fileName,
      fileId,
      organizationId,
      subject,
      message,
    } = req.body;
    await sendReportToEmail(
      email,
      reportName,
      fileName,
      fileId,
      organizationId,
      req.user,
      subject,
      message
    );

    return res.json();
  })
);

router.get(
  `/organizations/:organizationId/reports/download/:id`,
  asyncHandler(async (req, res) => {
    const id = req.params.id?.substring(0, 36);
    const createFeed = req.query.createFeed;
    const organizationId = req.params.organizationId;

    await fileDownload(req, res);

    if (createFeed === 'false') return;

    // Activity Feed
    const fileService = new FilesService();
    const fileInfo = await fileService.readOne(id, {});
    const {
      id: fileID,
      filename_download,
      uploaded_on,
    } = ParseSequelizeResponse(fileInfo);
    const dataObject = {
      id: fileID,
      filename_download: filename_download,
      report_name: 'Treasury Management Prospect Report', // TODO Modify Report Name dynamically on download report
      uploaded_on: uploaded_on,
    };

    const feedLogService = feedLogServiceFactory(req.user);
    await feedLogService.create({
      tenant_id: req.user.tenant,
      created_by: req.user?.id,
      organization_id: organizationId,
      type: 'report',
      summary: 'Report downloaded',
      object_data: dataObject,
    });
  })
);

export default router;
