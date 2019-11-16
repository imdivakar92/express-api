const crops = require('express').Router();
const rp = require('request-promise');

crops.get('/types', (req, res) => {
    sess = req.session;
    var options = {
        uri: 'http://localhost:3091/server/api/crop/types',
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
            res.status(200).send(responseBody).end();;
        })
        .catch(function (err) {
            throw err;
        });
});

module.exports = crops;