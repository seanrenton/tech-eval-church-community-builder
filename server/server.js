var mongoose = require('mongoose'),
    path = require('path'),
    cors = require('cors'),
    users = require('./routes/userroutes'),
    // routes = require('./routes/routes'),
    wooroutes = require('./routes/wooroutes'),
    // qboroutes = require('./routes/qboroutes'),
    // compareroutes = require('./routes/compareroutes'),
    // cin7routes = require('./routes/cin7routes'),
    // salesforceroutes = require('./routes/salesforceroutes'),
    // createinvoiceroutes = require('./routes/createinvoiceroutes'),
    // createproductroute = require('./routes/createproductroute'),
    passport = require('passport'),
    config = require('./config/database'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    // session = require('express-session'),
    express = require('express'),
    app = express(),
    session = require('express-session'),
    jwt = require('express-jwt'),
    jwks = require('jwks-rsa');
    


    var jwtCheck = jwt({
        secret: jwks.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: "https://emagispace.auth0.com/.well-known/jwks.json"
        }),
        audience: 'https://erpendpoint/',
        issuer: "https://emagispace.auth0.com/",
        algorithms: ['RS256']
    });
    



// connect to database
mongoose.connect(config.database);
mongoose.Promise = global.Promise;

// on connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database);
});

// on error
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});


var port = 5000;

// var server = app.listen(process.env.PORT || 3000, function () {
//   var port = server.address().port;
//   console.log("App now running on port", port);
// });

app.set('port', (process.env.PORT || 3000));
// CORS middleware
app.use(cors());



app.use(jwtCheck);

app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});

// app.get('*', (req,res) => {
//     res.sendFile(path.join(__dirname, 'dist/index.html'))
// }

// )

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })) //needed for quickbooks
app.use(cookieParser('brad')); //QBO
app.use(session({ resave: false, saveUninitialized: false, secret: 'smith' })); //qbo

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// require('./config/passport')(passport);

// Set static folder
app.use(express.static(path.join(__dirname, '/public')));

//Tyler mad testing

users(app);
// routes(app);
wooroutes(app);
// qboroutes(app);
// compareroutes(app);
// createinvoiceroutes(app);
// createproductroute(app);
// cin7routes(app);
// salesforceroutes(app);

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});