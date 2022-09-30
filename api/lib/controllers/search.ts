import { Router } from 'express';
import { toString } from 'lodash';

import GlobalSearchService from 'lib/services/search';
import asyncHandler from '../utils/async-handler';
const router = Router();
const path = '/search';

router.get(
  path,
  asyncHandler(async (req, res) => {
    const { s } = req.query;
    const searchTerm = toString(s);
    const data = await GlobalSearchService.search(req.user, searchTerm);

    return res.json(data);
  })
);

export default router;
