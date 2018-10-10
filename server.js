const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

//get our API and express server backend
const api = require('./server/routes/api');

const app = express();
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;


// app.use(cors());
// where we connect our backend routes to our server
app.use(bodyParser.json({ limit: '5mb' }));
app.use('/api', api);
app.use(express.static(path.join(__dirname, 'dist')))


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
})

app.get('/insecure', function (req, res) {
    res.send('Dangerous!');
});

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost: ${port}`));