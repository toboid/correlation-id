'use strict';

const express = require('express');
const app = express();
const correlator = require('../index.js')

app.use((req, res, next) => {
  correlator.withId(next);
});

app.get('*', (req, res) => {
  console.log(`${correlator.getId()} requested url ${req.url}`);

  getRandomNumber((err, randomNumber) => {
    res.send(`Random number: ${randomNumber}`);
  });
});

function getRandomNumber (callback) {
  setTimeout(() => {
    console.log(`${correlator.getId()} getting random number`);

    callback(null, Math.floor(Math.random() * 1000))
  }, 3000);
}

app.listen(3000, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Example app listening on port 3000');
});