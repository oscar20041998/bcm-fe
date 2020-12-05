const express = require('express');
const serveStatic = require("serve-static")
const path = require('path');
app = express();
app.use('/', serveStatic(path.join(__dirname, '/dist')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'https://coffee-management-fe-0498.herokuapp.com');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
const port = process.env.PORT || 8080;
app.listen(port);