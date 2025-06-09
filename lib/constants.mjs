import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('./package.json'));

const constants = {
  appName: 'rss-monitor',
  appVersion: `v${packageJson.version}`,
  copyright: 'Adhidarma Hadiwinoto <me@adhisimon.org> (c) 2025',
  repoUrl: 'https://github.com/adhisimon/rss-monitor',

  webuiListenPort: Number(process.env.WEB_LISTEN_PORT) || 12804
};

export default constants;
