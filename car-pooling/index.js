const fetch = require('node-fetch');
const request = require('request');
const firebase = require('firebase');
require('firebase/firestore');
firebase.initializeApp({
    apiKey: "<YOUR_API_KEY>",
    authDomain: "csci8795-finalproject-429d8.firebaseapp.com",
    databaseURL: "https://csci8795-finalproject-429d8.firebaseio.com",
    projectId: "csci8795-finalproject-429d8",
    storageBucket: "csci8795-finalproject-429d8.appspot.com",
    messagingSenderId: "663143206274",
    appId: "1:663143206274:web:1847e5313ba2d28921539b"
});
const sgMail = require('@sendgrid/mail');

var finalOutput;
const pageTop = `
<!DOCTYPE html>
<head>
  <title>Car Pooling</title>
</head>
<body>
    <h1 style="text-align:center;">Car Pooling</h1>
    
`;
const pageBottom = `
</body>
</html>   
`;

exports.carPool = (req, res) => {
    console.time("end-end");
    const db = firebase.firestore();

    

    //API 1 - MAP'S DIRECTION API
    let api1URL = 'https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=<YOUR_API_KEY>';

    var api1Result="";

    console.time("api1");
    fetch(api1URL)
        .then(res => res.json())
        .then((json) => {
            if(json.status=='OK') {

                api1Result = `
                    <h3>API 1 - Directions API</h3>
                    <h4> Source: ` + json.routes[0].legs[0].start_address +`<br/> Destination: ` + json.routes[0].legs[0].end_address+ ` </h4>
                    `;


                let i;
                for (i = 0; i < json.routes[0].legs[0].steps.length; i++) {
                    api1Result += json.routes[0].legs[0].steps[i].html_instructions + `</br>`;
                }
                console.timeEnd("api1");

                //API - 2 - NEAREST CITIES
                var api2Result="";
                const options = {
                    method: 'GET',
                    url: 'https://geocodeapi.p.rapidapi.com/GetNearestCities',
                    qs: {latitude: '53.55196', longitude: '9.98558', range: '0'},
                    headers: {
                        'x-rapidapi-key': '<YOUR_API_KEY>',
                        'x-rapidapi-host': 'geocodeapi.p.rapidapi.com',
                        useQueryString: true
                    }
                };
                console.time("api2");
                request(options, function (error, response, body) {
                    if (error) {
                        throw new Error(error);
                    } else {
                        if (response) {
                            try {
                                var output2JSON = JSON.parse(body);

                                api2Result = `<h3>API 2 - Nearest Cities</h3>
                            <ul>`;

                                let i;
                                for (i = 0; i < output2JSON.length; i++) {
                                    api2Result += `<li>`+output2JSON[i].City + `</li>`;
                                }

                                api2Result += `</ul>`;
                                console.timeEnd("api2");


                                //API - 3 - NEAREST LARGEST CITIES
                                var api3Result="";
                                const api3_options = {
                                    method: 'GET',
                                    url: 'https://geocodeapi.p.rapidapi.com/GetLargestCities',
                                    qs: {latitude: '53.55196', longitude: '9.98558', range: '50000'},
                                    headers: {
                                        'x-rapidapi-key': '<YOUR_API_KEY>',
                                        'x-rapidapi-host': 'geocodeapi.p.rapidapi.com',
                                        useQueryString: true
                                    }
                                };
                                console.time("api3");
                                request(api3_options, function (error, response, body) {
                                    if (error){
                                        throw new Error(error);
                                    } else {
                                        if (response) {
                                            try {
                                                var output3JSON = JSON.parse(body);

                                                api3Result = `<h3>API 3 - Largest Cities</h3>
                                                              <ul>`;

                                                let i;
                                                for (i = 0; i < output3JSON.length; i++) {
                                                    api3Result += `<li>`+output3JSON[i].City + `</li>`;
                                                }

                                                api3Result += `</ul>`;
                                                console.timeEnd("api3");

                                                //API 4 - CURRENT TEMPERATURE

                                                let api4URL = 'http://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=Germany';

                                                var api4Result="";
                                                console.time("api4");
                                                fetch(api4URL)
                                                    .then(res => res.json())
                                                    .then((json) => {

                                                        let currentTemperature = json.current.temp_f;

                                                        api4Result = `<h3>API 4 - Current Temperature</h3>`;

                                                        api4Result += `Current Temperature : `+ currentTemperature + ' F';
                                                        console.timeEnd("api4");

                                                        //API 5 - SUNRISE AND SUNSET
                                                        let api5URL = 'http://api.weatherapi.com/v1/astronomy.json?key=<YOUR_API_KEY>&q=London&dt=2020-11-09';

                                                        var api5Result="";
                                                        console.time("api5");
                                                        fetch(api5URL)
                                                            .then(res => res.json())
                                                            .then((json) => {

                                                                let sunrise = json.astronomy.astro.sunrise;
                                                                let sunset = json.astronomy.astro.sunset;
                                                                
                                                                api5Result = `<h3>API 5 - Sunrise and Sunset</h3>`;

                                                                api5Result += `Sunrise : `+ sunrise + `<br />`;

                                                                api5Result += `Sunset  : `+ sunset + `<br />`;
                                                                console.timeEnd("api5");

                                                                //API 6 - ELEVATION 
                                                                var api6Result="";
                                                                console.time("api6");
                                                                fetch('https://wft-geo-db.p.rapidapi.com/v1/geo/cities/Q60', {
                                                                    method: 'GET',
                                                                    headers: {
                                                                        'x-rapidapi-key': '<YOUR_API_KEY>',
                                                                        'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
                                                                        'useQueryString': true
                                                                    }
                                                                })
                                                                    .then(res => res.json())
                                                                    .then(json => {

                                                                        let elevation = json.data.elevationMeters;

                                                                        api6Result = `<h3>API 6 - Elevation Above Sea Level</h3>`;

                                                                        api6Result += `Elevation : ` + elevation + `<br />`;
                                                                        console.timeEnd("api6");

                                                                        //API 7 - POPULATION 
                                                                        var api7Result="";
                                                                        console.time("api7");
                                                                        fetch('https://api.census.gov/data/2019/pep/population?get=NAME,POP&for=county:001&in=state:01&key=<YOUR_API_KEY>')
                                                                            .then(res => res.json())
                                                                            .then((json) => {

                                                                                api7Result = `<h3>API 7 - Population</h3>`;

                                                                                api7Result += `Population : ` + json[1][1] + `<br />`;
                                                                                console.timeEnd("api7");

                                                                                //API 8 - CURRENCY 
                                                                                var api8Result="";
                                                                                console.time("api8");
                                                                                fetch('https://restcountries.eu/rest/v2/capital/london')
                                                                                    .then(res => res.json())
                                                                                    .then((json) => {

                                                                                        api8Result = `<h3>API 8 - Currency</h3>`;

                                                                                        api8Result += `Currency : ` + json[0].currencies[0].name + `<br />`;
                                                                                        console.timeEnd("api8");

                                                                                        //API 9 - FIREBASE
                                                                                        var api9Result="";
                                                                                        console.time("api9");
                                                                                        db.collection('carPoolingDestinations').add({
                                                                                            currentTemperature: currentTemperature,
                                                                                            sunrise: sunrise,
                                                                                            sunset: sunset,
                                                                                            elevation: elevation
                                                                                        }).then(() => {

                                                                                            api9Result = `<h3>API 9 - Firebase</h3>`;

                                                                                            api9Result += `Write to Firebase! <br />`;
                                                                                            console.timeEnd("api9");

                                                                                            //API 10 - SEND AN EMAIL
                                                                                            var api10Result="";
                                                                                            sgMail.setApiKey("<YOUR_API_KEY>")
                                                                                            const msg = {
                                                                                                to: '<RECEIVER_EMAIL>', // Change to your recipient
                                                                                                from: '<SENDER_EMAIL>', // Change to your verified sender
                                                                                                subject: 'Test',
                                                                                                text: 'Sending with SendGrid is Fun',
                                                                                                html: '<strong>Test</strong>',
                                                                                            }
                                                                                            console.time("api10");
                                                                                            sgMail
                                                                                                .send(msg)
                                                                                                .then(() => {
                                                                                                    api10Result = `<h3>API 10 - Email</h3>`;
                                                                                                    api10Result += "Email sent to " + msg.to;
                                                                                                    
                                                                                                    finalOutput = pageTop + api1Result + api2Result + api3Result + api4Result + api5Result
                                                                                                        + api6Result + api7Result + api8Result + api9Result + api10Result + pageBottom;
                                                                                                        console.timeEnd("api10");
                                                                                                        console.timeEnd("end-end");
                                                                                                        res.status(200).send(finalOutput);

                                                                                                })
                                                                                                .catch((error) => {
                                                                                                    console.error(error)
                                                                                                })

                                                                                        }).catch(error => {
                                                                                            res.send(error);
                                                                                        });

                                                                                    });

                                                                            });

                                                                    });                                                                

                                                            })
                                                            .catch(err => {
                                                                console.log('Error : '+err.toString())
                                                                res.send(err.toString())
                                                            })


                                                    })
                                                    .catch(err => {
                                                        console.log('Error : '+err.toString())
                                                        res.send(err.toString())
                                                    })


                                            } catch (e) {
                                                throw new Error(e);
                                            }
                                        }
                                    }

                                });

                            } catch (e) {
                                throw new Error(e);
                            }
                        }
                    }
                })

            }else{
                res.send({
                    errorMessage: "Error",
                    api: 1
                });
            }
        })
        .catch(err => {
            console.log('Error : '+err.toString())
            res.send(err.toString())
        })

}
