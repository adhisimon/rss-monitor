import logger from '../logger.mjs';
import { getActionsByUrl } from '../model/feed-actions.mjs';
import dummyHandler from './handlers/dummy.mjs';

const MODULE_NAME = 'ACTIONS';

const validActions = [
  'dummy'
];

const executeAction = async (traceId, action, target, feedItem) => {
  if (action === 'dummy') {
    await dummyHandler(traceId, feedItem);
  } else {
    logger.warn(`${MODULE_NAME} 75B07366: Invalid actions`, {
      traceId,
      action
    });
  }
};

/**
 *
 * @param {string} traceId
 * @param {string} feedUrl
 * @param {import('rss-parser').Item[]} feedItems
 */
const processFeedItems = async (traceId, feedUrl, feedItems) => {
  const actions = await getActionsByUrl(traceId, feedUrl);

  actions.map(async (item) => {
    await executeAction(traceId, item.action, item.target, feedItems);

    return null;
  });
};

export {
  validActions,
  executeAction,
  processFeedItems
};
