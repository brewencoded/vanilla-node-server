const http = require('http');

// paths
const {
    HTML_DIR
} = require('./server/constants');

// router
const Router = require('./server/router');
const router = Router();

// default to 8080 or pull from environment variables
const PORT = process.env.PORT || 8080;

// set routes
router.get('/').handler((req, res) => {
    res.serve().html(HTML_DIR + '/index.html');
});

router.get('/about').handler((req, res) => {
    res.serve().html(HTML_DIR + '/about.html');
});

router.get('/post').handler((req, res) => {
    res.serve().html(HTML_DIR + '/post.html');
});

router.default((req, res) => {
    res.serve().html(HTML_DIR + '/notFound.html');
});

router.static(__dirname + '/public');

// create server
const server = http.createServer((req, res) => router.start(req, res));

// handle errors
server.on('error', (e) => {
    setTimeout(() => {
        server.close();
    }, 1000);
    console.error(e);
});

// listen on port
server.listen(PORT, 'localhost', () => {
    console.log('Listening on http://localhost:' +  PORT);
});
