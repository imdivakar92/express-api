const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const port = process.env.PORT || 3091;

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const router = express.Router();

var sessionID;

var users = JSON.parse(fs.readFileSync('./public/static/users.json'));

var cropTypes = JSON.parse(fs.readFileSync('./public/static/crop-types.json'));

var blockMap = JSON.parse(fs.readFileSync('./public/static/blockmap-filemaper.json'));

router.post('/server/api/user', (req, res) => {
    const body = req.body;
    let responseData = {
        status: false,
        data: null
    };
    let isValidUser = false;
    users.data.forEach((element) => {
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
        responseData.data = cropTypes.data;
    } else {
        responseData.status = false;
        responseData.data = 'Unauthorized';
    }
    res.status(200).json(responseData);
});

router.post('/server/api/location/geojson', (req, res) => {
    const { location } = req.body;
    const responseData = {
        status: false,
        data: null
    };
    if(req.headers.authorization === sessionID) {
        let rawdata;
        switch(location.code) {
            case 'TN':
                rawdata = fs.readFileSync('./public/tamilnadu.geojson');
                break;
            case 'NE':
                rawdata = fs.readFileSync('./public/amsterdam.geojson');
                break;
            default:
                rawdata = fs.readFileSync('./public/tamilnadu.geojson');
                break;
        }
        responseData.status = true;
        responseData.data = JSON.parse(rawdata);
    } else {
        responseData.status = false;
        responseData.data = 'Unauthorized';
    }
    res.status(200).json(responseData);
});

router.post('/server/api/division', (req, res) => {
    const { level, blockId } = req.body;
    const responseData = {
        status: false,
        data: null
    };
    if(req.headers.authorization === sessionID) {
        let rawdata;
        switch(level) {
            case '0':
                rawdata = fs.readFileSync('./public/full_district_map.geojson');
                break;
            case '1':
                const filename = blockMap.data.find((element) => {
                    return element.objectId === parseInt(blockId);
                });
                rawdata = fs.readFileSync(`./public/block_maps/${filename.geojson}`);
                break;
            default:
                break;
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