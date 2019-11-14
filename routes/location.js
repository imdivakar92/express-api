const location = require('express').Router();
const rp = require('request-promise');

location.post('/geojson', (req, res) => {
    sess = req.session;
    var options = {
        uri: 'http://localhost:4200/server/api/location/geojson',
        method: 'POST',
        body: req.body,
        json: true,
        headers: {
            'Authorization': sess.sessionID
        }
    };
    rp(options)
        .then(function (response) {
            let responseBody = {
                status: false,
                data: null
            };
            if(response.status){
                responseBody.status = true;
                responseBody.data = response.data;
            } else {
                responseBody.status = false;
                responseBody.data = response.data;
            }
            res.status(200).send(responseBody);
        })
        .catch(function (err) {
            throw err;
        });
});

module.exports = location;