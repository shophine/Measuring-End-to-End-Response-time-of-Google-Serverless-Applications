# Measuring End-to-End Response Time of Google Serverless Applications

## Installation

```npm install```

## Usage

### Local Development

To test locally, use the following command:

```node --inspect node_modules/@google-cloud/functions-framework --target=helloWorld```

Replace "helloWorld" with name of function in index.js.

### Google Cloud Deploy

To deploy to Google Cloud, use the following command:

```gcloud functions deploy 'testfunction' --runtime nodejs12 --trigger-http --entry-point=helloWorld```

Replace "testfunction" with function name (first column in console) and "helloWorld" with name of function in index.js.

To send HTTP request to function, use the following command:

```curl https://us-central1-csci8795-finalproject.cloudfunctions.net/testfunction -H "Authorization: bearer $(gcloud auth print-identity-token)"```

Replace URL with corresponding function one.

