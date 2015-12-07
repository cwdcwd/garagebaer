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

var interpretState = function(iState) {
    return (iState === 1) ? 'open' : ((iState === -1) ? 'closed' : 'unknown');
}

var interpretRequest = function(s) {
    return ((s.toUpperCase() === 'OPEN') ? 'openDoor' : (s.toUpperCase() === 'CLOSED') ? 'closeDoor' : '');
};

router.post('/operate', function(req, res, next) {
    Spark.callFunction(config.PHOTON_DEVICEID, interpretRequest(req.body.state), null, function(err, data) {
        console.log(data);
        if (err) {
            res.status(500).json(err);
        } else {
            res.json({
                state: interpretState(data.return_value)
            });
        }
    });
});

router.get('/state', function(req, res, next) {
    Spark.getVariable(config.PHOTON_DEVICEID, 'state', function(err, data) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json({
                state: interpretState(data.result)
            });
        }
    });
});

router.post('/twilio', function(req, res, next) {
    console.log('incoming from twilio', req.body);
    var txt = req.body;
    var sender = txt.From;
    var msgIn = txt.Body;
    var msgOut = '';
    var resp = new twilio.TwimlResponse();
    var a = config.WHITELIST;

    if (_.isString(a)) {
        console.log('evaluating WHITELIST config var', config.WHITELIST);
        a = eval(config.WHITELIST);

        if (!_.isArray(a)) {
            console.log('converting WHITELIST to array')
            a = [].push(config.WHITELIST);
        }
    }

    console.log('WHITELIST: ', a);
    console.log('sender: ', sender);

    if (_.includes(a, sender)) { //CWD-- TODO: check WHITELIST is array
        msgIn = msgIn.toUpperCase();

        if ((msgIn.indexOf('OPEN') > -1) || (msgIn.indexOf('CLOSE') > -1)) { //CWD-- TODO: replace with API.ai
            var s = (msgIn.indexOf('OPEN') > -1) ? 'OPEN' : 'CLOSED';
            msgOut = 'Sure thing! Right away! Setting door to: ' + s;

            Spark.callFunction(config.PHOTON_DEVICEID, interpretRequest(s), null, function(err, data) {
                if (err) {
                    msgOut = 'I am so sorry. There has been an... issue.' + err;
                }

                resp.message(msgOut);
                console.log(txt, msgOut);
                res.send(resp.toString());
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
                res.send(resp.toString());
                return;
            })
        } else {
            msgOut = 'Sorry. What? I\'m just a door. I don\'t know what you mean';
            console.log(txt, msgOut);
            resp.message(msgOut);
            res.send(resp.toString());
        }
    } else {
        msgOut = 'Sorry. I don\'t know you';
        console.log(txt, msgOut);
        resp.message(msgOut);
        res.send(resp.toString());
    }
});

//CWD-- TODO add logging on calls to operate

module.exports = router;
