# Weather App

5 day forecast for given city

## Overview

### The task
_**The brief:** in four hours, build a one page app to show the 5-day weather forecast for a given city using the OpenWeatherMap api._

My inital thought was it would be important to keep the solution very focused, given the timescale. As I imagined what the solution might look like, I felt it might be an idea to have the look of the app be almost all text, as if output by a console app. It could be used inside a sidebar widget perhaps, or some other small space.

Another key feature I wanted was for the app to store the api response locally (once an initial connection to the api had been achieved) and, beyond that, to be able to continue to work offline.

And finally, I wanted to try some newer technologies

### The approach
My first decision was between using technologies and techniques I am familiar with, or to push the boat out a little and take on some new stuff. Relishing the challenge, I settled on a stack that included using ES6 where possible, and as little else as possible.

Normally, I'd start a project like this by installing grunt, jQuery, etc. but for a small app like this, I decided to stick to npm scripts to run the dev set up. Similar choices were made for test framework, dev server and ui framework. Also, I wanted to write in a more functional programming style, making use of chaining and promises where possible, and used lodash for utility functions.

### The solution
First steps were setting up git, npm, getting an account at OpenWeatherMap, and studying the docs. The returned api data showed me what would be possible to display and I quickly realised that processing that data beyond just displaying it would be key to showing useful info to the user. I also noted the limit of one call every 10 minutes on the free account which pushed me to throttle api requests.

I wanted to work in a TDD way, so the next thing I got up and running was a testing setup. I had wanted to try out Tape for a while, and this was a perfect place for it. As much as possible, I forced myself to write the test first, then code a solution to meet that test. I initially focused on retrieving the api data and storing it using localStorage which both allowed quick display of interface once the api was hit once, plus allow the app to continue to work even if offline.

Once I has the api call and local storage code was written, I next wanted to tackle parsing the returned data into a more focused set of derived pieces of information. I wrote code that summarises each day, including showing the most commonly reported weather description across all daytime forecasts for that day, and pulling out the lowest and highest reported temps. I wrote little functions that transformed the wind direction in degrees into cardinal/ordinal names and converted the supplied wind speed in m/s into the UK-typical mph.

Next, onto the UI. I'll admit it: my intention had been to use React but, given it's new to me, I felt it better to write decent code using a framework I was familiar with, rather than newbie React code. Also, I noticed that a lot of documentation is in transition from the old `React.createClass` to the new `extends React.Component`, and where that all fits in with ES6 classes and modules, which was slowing down my progress. So, eventually, I settled on Knockout. It's not the fastest framework anymore, but for something like this, where two-way data binding isn't required, it's perfectly capable and, in practice, there's no delay at all displaying such a simple ui. I ensured the display works well for all display sizes, hiding sections of the details table at smaller sizes, and the markup is simple and accessible.

### The changes I'd make
If I were to start this project again, I would certainly make different choices.
1. I spent too long trying to get a good combination of tooling setup instead of using a seed project or helper like [Roc](https://github.com/rocjs/roc) or [Sagui](https://github.com/saguijs/sagui) or similar. Ultimately, I didn't count this time against my 4 hours.
1. I spent too long before deciding against React for ui which wasted a lot of time getting that set up, starting write code, then stripping it out again.
1. I would have tried very hard to maintain the discipline of writing tests first, as the ones I did write were excellent at showing me were I'd missed things like moving functions to different files, etc. By the end, I was organising code more than writing new stuff, so what I did write are missing test.

## Usage
The repo for the project can be found here: xxx

Please download the zip and unpack it into an empty folder

### Build
`npm install`

The only assumption is, as the requirements state, "a node.js environment with the latest version installed", so I've developed this with node 6.5.0 which may mean there are problems if using an earlier version.

### Test
`npm test`

### Run
`npm start`

The app will automatically open in a browser

### Build
`npm run build`

### Hosting location
[http://fusionzoo.com/weather/](http://fusionzoo.com/weather/)



## Further work
Here are some quick thoughts on further work I would have done, given more time

* code testing coverage
* flesh out the test for better coverage
* ui: change displayed units (mph to kmph, etc.)
* persist the processed data as well as the raw api data
* add icons and other ui elements to make a more engaging interface
* put together a 'build' script that minifies/autoprefixes / strips out unused stuff / and parcels up to a 'static' folder
* have a nicer mobile view of details than just hiding stuff that doesn't fit
* auto deploy after git push to remote host
