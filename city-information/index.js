const fetch = require('node-fetch');
const firebase = require('firebase');
require('firebase/firestore');
firebase.initializeApp({
    apiKey: "<YOUR_API_KEY>",
    authDomain: "csci8795-finalproject-429d8.firebaseapp.com",
    databaseURL: "https://csci8795-finalproject-429d8.firebaseio.com",
    projectId: "csci8795-finalproject-429d8",
    storageBucket: "csci8795-finalproject-429d8.appspot.com",
    messagingSenderId: "663143206274",
    appId: "1:663143206274:web:7082a2de95e6e8f021539b"
});

const templateBeginning = `
<!DOCTYPE html>
<head>
  <title>City Information</title>
</head>
<body>
    <h1 style="text-align:center;">City Information</h1>
    <h4 style="text-align:center;">City Information is a serverless application that displays some basic information about
    a city and then writes that information to Google Firebase.</h4>
    <div style="text-align:center;">
`;

const templateEnd = `
    </div>
</body>
</html>
`;


/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.cityInformation = (req, res) => {
    console.time("end-to-end");
    const db = firebase.firestore();

    if(req.query.city == null || req.query.city === "") {
        let cityNoInput = '<h4>No city supplied as input! Add "?city=" to URL.</h4>';
        res.send(templateBeginning + cityNoInput + templateEnd);
    } else {
        let cityInput = req.query.city;
        let cityInputHtml = '<h4>City: ' + cityInput + '</h4>';
        //API 1
        console.time("api1");
        fetch('http://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=' + req.query.city)
            .then(res => res.json())
            .then(json => {
                console.timeEnd("api1");
                let currentTemperature = json.current.temp_f;
                let currentTemperatureHtml = '<h4>Current temperature: ' + currentTemperature + ' &#176;F</h4>';
                let currentDateObj = new Date();
                let currentYear = currentDateObj.getFullYear();
                let currentMonth = currentDateObj.getMonth() + 1;
                let currentDay = currentDateObj.getDate();
                let currentDateStr = currentYear + "-" + currentMonth + "-" + currentDay;
                //API 2
                console.time("api2");
                fetch('http://api.weatherapi.com/v1/astronomy.json?key=<YOUR_API_KEY>&q=' + req.query.city + 
                    "&dt=" + currentDateStr)
                    .then(res => res.json())
                    .then(json => {
                        console.timeEnd("api2");
                        let citySunrise = json.astronomy.astro.sunrise;
                        let citySunriseHtml = '<h4>Sunrise: ' + citySunrise + '</h4>';
                        let citySunset = json.astronomy.astro.sunset;
                        let citySunsetHtml = '<h4>Sunset: ' + citySunset + '</h4>';
                        //API 3 
                        console.time("api3");
                        fetch('https://rapidapi.p.rapidapi.com/cities/search/Atlanta?pageSize=1', {
                            method: 'get',
                            headers: { 'x-rapidapi-key': '<YOUR_API_KEY>',
                                        'x-rapidapi-host': 'geohub3.p.rapidapi.com',
                                        'useQueryString': true }
                        })
                            .then(res => res.json())
                            .then(json => {
                                console.timeEnd("api3");
                                let latitude = json.data.cities[0].latitude;
                                let latitudeHtml = '<h4>Latitude: ' + latitude + '</h4>';
                                let longitude = json.data.cities[0].longitude;
                                let longitudeHtml = '<h4>Longitude: ' + longitude + '</h4>';
                                //API 4
                                console.time("api4");
                                db.collection('cities').add({
                                    name: cityInput,
                                    currentTemperature: currentTemperature,
                                    sunrise: citySunrise,
                                    sunset: citySunset,
                                    latitude: latitude,
                                    longitude: longitude
                                }).then(() => {
                                    console.timeEnd("api4");
                                    console.timeEnd("end-to-end");
                                    res.send(templateBeginning + cityInputHtml + currentTemperatureHtml +
                                        citySunriseHtml + citySunsetHtml + latitudeHtml + longitudeHtml + templateEnd);
                                })
                                .catch(error => {
                                    res.send(error);
                                });
                            }); 
                    });
            });
    }
};