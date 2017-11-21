const request = require('request');

let WEATHERKEY = process.env['WEATHERKEY'];

var getWeather = (lat, lng, callback) =>{
	request({
		url: `https://api.darksky.net/forecast/${WEATHERKEY}/${lat},${lng}`,
		json: true
	}, (error, response, body) =>{
		if (error) {
			callback('Unable to connect with darksky server!');

		}else if (response.statusCode == '200') {

			callback(undefined, {

				temperature: body.currently.temperature,
				apparentTemperature: body.currently.apparentTemperature

			});

		}else{

			callback('Unable to fetch weather!');
		}
	});
}

module.exports.getWeather = getWeather