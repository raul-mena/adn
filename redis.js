//redis implementation
var redis = require('redis');
var client = redis.createClient(); // this creates a new client

module.exports = client;