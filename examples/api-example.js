'use strict';

const http = require('http');
const correlator = require('../index.js');

const server = http.createServer((req, res) => {
  correlator.withId(() => {
    console.log(`${correlator.getId()} requested url ${req.url}`);

    getRandomNumber((err, randomNumber) => {
      res.end(`Random number: ${randomNumber}`);
    });
  });
});

function getRandomNumber (callback) {
  setTimeout(() => {
    console.log(`${correlator.getId()} getting random number`);

    callback(null, Math.floor(Math.random() * 1000));
  }, 3000);
}

server.listen(3000, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Example app listening on port 3000');
});
