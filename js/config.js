'use strict';

const glasgowID = '2648579';
const myAPPID = '9360a7570339f8ead819897c1080e622';
const dataFormat = 'metric';

exports.apiURL = 'http://api.openweathermap.org/data/2.5/forecast';
exports.apiParams = `id=${glasgowID}&units=${dataFormat}&APPID=${myAPPID}`;

exports.apiCallDelay = 1000*60*30; // 30 minutes

exports.localRawDataRef = 'localRawData';
exports.lastAPICallRef = 'lastAPICall';

