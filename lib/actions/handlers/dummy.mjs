import logger from '../../logger.mjs';

const MODULE_NAME = 'ACTIONS.HANDLERS.DUMMY';

/**
 *
 * @param {string} traceId
 * @param {import('rss-parser').Item} feedItem
 */
const dummyHandler = async (traceId, feedItem) => {
  logger.warn(`${MODULE_NAME} 207234BA: Not implemented yet`);
};

export default dummyHandler;
