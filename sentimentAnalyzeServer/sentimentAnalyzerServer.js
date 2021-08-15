const express = require('express');
const app = new express();
const dotenv = require('dotenv');
const title = 'Sentiment Analyzer'
dotenv.config();

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });

    const analyzeParams = {
      'url': 'www.ibm.com',
      'features': {
        'entities': {
          'emotion': true,
          'sentiment': true,
          'limit': 2,
        },
        'keywords': {
          'emotion': true,
          'sentiment': true,
          'limit': 2,
        },
      },
    };
    
    naturalLanguageUnderstanding.analyze(analyzeParams)
      .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
      })
      .catch(err => {
        console.log('error:', err);
      });

    return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

    return res.send({"sadness":"0.250624","joy":"0.722962","fear":"0.009157","disgust":"0.003132","anger":"0.016098"});
});

app.get("/url/sentiment", (req,res) => {
    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    const nlu= getNLUInstance();
    var parameters= { text: "I am having a bad day today, \
        could someone help me please",features : {emotion: {}}}
    ret= nlu.analyze( parameters ) //, function( error, response){
           .then (analysisResults=> {
            console.log(JSON.stringify(analysisResults, null, 2));
            console.log( "in here")
           })
           .catch(err=> {console.log( "error",err);
           });
    console.log( ret );
    return res.send({"sadness":"0.250624","joy":"0.722962","fear":"0.009157","disgust":"0.003132","anger":"0.016098"});
});

app.get("/text/sentiment", (req,res) => {
    return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

