# Movie Booking

Movie Booking is a serverless application that helps you to find the movies running in theatres near you, movie ratings etc...

## Installation

```npm install```

## Usage

### Local Development

To test locally, use the following command:

```node --inspect node_modules/@google-cloud/functions-framework --target=movies```

### Google Cloud Deploy

To deploy to Google Cloud, use the following command:

```gcloud functions deploy 'movies' --runtime nodejs12 --trigger-http --entry-point=findMovie```

Replace "testfunction" with function name (first column in console) and "helloWorld" with name of function in index.js.

To send HTTP request to function, use the following command:

```curl https://us-central1-csci8795-finalproject.cloudfunctions.net/movies -H "Authorization: bearer $(gcloud auth print-identity-token)"```

Replace URL with corresponding function one.

