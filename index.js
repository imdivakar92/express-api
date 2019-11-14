const express = require('express');
const app = express();
const cors = require('cors');
const rp = require('request-promise');
const session = require('express-session');
const port = process.env.PORT || 3200;
const cropsRouter = require('./routes/crops');
const locationRouter = require('./routes/location');

const router = express.Router();

var sess;

// app level middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(session({secret: 'agrix',saveUninitialized: true,resave: true}));
app.use('/api/crop', cropsRouter);
app.use('/api/location', locationRouter);

// route level middlewares
router.use((req, res, next) => checkSession(req, res, next));

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
                sess.location = response.data.location;
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

app.use('/', router);

app.listen(port, () => console.log(`App listening on port ${port}!`));

function checkSession(req, res, next) {
    if(req.url === '/api/login'){
        next();
    } else {
        sess=req.session;
        console.log(sess);
        if(!sess){
            res.status(200).send('Please Login').end();
        }
        next();
    }
}