'use strict';

const ko = require('knockout');
const app = require('./app');
const domready = require('domready');

// Initially, get local data if available
let weatherData = app.returnLocalAppData() || null;

const vm = {
  showingSummary: ko.observable(true),
  data: ko.observable(weatherData)
};
vm.niceHours = (dt) => {return (new Date(dt).getHours() + ':00' || '')};
vm.toggleView = () => {
  vm.showingSummary(!vm.showingSummary());
};


// domready browser support: IE6+, Firefox 2+, Safari 3+, Chrome *, Opera *
domready(function() {

  // Fire off Knockout
  ko.applyBindings(vm);

  // Go get fresh api data
  app.getAPIData().then(
    (data) => {
      vm.data(data);
    }
  );

});

