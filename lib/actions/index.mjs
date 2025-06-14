import uniqid from 'uniqid';
import logger from '../logger.mjs';
import { getActionsByFeedUuid } from '../model/feed-actions.mjs';
import { getByUrl as getFeedByUrl, touchLastActionTs } from '../model/feeds.mjs';
import dummyHandler from './handlers/dummy.mjs';

const MODULE_NAME = 'ACTIONS';

const validActions = [
  'dummy'
];

/**
 *
 * @param {string} traceId
 * @param {import('../model/feed-actions.mjs').FeedAction} action
 * @param {import('rss-parser').Item} feedItem
 */
const executeAction = async (traceId, action, feedItem) => {
  if (action.action === 'dummy') {
    await dummyHandler(traceId, feedItem);
  } else {
    // logger.warn(`${MODULE_NAME} 75B07366: Invalid actions`, {
    //   traceId,
    //   feedUuid: action.feed_uuid,
    //   actionUuid: action.uuid,
    //   action: action.action
    // });
  }
};

/**
 *
 * @param {string} traceId
 * @param {string} feedUrl
 * @param {import('rss-parser').Item[]} feedItems
 */
const processFeedItems = async (traceId, feedUrl, feedItems) => {
  const feeds = await getFeedByUrl(traceId, feedUrl);

  logger.info(`${MODULE_NAME} 08F4894A: Processing feed items`, {
    traceId,
    feedUrl,
    feedCount: feeds.length,
    itemCount: feedItems.length
  });

  const feedCount = feeds.length;
  for (let feedIdx = 0; feedIdx < feedCount; feedIdx += 1) {
    const feed = feeds[feedIdx];
    let lastActionTs = feed.last_action_ts || '';

    const actions = await getActionsByFeedUuid(traceId, feed.uuid);

    logger.verbose(`${MODULE_NAME} 04D6BCBE: Gonna execute actions`, {
      traceId,
      feedUuid: feed.uuid,
      actionCount: actions.length
    });

    logger.debug(`${MODULE_NAME} 4744EE27: Filtering feed items`, {
      traceId,
      feedUuid: feed.uuid,
      feedLastActionTs: feed.last_action_ts
    });

    const feedItemsToProcessed = feedItems
      .filter((feedItem) => new Date(feedItem.isoDate) > feed.last_action_ts)
      .sort((a, b) => {
        if (!a && !b) return 0;
        if (!a) return -1;
        if (!b) return 1;

        if (a.isoDate < b.isoDate) {
          return -1;
        } else if (a.isoDate > b.isoDate) {
          return 1;
        }

        return 0;
      })
      .slice(-1 * feed.max_items_per_batch);

    logger.verbose(`${MODULE_NAME} CF18AFB6: Feed items filtered`, {
      traceId,
      feedUuid: feed.uuid,
      originalItemCount: feedItems.length,
      filteredItemCount: feedItemsToProcessed.length
    });

    const feedItemCount = feedItemsToProcessed.length;
    for (let feedItemIdx = 0; feedItemIdx < feedItemCount; feedItemIdx += 1) {
      const feedItem = feedItemsToProcessed[feedItemIdx];

      const actionCount = actions.length;
      for (let actionIdx = 0; actionIdx < actionCount; actionIdx += 1) {
        const action = actions[actionIdx];

        const actionTraceId = [
          traceId || '',
          uniqid()
        ].filter((id) => id).join('.');

        await executeAction(actionTraceId, action, feedItem);

        logger.debug(`${MODULE_NAME} 7C3F1BB6: Comparing ts to touch`, {
          traceId,
          feedItemIsoDate: feedItem.isoDate,
          lastActionTs
        });
      }

      if (feedItem.isoDate > lastActionTs) {
        lastActionTs = feedItem.isoDate;
      }
    }

    if (lastActionTs) {
      await touchLastActionTs(traceId, feed.uuid, lastActionTs);
    }
  }
};

export {
  validActions,
  executeAction,
  processFeedItems
};
