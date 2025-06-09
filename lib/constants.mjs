import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('./package.json'));

const constants = {
  appName: 'rssMonitor',
  appVersion: `v${packageJson.appVersion}`
};

export default constants;
