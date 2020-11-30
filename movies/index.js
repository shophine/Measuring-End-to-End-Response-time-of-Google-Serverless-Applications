const fetch = require('node-fetch');
var finalOutput;
const pageTop = `
<!DOCTYPE html>
<head>
  <title>Movies</title>
</head>
<body>
    <h1 style="text-align:center;">Movies App</h1>
    
`;
const pageBottom = `
</body>
</html>   
`;

exports.findMovie = (req, res) => {
    // var start = window.performance.now();
    console.time("end-end");
    //API 1 - MOVIE DETAILS
    let api1URL = 'http://www.omdbapi.com/?apikey=<YOUR_API_KEY>&t=inception'

    // console.log(api1URL)

    console.time("api1");
    fetch(api1URL)
        .then(res => res.json())
        .then((json) => {
            if(json.Response=='True') {

                let api1Result = `
                    <h3>Movie Details</h3>
                    <p> Title : ` + json.Title + `</p>
                    <p> Release Year : ` + json.Year + `</p>
                    <p> Director : ` + json.Director + `</p>
                    <p> Production : ` + json.Production + `</p>
                    <p> Release Year : ` + json.Year + `</p>
                    <p> Genre : ` + json.Genre + `</p>
                    <p> Runtime : ` + json.Runtime + `</p>
                    <p>Ratings: </p>
                    <ul>`;

                        let i;
                        for (i = 0; i < json.Ratings.length; i++) {
                            api1Result += `<li>` + json.Ratings[i].Source + `: `+json.Ratings[i].Value+`</li>`;
                        }

                        api1Result += `</ul>`;


                // console.log('API 1 Result 1: ')
                // console.log(api1Result)
                console.timeEnd("api1");

                //API 2 - POPULAR MOVIES

                let api2URL = 'https://api.themoviedb.org/3/movie/popular?api_key=<YOUR_API_KEY>'
                console.time("api2");
                fetch(api2URL)
                    .then(res => res.json())
                    .then((json) => {

                        let api2Result = `
                                             <h3>Popular Movies</h3>
                                             <ol>`;

                        
                        for (i = 0; i < json.results.length; i++) {
                            api2Result += `<li>` + json.results[i].title + `</li>`;
                        }

                        api2Result += `</ol>`;


                        // console.log('API 2 Result 2: ')
                        // console.log(api2Result)
                        console.timeEnd("api2");

                        var headers = {
                            "api-version": "v200",
                            "authorization": "Basic VUdBOk1hb3RXQlNoaURHSg==",
                            "client": "UGA",
                            "x-api-key": "<YOUR_API_KEY>",
                            "device-datetime": "<YYYY-MM-DD>T<HH:MM:SS:XXX>Z",
                            "territory": "US",
                            "geolocation": "33.79,-84.44"

                        }
                        //API 3 - NOW SHOWING

                        let api3URL = 'https://api-gate2.movieglu.com/filmsNowShowing/?n=5'

                        console.time("api3");
                        fetch(api3URL, {headers: headers})
                            .then(res => res.json())
                            .then((json) => {
                                // console.log('API 3')
                                // console.log(json)


                                let api3Result = `
                                             <h3>Showing Now</h3>
                                             <ol>`;
                                // console.log('Films Len: ' + json.films.length)
                                
                                for (i = 0; i < json.films.length; i++) {
                                    api3Result += `<li>` + json.films[i].film_name + `</li>`;
                                }

                                api3Result += `</ol>`;

                                // console.log('API 3 Result 3: ')
                                // console.log(api3Result)
                                console.timeEnd("api3");
                                //API 4 - UPCOMING MOVIES
                                let api4URL = 'https://api.themoviedb.org/3/movie/upcoming?api_key=<YOUR_API_KEY>&language=en-US&page=1'
        
                                console.time("api4");
                                fetch(api4URL, {headers: headers})
                                    .then(res => res.json())
                                    .then((json) => {
                                        // console.log('API 4')
                                        // console.log(json)
        
                                        let api4Result = `
                                                     <h3>Upcoming Movies</h3>
                                                     <ol>`;
        
                                        
                                        for (i = 0; i < json.results.length; i++) {
                                            api4Result += `<li>` + json.results[i].title + `</li>`;
                                        }
        
                                        api4Result += `</ol>`;
        
                                        // console.log('API 4 Result 4: ')
                                        // console.log(api4Result)
                                        
                                        finalOutput = pageTop + api1Result + api2Result + api3Result + api4Result + pageBottom;
                                        console.timeEnd("api4");
                                        console.timeEnd("end-end");

                                
                                        res.status(200).send(finalOutput);

                                        // var end = window.performance.now();
                                            
                                        //  var time = end - start;
                                        //  console.log("Time :" +time);
            
                                    })

                            })
                        
                    })
            }else{
                res.send({
                    errorMessage: json.Error,
                    api: 1
                });
            }
        })
        .catch(err => {
        console.log('Error : '+err.toString())
        res.send(err.toString())
    })

}

