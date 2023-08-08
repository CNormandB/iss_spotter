const request = require('request');

const fetchISSFlyOverTimes = function(coords, callback) {
  const ISS_FLYOVER_API = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(ISS_FLYOVER_API, (error, response, body) => {
    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching flyover times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const result = JSON.parse(body);
    if (result.message !== 'success') {
      callback(Error(result.message), null);
    }

    // Note: We don't handle the case where the ip  key doesn't exist in the response!
    // This is bad practice. You should always check your responses contain what you expect, especially when making web requests!
    // What if the format changes, and they decide that in a new update it's now 'ip_address' instead of just 'ip'?
    // That would break our function and we'd have no error to explain why at first glance because JSON.parse(body)['ip'] would return undefined
    callback(null, result.response);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  const COORDS_FETCHER_API = 'https://ipwho.is/';

  request(COORDS_FETCHER_API + ip, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const result = JSON.parse(body);
    if (!result.success) {
      callback(Error(result.message), null);
      return;
    }

    callback(null, { latitude: result.latitude, longitude: result.longitude });
  });
};

const fetchMyIP = function(callback) {
  const IP_FETCHER_API = 'https://api.ipify.org?format=json';

  // use request to fetch IP address from JSON API
  request(IP_FETCHER_API, (error, response, body) => {

    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // Note: We don't handle the case where the ip  key doesn't exist in the response!
    // This is bad practice. You should always check your responses contain what you expect, especially when making web requests!
    // What if the format changes, and they decide that in a new update it's now 'ip_address' instead of just 'ip'?
    // That would break our function and we'd have no error to explain why at first glance because JSON.parse(body)['ip'] would return undefined
    let result = JSON.parse(body);
    if (!('ip' in result)) {
      const msg = `ip was not found in response body: ${body}`;
      callback(Error(msg), null);
    }

    callback(null, result.ip);
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };
