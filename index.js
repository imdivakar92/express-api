const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const port = process.env.PORT || 3200;
const router = require('express').Router();
const userRouter = require('./routes/user');
const cropsRouter = require('./routes/crops');
const locationRouter = require('./routes/location');

// app level middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(session({secret: 'agrix',saveUninitialized: true,resave: true}));
app.use('/api/crop', cropsRouter);
app.use('/api/location', locationRouter);
app.use('/api/user', userRouter);

// route level middlewares
router.use((req, res, next) => checkSession(req, res, next));

app.use('/', router);

app.listen(port, () => console.log(`App listening on port ${port}!`));

function checkSession(req, res, next) {
    if(req.url === '/api/login'){
        next();
    } else {
        sess=req.session;
        if(!sess.sessionID){
            res.status(200).send('Please Login').end();
        }
        next();
    }
}