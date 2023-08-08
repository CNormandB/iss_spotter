// index2.js
const { nextISSTimesForMyLocation } = require('./iss_promised');


const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`The ISS will pass overhead on ${datetime} for ${duration} seconds!`);
  }
};

// see index.js for printPassTimes
// copy it from there, or better yet, moduralize and require it in both files

// Call
nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((err) => {
    console.log(err);
  });