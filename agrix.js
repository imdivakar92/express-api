const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const port = process.env.PORT || 4200;

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const router = express.Router();

var sessionID;

var users = [
    { username: 'divakar', password: 'divakar', id: '9786920506', location: 'TN' },
    { username: 'mano', password: 'mano', id: '1234567890', location: 'TN' },
    { username: 'anand', password: 'anand', id: '0987654321', location: 'NE' },
    { username: 'mohit', password: 'mohit', id: '9876543210', location: 'NE' },
    { username: 'admin', password: 'admin', id: '9999999999', location: 'TN' },
];

var cropTypes = [
    { id : 1, name: 'rice' },
    { id : 2, name: 'wheat' }
];

router.post('/server/api/user', function (req, res) {
    const body = req.body;
    let responseData = {
        status: false,
        data: null
    };
    let isValidUser = false;
    users.forEach((element) => {
        if(element.username === body.username && element.password === body.password) {
            responseData.status = true;
            responseData.data = element;
            isValidUser = true;
            sessionID = element.id;
        }
    });
    if(!isValidUser){
        responseData.status = false;
        responseData.data = 'Unauthorized';
    }
    res.status(200).json(responseData);
});

router.get('/server/api/crop/types', (req, res) => {
    const responseData = {
        status: false,
        data: null
    };
    if(req.headers.authorization === sessionID) {
        responseData.status = true;
        responseData.data = cropTypes;
    } else {
        responseData.status = false;
        responseData.data = 'Unauthorized';
    }
    res.status(200).json(responseData);
});

router.post('/server/api/location/geojson', (req, res) => {
    const body = req.body;
    const responseData = {
        status: false,
        data: null
    };
    if(req.headers.authorization === sessionID) {
        let rawdata;
        switch(body.location) {
            case 'TN':
                rawdata = fs.readFileSync('./public/tamilnadu.geojson');
                break;
            case 'NE':
                rawdata = fs.readFileSync('./public/amsterdam.geojson');
                break;
            default:
                rawdata = fs.readFileSync('./public/tamilnadu.geojson');
        }
        responseData.status = true;
        responseData.data = JSON.parse(rawdata);
    } else {
        responseData.status = false;
        responseData.data = 'Unauthorized';
    }
    res.status(200).json(responseData);
});

app.use('/', router);

app.listen(port, () => console.log(`App listening on port ${port}!`));