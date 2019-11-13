const express = require('express');
const app = express();
const cors = require('cors');
const rp = require('request-promise');
const session = require('express-session');
const port = process.env.PORT || 3200;

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

const router = express.Router();

var sess;

router.post('/api/login', (req, res) => {
    var options = {
        uri: 'http://localhost:4200/server/api/user',
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

router.post('/api/logout', (req, res) => {
    sess=req.session;
    sess.destroy((err) => {
        if(err) {
            res.status(200).send('Please Login');
        }
        res.status(200).send('Logged Out Successfully');
    });
});

router.get('/api/crop/types', (req, res) => {
    if(!sess){
        res.status(200).send('Please Login');
    }
    var options = {
        uri: 'http://localhost:4200/server/api/crop/types',
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

app.use('/', router);

app.listen(port, () => console.log(`App listening on port ${port}!`));