var express = require('express');
var app = express();

var logic = require('./my-logic.js')

var correlator = require('../index.js')('toby-store');

app.get('/', correlator.begin(function (req, res) {
  logic((err, result) => {
    if (err) {
      return console.error(err);
    }
    res.send(result);
  })
}));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});