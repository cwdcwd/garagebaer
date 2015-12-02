var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/state', function(req, res, next) {
    res.json({
        state: 'closed'
    });
});

router.post('/operate', function(req, res, next) {
    res.json({
        state: 'open'
    });
});

router.post('/twilio', function(req, res, next) {
    console.log(req.body);
    res.send('received your message');
});


module.exports = router;
