const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


const app = express();

const PORT = 3000;

app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('landing');
});

app.post('/', (req, res) => {

  // Create the new request 
  var xhr = new XMLHttpRequest();
  var url = 'https://api.hsforms.com/submissions/v3/integration/submit/7388454/6153d0b7-b2fa-4297-86fa-8aab202b232f'

  // Request JSON:
  var data = {
    "fields": [
      {
        "name": "email",
        "value": req.body.email
      },
      {
        "name": "firstname",
        "value": req.body.firstname
      },
      {
        "name": "lastname",
        "value": req.body.lastname
      }
    ],
    "context": {
      "hutk": req.cookies.hubspotutk,
      "pageUri": "spartan-mule-landing.herokuapp.com/",
      "pageName": "Spartan Mule Landing Page"
    },
    "legalConsentOptions":{
      "consent":{
        "consentToProcess":true,
        "text":"I agree to allow Spartan Mule to store and process my personal data.",
        "communications":[
          {
            "value":true,
            "subscriptionTypeId":999,
            "text":"I agree to receive marketing communications from Spartan Mule."
          }
        ]
      }
    }
  }

  var final_data = JSON.stringify(data)

  xhr.open('POST', url);
  // Sets the value of the 'Content-Type' HTTP request headers to 'application/json'
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
        console.log('200 all good!') 
        console.log(xhr.responseText); // Returns a 200 response if the submission is successful.
        res.render('thankyou', {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          hutkCode: req.cookies.hubspotutk
        })
    } else if (xhr.readyState == 4 && xhr.status == 400){
        console.log('400 error message') 
        console.log(xhr.responseText); // Returns a 400 error the submission is rejected.
        res.render('error', {
          error: 400,
          explanation: 'Invalid email submission. Please make sure you are entering a valid email address'
        })
    } else if (xhr.readyState == 4 && xhr.status == 403){ 
        console.log('403 error message')
        console.log(xhr.responseText); // Returns a 403 error if the portal isn't allowed to post submissions.
        res.render('error', {
          error: 403,
          explanation: 'Access forbidden'
        })      
    } else if (xhr.readyState == 4 && xhr.status == 404){ 
        console.log('404 error message')
        console.log(xhr.responseText); //Returns a 404 error if the formGuid isn't found
        res.render('error', {
          error: 404,
          explanation: 'Page not found'
        })
    }
   }


  // Sends the request 
  
  xhr.send(final_data)
  console.log(final_data);


});




app.listen(process.env.PORT || 3000, () => console.log(`listening on port ${PORT}`));