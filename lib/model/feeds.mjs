import { pool } from '../mysql.mjs';
import logger from '../logger.mjs';

const MODULE_NAME = 'MODEL.FEEDS';

/**
 * Get unique url list to fetch
 *
 * @param {string?} traceId
 * @returns {Promise<string[]>}
 */
const getUrlListToFetch = async (traceId) => {
  const query = `-- getUrlListToFetch 54A1739C
    SELECT DISTINCT feeds.url
    FROM feeds
    LEFT JOIN feed_info ON feed_info.url = feeds.url
    WHERE
      disabled = 0
      AND (
        feed_info.modified IS NULL
        OR
        UNIX_TIMESTAMP(feed_info.modified) < (UNIX_TIMESTAMP() - (COALESCE(feeds.interval, 60) * 60))
      )
    ORDER BY feed_info.modified
  `.trim();

  try {
    logger.debug(`${MODULE_NAME} 57355921: Fetching url list`, {
      traceId,
      query: pool.format(query)
    });

    const [result] = await pool.query(query);

    logger.debug(`${MODULE_NAME} EE1F2420: URL list fetched`, {
      traceId,
      count: result.length
    });

    return result.map((row) => row.url);
  } catch (e) {
    const newE = `${MODULE_NAME} E549F592: Exception on getFetchList`;

    logger.warn(newE.message, {
      traceId,
      eCode: e.code,
      eMessage: e.message || e.toString()
    });
  }
};

export {
  getUrlListToFetch
};
