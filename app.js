if(process.env.NODE_ENV !=="production"){
    require('dotenv').config()
}
const express = require('express');
http = require('http');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const connect = mongoose.connect(process.env.MONGO_URL, {useUnifiedTopology:true, useNewUrlParser:true, useCreateIndex: true, useFindAndModify:false});
connect.then((db)=>{
    console.log('Connected to database');
    },(err)=>{
        console.log(err);
});

const User = require('./models/user');
const userRouter = require('./routes/userRouter');
const homeRouter = require('./routes/homeRouter');
const noteRouter = require('./routes/noteRouter');
const listRouter = require('./routes/listRouter');
const drawRouter = require('./routes/drawRouter');
const trashRouter = require('./routes/trashRouter');
const archiveRouter = require('./routes/archiveRouter');
const port = process.env.PORT || 4000;

const app = express();

app.use(logger('dev'));

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: process.env.SECRET_KEY,
    resave:false,
    saveUninitialized: false,
    unset: "destroy",
    store: new MongoStore({
        url:process.env.MONGO_URL,
        collection: 'sessions'
    })
}));

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const localStrategy = require('passport-local').Strategy;
passport.use(new localStrategy(User.authenticate()));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/user',userRouter);
app.use('/home',homeRouter);
app.use('/note',noteRouter);
app.use('/list',listRouter);
app.use('/draw',drawRouter);
app.use('/trash',trashRouter);
app.use('/archive', archiveRouter);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'client','build','index.html'));
    });
}

app.set('port', port);
const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


function onError(error){
    if(error.syscall!=='listen'){
        throw error;
    }   
    var bind = typeof port ==="string"
        ?'Pipe '+port
        :'Port '+port;
    switch (error.code){
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(){
    const addr = server.address();
    var bind  = typeof addr==='string'
        ?'pipe '+addr
        :'port '+addr.port;
    console.log('Listening on '+bind);
}