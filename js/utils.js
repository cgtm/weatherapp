'use strict';

const _ = require('lodash');
const config = require('./config');

const buildUrl = (url, params) => {
  if (!url) {
    return '';
  }
  if (params) {
    url =  url + '?' + params;
  }
  return url;
};

const fetchRemoteURL = (url, dataType) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        let bodyHasLoaded;

        if (response.ok) {
          bodyHasLoaded = dataType === 'json' ? response.json() : response.text();
          bodyHasLoaded.then(resolve);
        } else {
          reject(response);
        }

      })
      .catch(reject)
  });
};

const convertMStoMPH = (metresPerSecond) => {
  const multiplier = 2.236936;
  return Math.round(metresPerSecond * multiplier);
};

const getAzimuth = (angle) => {
  angle = Math.floor((angle / 45) + 0.5); // Addition of 0.5 to nudge off directions boundary
  let arr = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return arr[(angle % 8)];
};

const resetLocalStorage = () => localStorage.clear();

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

exports.buildUrl = buildUrl;
exports.fetchRemoteURL = fetchRemoteURL;
exports.getAzimuth = getAzimuth;
exports.convertMStoMPH = convertMStoMPH;
exports.resetLocalStorage = resetLocalStorage;

exports.days = days;
exports.months = months;

