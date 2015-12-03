'use strict';

var config = {};

config.PHOTON_USERNAME = process.env.PHOTON_USERNAME || '';
config.PHOTON_PASSWORD = process.env.PHOTON_PASSWORD || '';
config.PHOTON_DEVICEID = process.env.PHOTON_DEVICEID || '';

config.WHITELIST = process.env.WHITELIST || [];

module.exports = config;
