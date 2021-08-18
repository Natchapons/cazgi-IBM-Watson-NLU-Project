const express = require('express');
const app = new express();
const dotenv = require('dotenv');
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
    return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'emotion': { }
        }
    };

    getNLUInstance().analyze(analyzeParams).then(analysisResults => {
        //console.log(JSON.stringify(analysisResults, null, 2));
        res.send(analysisResults.result.emotion.document.emotion); //e.g. {"sadness":0.44386,"joy":0.50775,"fear":0.044669,"disgust":0.027835,"anger":0.087054}
    })
    .catch(err => {
        console.log('error:', err);
        res.status(500).send("Could not process request.");
    });
});

app.get("/url/sentiment", (req,res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'sentiment' : { }
        }
    };

    getNLUInstance().analyze(analyzeParams).then(analysisResults => {
        //console.log(JSON.stringify(analysisResults, null, 2));
        res.send(analysisResults.result.sentiment.document.label); //e.g. "positive", "neutral", or "negative"
    })
    .catch(err => {
        console.log('error:', err);
        res.status(500).send("Could not process request.");
    });
});

app.get("/text/emotion", (req,res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'emotion': { }
        }
    };

    getNLUInstance().analyze(analyzeParams).then(analysisResults => {
        res.send(analysisResults.result.emotion.document.emotion);
    })
    .catch(err => {
        console.log('error:', err);
        res.status(500).send("Could not process request.");
    });
});

app.get("/text/sentiment", (req,res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'sentiment' : { }
        }
    };

    getNLUInstance().analyze(analyzeParams).then(analysisResults => {
        res.send(analysisResults.result.sentiment.document.label);
    })
    .catch(err => {
        console.log('error:', err);
        res.status(500).send("Could not process request.");
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

