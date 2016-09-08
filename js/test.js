'use strict';

const test = require('tape');

const _ = require('lodash');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const utils = require('./utils');
const config = require('./config');
const app = require('./app');

const fix = require('./testfixtures.js');

if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  global.localStorage = new LocalStorage('./.localstorage');
}


test('localStorage tests', function (t) {

  t.plan(3);

  let key = 'testKey';
  let val = 'testVal';

  t.equal(localStorage.getItem(key), null);

  localStorage.setItem(key, val);
  t.equal(localStorage.getItem(key), val);
  localStorage.removeItem(key);

  t.equal(localStorage.getItem(key), null);

});


test('buildUrl tests', function (t) {
  t.plan(3);
  let createdApiUrl = utils.buildUrl(config.apiURL, config.apiParams);
  t.equal(utils.buildUrl(fix.testUrl), fix.testUrl);
  t.equal(utils.buildUrl(fix.testUrl, fix.testParams), fix.testUrl + '?' + fix.testParams);
  t.equal(createdApiUrl, fix.apiURL);
});


test('fetch tests', function (t) {
  t.plan(2);
  t.equal(typeof fetch, 'function');
  fetch(fix.corstesturl)
    .then(function(response) {
      t.ok(response.ok);
    });
});


test.skip('store data tests', function (t) {

  t.plan(3);
  t.equal(typeof utils.storeAPIResponse, 'function');

  let oldTimeRef = localStorage.getItem(config.lastAPICallRef);

  utils.storeAPIResponse(fix.testObj);

  t.deepEqual(JSON.parse(localStorage.getItem(config.localRawDataRef)), fix.testObj);
  t.notEqual(localStorage.getItem(config.lastAPICallRef), oldTimeRef);

});


test.skip('retrieve data tests', function (t) {

  t.plan(2);
  t.equal(typeof utils.getLocalAPIData, 'function');

  localStorage.setItem(config.localRawDataRef, JSON.stringify(fix.testObj));
  let retrievedData = utils.getLocalAPIData();

  t.deepEqual(retrievedData, fix.testObj);

});


test.skip('check api delay tests', function (t) {

  t.plan(3);
  t.equal(typeof utils.afterAPICallDelay, 'function');

  localStorage.setItem(config.lastAPICallRef, fix.withinDelay);
  t.equals(utils.afterAPICallDelay(), false);

  localStorage.setItem(config.lastAPICallRef, fix.afterDelay);
  t.equals(utils.afterAPICallDelay(), true);

});


test('get api data tests', (t) => {

  console.log('API delay passed: ' + app.afterAPICallDelay());

  if (app.afterAPICallDelay()) {

    t.plan(2);
    localStorage.setItem(config.localRawDataRef, '');
    localStorage.setItem(config.lastAPICallRef, '');

    let whenFetchCompleted = utils.fetchRemoteURL(utils.buildUrl(config.apiURL, config.apiParams), 'json');
    whenFetchCompleted
      .then((response) => {
        app.storeAPIResponse(response);
        t.notEqual(localStorage.getItem(config.localRawDataRef), '');
        t.notEqual(localStorage.getItem(config.lastAPICallRef), '');
      })
      .catch((error) => {
        console.error('There was a problem getting a response from the API.\n' + JSON.stringify(error, null, 2));
      });

  } else {
    console.log('Skipping due to being within API call delay.');
    t.end();
  }

});

test('test function getAzimuth()', (t) => {
  t.plan(12);
  fix.azimuthTests.forEach((set) => {
    let result = utils.getAzimuth(set[0]);
    t.equals(result, set[1], `Angle is: ${set[0]}; result '${result}' should match '${set[1]}'`);
  })
});

test('test function convertMStoMPH()', (t) => {
  t.plan(6);
  fix.convertMStoMPHTests.forEach((set) => {
    let result = utils.convertMStoMPH(set[0]);
    t.equals(result, set[1], `ms is: ${set[0]}; result '${result}' should match '${set[1]}'`);
  })
});


test('test function processWeatherData()', (t) => {
  t.plan(1);
  t.equal(typeof app.processWeatherData, 'function');
  // Write more tests
});


test('test function getAPIData()', (t) => {
  t.plan(1);
  t.equal(typeof app.getAPIData, 'function');
  // Write more tests
});


test('test function returnAppData()', (t) => {
  t.plan(1);
  t.equal(typeof app.returnAppData, 'function');
  // Write more tests
});



