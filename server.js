const express = require('express');

const hbs = require('hbs');

const fs = require('fs');

const bodyParser = require('body-parser');

const geocode = require('./geocode/geocode');

const weather = require('./weather/weather');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) =>{
// 	var now = new Date().toString();
// 	var log = `${now}: ${req.method} ${req.url}`;
// 	console.log(log);
// 	fs.appendFile('server.log', log + '\n', (err) =>{
// 		if(err){
// 		console.log('unable to append to server.log');
// 		}
// 	});

// 	next();
// });

// app.use((req, res, next) =>{

// 	res.render('meintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () =>{
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) =>{

	return text.toUpperCase();
});

app.get('/', (req, res) =>{

	res.render('home.hbs', {
		pageTitle: 'Home',
		welcomeMessage: 'Welcome to Tijuana'
	});
});

app.post('/', function (req, res) {

	let address = req.body.address_input

	geocode.geocodeAddress(address, (errorMessage, results) =>{

	if (errorMessage) {

		console.log(errorMessage);

	}else{

		console.log(results.address);

		weather.getWeather(results.latitude, results.longitude, (errorMessage, weatherResults) =>{

			if (errorMessage) {

				console.log(errorMessage);

			}else{

				let weatherText = `It's currently ${weatherResults.temperature}. It feels like ${weatherResults.apparentTemperature}.`;

				// console.log(`It's currently ${weatherResults.temperature}. It feels like ${weatherResults.apparentTemperature}.`);

				res.render('home.hbs', {message: weatherText});

			}
		});

	}

});
  
})

app.get('/projects', (req, res) =>{
	res.render('projects.hbs', {
		pageTitle: 'Projects',
	});
});

app.get('/about', (req, res) =>{
	res.render('about.hbs', {
		pageTitle: 'About Page'
	});
});

app.get('/bad', (req, res) =>{

	res.send({
		message: 'Bad request'
	});
});

app.listen(port, () =>{
	console.log(`server is up on port ${port}!`);
});