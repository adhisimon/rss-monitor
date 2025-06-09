import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('./package.json'));

const constants = {
  appName: 'rssMonitor',
  appVersion: `v${packageJson.version}`,
  copyright: 'Adhidarma Hadiwinoto <me@adhisimon.org> (c) 2025',
  webuiListenPort: Number(process.env.WEB_LISTEN_PORT) || 12804
};

export default constants;
