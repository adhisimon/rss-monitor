import { pool } from '../mysql.mjs';
import logger from '../logger.mjs';
import dayjs from 'dayjs';

const MODULE_NAME = 'MODEL.FEEDS';

/**
 *
 * @param {string} traceId
 * @param {string} feedUrl
 * @param {import('rss-parser').Item} item
 */
const insert = async (traceId, feedUrl, item) => {
  const query = `
    INSERT INTO feed_items
    SET
      feed_url = ?,
      title = ?,
      pub_date = ?,
      creator = ?,
      content = ?,
      content_snippet = ?,
      guid = ?
    ON DUPLICATE KEY UPDATE
      title = ?,
      pub_date = ?,
      creator = ?,
      content = ?,
      content_snippet = ?
  `.trim();

  const values = [
    feedUrl,
    item.title,
    dayjs(item.isoDate).format('YYYY-MM-DD HH:mm:ss'),
    item.creator,
    item.content,
    item.contentSnippet,
    item.guid,
    item.title,
    dayjs(item.isoDate).format('YYYY-MM-DD HH:mm:ss'),
    item.creator,
    item.content,
    item.contentSnippet
  ];

  try {
    logger.verbose(`${MODULE_NAME} E1AA520B: Inserting new feed item`, {
      traceId,
      guid: item.guid
    });

    const [result] = await pool.query(query, values);

    logger.verbose(`${MODULE_NAME} E3AA19D4: Inserted`, {
      traceId,
      result
    });
  } catch (e) {
    const newE = new Error(`${MODULE_NAME} 52D6ED7E: Exception on insert`);

    logger.warn(newE.message, {
      traceId,
      eCode: e.code,
      eMessage: e.message || e.toString()
    });

    throw newE;
  }
};

export {
  insert
};
