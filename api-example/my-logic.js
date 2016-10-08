var correlator = require('../index.js')('toby-store');

module.exports = function (callback) {
  console.log('Request id before async op is:', correlator.get());

  setTimeout(() => {
    console.log('Request id after async op is:', correlator.get());

    callback(null, 'Some response')
  }, 4000);
}