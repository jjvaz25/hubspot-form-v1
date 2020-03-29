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

const formv3 = (email, firstname, lastname, hutk) => {
  // Create the new request 
  var xhr = new XMLHttpRequest();
  // var url = 'https://api.hsforms.com/submissions/v3/integration/submit/7388454/6153d0b7-b2fa-4297-86fa-8aab202b232f'
  var url = 'https://api.hsforms.com/submissions/v3/integration/submit/c45f8fcc-4bf7-4e98-9aeb-283c978e6d0c'
  
  // Request JSON:
  var data = {
    "fields": [
      {
        "name": "email",
        "value": email
      },
      {
        "name": "firstname",
        "value": firstname
      },
      {
        "name": "lastname",
        "value": lastname
      }
    ],
    "context": {
      "hutk": hutk,
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
        console.log(xhr.responseText); // Returns a 200 response if the submission is successful.
    } else if (xhr.readyState == 4 && xhr.status == 400){ 
        console.log(xhr.responseText); // Returns a 400 error the submission is rejected.          
    } else if (xhr.readyState == 4 && xhr.status == 403){ 
        console.log(xhr.responseText); // Returns a 403 error if the portal isn't allowed to post submissions.           
    } else if (xhr.readyState == 4 && xhr.status == 404){ 
        console.log(xhr.responseText); //Returns a 404 error if the formGuid isn't found     
    }
   }


  // Sends the request 
  
  xhr.send(final_data)
  console.log(final_data);
}

app.post('/', (req, res) => {
  formv3(req.body.email, req.body.firstname, req.body.lastname, req.cookies.hubspotutk);
  res.render('thankyou', {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    hutkCode: req.cookies.hubspotutk
  }); 
});


app.listen(process.env.PORT || 3000, () => console.log(`listening on port ${PORT}`));