import { getUrlListToFetch } from './model/feeds.mjs';

(async () => {
  const urls = await getUrlListToFetch('XXXX');
  console.log(urls);
})();
