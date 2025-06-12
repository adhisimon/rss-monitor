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
  const query = `
    SELECT DISTINCT url
    FROM feeds
    WHERE
      disabled = 0;
  `.trim();

  try {
    logger.debug(`${MODULE_NAME} 57355921: Fetching url list`, {
      traceId,
      query: pool.format(query)
    });

    const [result] = await pool.query(query);

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
