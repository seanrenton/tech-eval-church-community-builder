var config = require('../config/database'),
    mongoose = require('mongoose'),
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






router.get('/displayorders', function (req, res) {
    newOrder.find({
        orderNumber: {
            $exists: true
        }
    }, function (err, order) {
        if (err) {
            console.log(err);
        } else {
            console.log(order);
            res.send(order);
        }
    }).sort({ orderNumber: -1 }).limit(50);

})


router.post('/displayfilteredorders', function (req, res) {
    // need to handle sequel injection

    var industryFilter = {};
    var statusFilter = {};
    var companyFilter = {};
    var totalFilter = {};
    var orderFilter = {};


    var queryObject = { $and: [] };
    var objectsInQuery = 0;
    var queryArray = [];





    if (req.body.industry) {
        industryFilter['sIndustry'] = req.body.industry;
        objectsInQuery++;
        queryArray.push(industryFilter);
    } else {
        industryFilter = '';
    }

    if (req.body.status) {
        statusFilter['status'] = req.body.status;
        objectsInQuery++
        queryArray.push(statusFilter);
    } else {
        statusFilter = '';
    }

    if (req.body.companyName) {
        companyFilter['bCompany'] = { "$regex": req.body.companyName, "$options": "i" };
        objectsInQuery++
        queryArray.push(companyFilter);
    } else {
        companyFilter = '';
    }

    if (req.body.total) {
        totalFilter['invoiceFinalTotal'] = req.body.total;
        objectsInQuery++
        queryArray.push(totalFilter);
    } else {
        totalFilter = '';
    }

    if (req.body.orderNumber) {
        orderFilter['orderNumber'] = req.body.orderNumber;
        objectsInQuery++
        queryArray.push(orderFilter);
    } else {
        orderFilter = '';
    }

    var dummyMongoPass = {};

    dummyMongoPass['_id'] = { $exists: true }

    queryArray.push(dummyMongoPass);
    // if (objectsInQuery.length > 1) {

    newOrder.find({ $and: queryArray }, function (err, orders) {
        if (err) {
            console.log(err);
        }
        res.send(orders);

    })
    // } else {
    //     // newOrder.find({})
    // }

})

router.get('/displayorders/:orderNumber', function (req, res) {
    newOrder.find({

        orderNumber: req.params.orderNumber

    }, function (err, order) {
        if (err) {
            console.log(err);
        } else {
            console.log(order);
            res.send(order);
        }
    })

})


router.get('/displayFilteredOrders/:orderFilter', function (req, res) {
    var orderSearch = req.params.orderFilter
    console.log(orderSearch)
    newOrder.find({ orderNumber: orderSearch }, function (err, orderResult) {
        if (err) {
            console.log(err)
        } else {
            console.log(orderResult);
            res.send(orderResult);
        }
    })
})






module.exports = router;