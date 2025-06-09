import {
  Gauge,
  collectDefaultMetrics,
  register
} from 'prom-client';
import constants from './constants.mjs';

register.setDefaultLabels({
  appName: constants.appName.toLowerCase()
});

collectDefaultMetrics({
  register
});

new Gauge({
  name: 'app_up',
  help: 'Always 1 on running.'
}).set(1);

new Gauge({
  name: 'app_info',
  help: 'Application information.',
  labelNames: [
    'version',
    'copyright'
  ]
}).set({
  version: constants.appVersion,
  copyright: 'Adhidarma Hadiwinoto <me@adhisimon.org> (c) 2025'
}, 1);

// eslint-disable-next-line no-new
new Gauge({
  name: 'uptime',
  help: 'Application uptime in seconds.',
  labelNames: ['app'],
  collect () {
    this.set(process.uptime());
  }
});
