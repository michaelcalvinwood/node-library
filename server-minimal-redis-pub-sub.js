const express = require('express');
const redis = require('redis');
require('dotenv').config();
const app = express();

var redisSubscriber = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
var redisPublisher = redisSubscriber.duplicate();

redisSubscriber.on('error', (err) => console.log('Redis Client Error', err));
redisPublisher.on('error', (err) => console.log('Redis Client Error', err));

const connectPubSub = async (publisher, subscriber) => {
    await subscriber.connect();
    await subscriber.subscribe('ping', (channel, message) => {
        console.log(`${channel}:${message}`);
    });

    await publisher.connect();
    let interval = setInterval(async () => {
        await publisher.publish('ping', `Hello from ${process.argv[2]}`);
    }, 5000);
}

connectPubSub(redisPublisher, redisSubscriber);

app.listen(process.argv[2]);
