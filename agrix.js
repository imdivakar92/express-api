const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 4200;

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const router = express.Router();

var sessionID;

var users = [
    { username: 'divakar', password: 'divakar', id: '9786920506' },
    { username: 'mano', password: 'mano', id: '1234567890' },
    { username: 'anand', password: 'anand', id: '0987654321' },
    { username: 'mohit', password: 'mohit', id: '9876543210' },
    { username: 'admin', password: 'admin', id: '9999999999' },
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

app.use('/', router);

app.listen(port, () => console.log(`App listening on port ${port}!`));