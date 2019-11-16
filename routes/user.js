const user = require('express').Router();
const rp = require('request-promise');

user.post('/login', (req, res) => {
    var options = {
        uri: 'http://localhost:3091/server/api/user',
        method: 'POST',
        body: req.body,
        json: true
    };
    rp(options)
        .then(function (response) {
            let responseBody = {
                status: false,
                data: null
            };
            if(response.status){
                sess=req.session;
                sess.username = response.data.username;
                sess.sessionID = response.data.id;
                sess.location = response.data.location;
                responseBody.status = true;
                responseBody.data = response.data;
            } else {
                responseBody.status = false;
                responseBody.data = response.data;
            }
            res.status(200).send(responseBody).end();
        })
        .catch(function (err) {
            throw err;
        });
});

user.post('/logout', (req, res) => {
    sess=req.session;
    if(sess.sessionID){    
        sess.destroy((err) => {
            if(err) {
                res.status(200).send('Please Login').end();
            }
            res.status(200).send('Logged Out Successfully').end();
        });
    } else {
        res.status(200).send('Please Login').end();
    }
});

module.exports = user;