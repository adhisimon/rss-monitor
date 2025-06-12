import uniqid from 'uniqid';
import { getUrlListToFetch } from './model/feeds.mjs';
import enqueueFetch from './enqueue-fetch.mjs';

(async () => {
  const traceId = uniqid();

  const urls = await getUrlListToFetch(traceId);

  urls.map(async (urlToFetch) => {
    await enqueueFetch(traceId, urlToFetch);
    return null;
  });
})();
