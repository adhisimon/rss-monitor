import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('./package.json'));

const constants = {
  appName: 'rss-monitor',
  appVersion: `v${packageJson.version}`,
  copyright: 'Adhidarma Hadiwinoto <me@adhisimon.org> (c) 2025',
  repoUrl: 'https://github.com/adhisimon/rss-monitor',
  baseUrl: process.env.BASE_URL,
  callbackBaseUrl: process.env.BASE_URL_FOR_CALLBACK,

  webuiListenPort: Number(process.env.WEB_LISTEN_PORT) || 12804,

  redisUrl: process.env.REDIS_URL || 'redis://localhost',
  fetchQueueTTL: Number(process.env.FETCH_QUEUE_TTL) || (5 * 60)
};

if (!constants.callbackBaseUrl) {
  constants.callbackBaseUrl = `http://localhost:${constants.webuiListenPort}`;
}

export default constants;
