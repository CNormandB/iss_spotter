const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss.js');

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`The ISS will pass overhead on ${datetime} for ${duration} seconds!`);
  }
};

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned IP:', ip);

  fetchCoordsByIP(ip, (error, coords) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }

    console.log("Got coords: ", coords);
    fetchISSFlyOverTimes(coords, (error, response) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }

      console.log("Got flyovers: ", response);
      printPassTimes(response);
    });
  });
});
