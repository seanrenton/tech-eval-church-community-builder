var mongoose = require('mongoose'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    mongojs = require('mongojs'),
    http = require('http'),
    request = require('request-promise'),
    qs = require('querystring'),
    util = require('util'),
    bodyParser = require('body-parser'),
    uncaught = require('uncaught'),
    cookieParser = require('cookie-parser'),
    QuickBooks = require('node-quickbooks'),
    session = require('express-session'),
    express = require('express'),
    nodemailer = require('nodemailer'),
    CronJob = require('cron').CronJob,
    csv = require('csvtojson'),
    taxjar = require("taxjar")("7f5bc693d11d7f666c9888e7d11b9b1d"),
    fs = require('fs'),
    pdf = require('html-pdf'),
    jsforce = require('jsforce'),
    salesforcepassword = 'Emagi0423SpaceEariyJ3sPcQwCVKjcpc8wHXtB',
    router = express.Router(),
    jwt = require('express-jwt'),
    jwks = require('jwks-rsa'),
    cors = require('cors'),
    readline = require('readline'),
    { google } = require('googleapis');






router.get('/displayNowShowingMovies', function (req, res) {

    request('https://api.themoviedb.org/3/movie/now_playing?api_key=ffa916a67f415c5064bd7a9c8409c38a', function (error, response, result) {

        var movieDBResult = JSON.parse(result);

        console.log(movieDBResult);

        res.send(movieDBResult);
    })

})

router.get('/displayPopularMovies', function (req, res) {

    request('https://api.themoviedb.org/3/movie/popular?api_key=ffa916a67f415c5064bd7a9c8409c38a', function (error, response, result) {

        var movieDBResult = JSON.parse(result);

        console.log(movieDBResult);
        res.send(movieDBResult);
    })

})


router.get('/displayTopRatedMovies', function (req, res) {

    request('https://api.themoviedb.org/3/movie/top_rated?api_key=ffa916a67f415c5064bd7a9c8409c38a', function (error, response, result) {

        var movieDBResult = JSON.parse(result);

        console.log(movieDBResult);
        res.send(movieDBResult);
    })

})

router.get('/displayMovie/:id', function (req, res) {

    var params = req.params.id

    request('https://api.themoviedb.org/3/movie/' + params + '?api_key=ffa916a67f415c5064bd7a9c8409c38a', function (error, response, result) {

        var movieDBResult = JSON.parse(result);

        console.log(movieDBResult);
        res.send(movieDBResult);
    })

})




module.exports = router;