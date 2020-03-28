const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


const app = express();

app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.render('landing');
});

const formv3 = (email, firstname, lastname) => {
  // Create the new request 
  var xhr = new XMLHttpRequest();
  var url = 'https://api.hsforms.com/submissions/v3/integration/submit/7388454/6153d0b7-b2fa-4297-86fa-8aab202b232f'
  
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
    // "context": {
    //   "hutk": ':hutk', // include this parameter and set it to the hubspotutk cookie value to enable cookie tracking on your submission
    //   "pageUri": "www.example.com/page",
    //   "pageName": "Example page"
    // },
    "legalConsentOptions":{ // Include this object when GDPR options are enabled
      "consent":{
        "consentToProcess":true,
        "text":"I agree to allow Example Company to store and process my personal data.",
        "communications":[
          {
            "value":true,
            "subscriptionTypeId":999,
            "text":"I agree to receive marketing communications from Example Company."
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
  formv3(req.body.email, req.body.firstname, req.body.lastname);
  res.render('thankyou', {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  });
})


app.listen(process.env.PORT || 3000, () => console.log('listening on port 3000'));