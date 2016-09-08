'use strict';

const config = require('./config');
const _ = require('lodash');

exports.testParams = 'this=123&that=abc';
exports.testUrl = 'http://www.test.com';
exports.apiURL = "http://api.openweathermap.org/data/2.5/forecast?id=2648579&units=metric&APPID=9360a7570339f8ead819897c1080e622";
exports.corstesturl = 'https://cors-test.appspot.com/test';
exports.testObj = {"thing": "123"};
const delay = config.apiCallDelay;
exports.withinDelay = _.now() - (delay / 2);
exports.afterDelay = _.now() - (delay * 2);
exports.azimuthTests = [
  [ '0', 'N' ],
  [ '90', 'E' ],
  [ '180', 'S' ],
  [ '270', 'W' ],
  [ '45', 'NE' ],
  [ '135', 'SE' ],
  [ '225', 'SW' ],
  [ '315', 'NW' ],
  [ '359', 'N' ],
  [ '360', 'N' ],
  [ '22', 'N'],
  [ '23', 'NE']
];
exports.convertMStoMPHTests = [
  [1, 2],
  [5, 11],
  [13, 29],
  [21, 47],
  [38, 85],
  [88, 197]
];
