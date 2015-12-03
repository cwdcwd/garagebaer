'use strict';

var config = require('config');
var twilio = require('twilio');
var express = require('express');
var _ = require('lodash');
var router = express.Router();
var Spark = require('spark');
Spark.login({
    username: config.PHOTON_USERNAME,
    password: config.PHOTON_PASSWORD
}, function(err, body) {
    console.log('API call login completed on callback:', body);
});

/* GET users listing. */
router.get('/state', function(req, res, next) {
    Spark.callFunction(config.PHOTON_DEVICEID, 'openDoor', null, function(err, data) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json({
                state: data
            });
        }
    });
});

router.post('/operate', function(req, res, next) {
    Spark.getVariable(config.PHOTON_DEVICEID, 'state', function(err, data) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json({
                state: data
            });
        }
    });
});

router.post('/twilio', function(req, res, next) {
    var txt = req.body;
    var sender = txt.From;
    var msgIn = txt.Body;
    var msgOut = '';
    var resp = new twilio.TwimlResponse();

    if (_.includes(config.WHITELIST, sender)) { //CWD-- TODO: check WHITELIST is array
        msgIn = msgIn.toUpperCase();

        if ((msgIn.indexOf('OPEN') > -1) || (msgIn.indexOf('CLOSE') > -1)) { //CWD-- TODO: replace with API.ai
            msgOut = 'Sure thing! Right away!';
            Spark.callFunction(config.PHOTON_DEVICEID, 'openDoor', null, function(err, data) {
                if (err) {
                    msgOut = 'I am so sorry. There has been an... issue.' + err;
                }

                resp.message(msgOut);
                console.log(txt, msgOut);
                res.send(resp);
            });
        } else if (msgIn.indexOf('STATE') > -1) {
            Spark.getVariable(config.PHOTON_DEVICEID, 'state', function(err, data) {
                if (err) {
                    msgOut = 'I am so sorry. There has been an... issue.' + err;
                } else {
                    msgOut = 'State is ' + data;
                }

                resp.message(msgOut);
                console.log(txt, msgOut);
                res.send(resp);
            })
        } else {
            msgOut = 'Sorry. What? I\'m just a door. I don\'t know what you mean';
        }
    } else {
        msgOut = 'Sorry. I don\'t know you';
    }

    if (msgOut != '') { //CWD-- send fail msg othereise we'll return a response on the callbacks
        console.log(txt, msgOut);
        resp.message(msgOut);
        res.send(resp);
    }
});

module.exports = router;
