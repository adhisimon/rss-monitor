import express from 'express';
import logger from '../../logger.mjs';
import { isValidToken } from '../../model/fetch-queue.mjs';
import { updateFeedInfo } from '../../model/feeds.mjs';

const MODULE_NAME = 'WEBUI.ROUTERS.JOBS';

const router = express.Router();
export default router;

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const pageFetchReport = async (req, res) => {
  const { traceId } = res.locals;

  const { token } = req.params;

  if (!token) {
    const message = `${MODULE_NAME} 6E977362: Missing token`;

    res.status(404).json({
      traceId,
      status: 404,
      message
    });

    logger.verbose(message, {
      traceId
    });

    return;
  }

  const { url } = req.body;
  if (!url) {
    const message = `${MODULE_NAME} 105CBDE3: Missing url on fetch report request`;

    res.status(400).json({
      traceId,
      status: 400,
      message
    });

    logger.warn(message, {
      traceId
    });

    return;
  }

  /**
   * @type {import('rss-parser').Output}
   */
  const data = req.body?.data;
  if (!data) {
    const message = `${MODULE_NAME} 63253CA6: Missing data on fetch report`;

    res.status(400).json({
      traceId,
      status: 400,
      message
    });

    logger.warn(message, {
      traceId,
      token
    });

    return;
  }

  const isValidJobToken = await isValidToken(traceId, url, token);
  if (!isValidJobToken) {
    const message = `${MODULE_NAME} 37310DA0: Invalid token on fetch report`;
    res.status(404).json({
      traceId,
      status: 404,
      message
    });

    logger.warn(message, { traceId, token });

    return;
  }

  logger.info(`${MODULE_NAME} C662A718: Got a page fetch report`, {
    traceId,
    token,
    url
  });

  logger.debug(`${MODULE_NAME} CE1D11C3: Fetch report has data`, {
    traceId,
    data
  });

  res.status(202).json({
    traceId,
    status: 202,
    message: 'Report accepted'
  });

  await updateFeedInfo(traceId, url, data);
};

router.post('/fetch-report/:token', express.json(), pageFetchReport);
