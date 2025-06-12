import uniqid from 'uniqid';
import { getUrlListToFetch } from './model/feeds.mjs';

(async () => {
  const traceId = uniqid();
  const urls = await getUrlListToFetch(traceId);
  console.log(urls);
})();
