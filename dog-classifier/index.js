const fetch = require('node-fetch');
const Kraken = require("kraken");
const kraken = new Kraken({
    "api_key": "<YOUR_API_KEY>",
    "api_secret": "e9110b2e6d14b369217ddca23b9179ff97a48397"
});
const firebase = require('firebase');
require('firebase/firestore');
firebase.initializeApp({
    apiKey: "<YOUR_API_KEY>",
    authDomain: "csci8795-finalproject-429d8.firebaseapp.com",
    databaseURL: "https://csci8795-finalproject-429d8.firebaseio.com",
    projectId: "csci8795-finalproject-429d8",
    storageBucket: "csci8795-finalproject-429d8.appspot.com",
    messagingSenderId: "663143206274",
    appId: "1:663143206274:web:9f1ae4f061221e4c21539b"
});
 
const templateBeginning = `
<!DOCTYPE html>
<head>
  <title>Dog Classifier</title>
</head>
<body>
    <h1 style="text-align:center;">Dog Classifier</h1>
    <h4 style="text-align:center;">Dog Classifier is a serverless application that generates a random dog image, 
    uses machine learning to determine what it is, and then writes results to Google Firebase.</h4>
    <div style="text-align:center;">'
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
exports.dogClassifier = (req, res) => {
    console.time("end-to-end");
    const db = firebase.firestore();

    console.time("api1");
    fetch('https://dog.ceo/api/breeds/image/random')
        .then(res => res.json())
        .then(json => {
            console.timeEnd("api1");
            let imageUrlOriginal = json.message;
            let params = {
                url: imageUrlOriginal,
                wait: true,
                resize: {
                    width: 800,
                    height: 800,
                    strategy: 'crop'
                }
            };
            //API 2
            console.time("api2");
            kraken.url(params, function (err, data) {
                console.timeEnd("api2");
                if (err) {
                    console.log('Failed. Error message: %s', err);
                } else {
                    let image = '<img src="' + data.kraked_url + '"></img>';
                    const body = { "requests": [{ "features": [{ "maxResults": 1, "model": "", "type": "OBJECT_LOCALIZATION" }], "image": { "source": { "imageUri": data.kraked_url } } }] };
                    //API 3
                    console.time("api3");
                    fetch('https://vision.googleapis.com/v1/images:annotate?key=<YOUR_API_KEY>', {
                        method: 'post',
                        body: JSON.stringify(body),
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                    })
                        .then(res => res.json())
                        .then(json => {
                            console.timeEnd("api3");
                            //API 4
                            console.time("api4");
                            db.collection('dogCatImageClassifications').add({
                                url: data.kraked_url,
                                answer: json.responses[0].localizedObjectAnnotations[0].name
                            }).then(() => {
                                console.timeEnd("api4");
                                let answer = '<p>This is a ' + json.responses[0].localizedObjectAnnotations[0].name + '!</p';
                                console.timeEnd("end-to-end");
                                res.send(templateBeginning + image + answer + templateEnd);
                            })
                                .catch(error => {
                                    res.send(error);
                                });
                        });
                }
            });
        });
};