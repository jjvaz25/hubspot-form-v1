const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.render('landing');
});

app.post('/', (req, res) => {
  const apiCall = 'https://api.hsforms.com/submissions/v3/integration/submit/7388454/6153d0b7-b2fa-4297-86fa-8aab202b232f'
  let data = {
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
      },
    ],
  }
  res.send('thanks for submitting');
})

app.listen(3000, () => console.log('listening on port 3000'));