'use strict';

const _ = require('lodash');
const config = require('./config');
const utils = require('./utils');

const processWeatherData = (rawData) => {
  let data = {};

  // Exit early
  if (rawData === null) {
    return;
  }

  // Set up the main data obj
  data.days = [];
  data.forecasts = [];
  data.city = _.get(rawData, 'city.name');
  data.country = _.get(rawData, 'city.country');

  // Pull out relevant info from each forecast
  _.map(rawData.list, (forecast) => {

    let fcast = { dt: forecast.dt_txt};
    let dateObj = new Date(fcast.dt);
    let dayName = utils.days[dateObj.getDay()];

    // Only grab the interesting stuff
    fcast.day = dayName;
    fcast.daytime = !!(dateObj.getHours() >= 9 && dateObj.getHours() < 21);
    fcast.description = _.capitalize(_.get(forecast, 'weather[0].description'));
    fcast.temp = Math.round(_.get(forecast, 'main.temp'));
    fcast.windSpeed = utils.convertMStoMPH(_.get(forecast, 'wind.speed'));
    fcast.windDirection = utils.getAzimuth(_.get(forecast, 'wind.deg'));
    fcast.pressure = _.get(forecast, 'main.grnd_level');
    fcast.cloudCover = _.get(forecast, 'clouds.all');
    fcast.humidity = _.get(forecast, 'main.humidity');
    data.forecasts.push(fcast);

    // Now grab stuff that will be useful for the daily summary
    let protoDayObj = { day: dayName, highTemp: 0, lowTemp: 100, descriptionList: [] };
    let newObj = false;
    let dayObj = _.find(data.days, {day: dayName});

    if (typeof dayObj === 'undefined') {
      dayObj = protoDayObj;
      newObj = true;
    }

    dayObj.highTemp = fcast.temp > dayObj.highTemp ? fcast.temp : dayObj.highTemp;
    dayObj.lowTemp = fcast.temp < dayObj.lowTemp ? fcast.temp : dayObj.lowTemp;

    if (fcast.daytime) {
      dayObj.descriptionList.push(fcast.description);
    }

    if (newObj){
      data.days.push(dayObj);
    }

  });

  // Get the most repeated weather description for all forecasts in a particular day
  _.map(data.days, (dayObj) => {
    // Amended from http://mikeheavers.com/tutorials/getting_the_most_commonly_repeated_object_value_from_an_array_using_lodash/
    // and updated for lodash 4.x
    dayObj.description = _.chain(dayObj.descriptionList).countBy().toPairs().maxBy(_.last).value();
  });

  return data;

};

const getAPIData = () => {

  return new Promise((resolve, reject) => {

    utils.fetchRemoteURL(utils.buildUrl(config.apiURL, config.apiParams), 'json')
      .then(storeAPIResponse)
      .then(processWeatherData)
      .then(resolve)
      .catch((error) => {
        reject(error);
      });

  });
};

const returnLocalAppData = () => {
  if (checkLocalAPIDataExists()) {
    return processWeatherData(getLocalAPIData());
  }
};

const returnAppData = () => {

  // resetLocalStorage();
  const canMakeAPICall = afterAPICallDelay();

  if (canMakeAPICall) {

    let dataPromise = getAPIData();
    dataPromise.then((data) => {
      return data;
    });

  }

};

const storeAPIResponse = (data) => {

  let datastr;
  if (typeof data === 'object') {
    datastr = JSON.stringify(data);
  }
  localStorage.setItem(config.localRawDataRef, datastr);
  localStorage.setItem(config.lastAPICallRef, _.now());
  return data; // Chain it!
};

const getLocalAPIData = () => JSON.parse(localStorage.getItem(config.localRawDataRef));

const checkLocalAPIDataExists = () => {
  return (localStorage.getItem(config.localRawDataRef) || '').length > 0;
};

const afterAPICallDelay = () => {
  return (Number(localStorage.getItem(config.lastAPICallRef)) + Number(config.apiCallDelay) < _.now());
};

exports.processWeatherData = processWeatherData;
exports.getAPIData = getAPIData;
exports.returnLocalAppData = returnLocalAppData;
exports.returnAppData = returnAppData;
exports.storeAPIResponse = storeAPIResponse;
exports.getLocalAPIData = getLocalAPIData;
exports.checkLocalAPIDataExists = checkLocalAPIDataExists;
exports.afterAPICallDelay = afterAPICallDelay;

