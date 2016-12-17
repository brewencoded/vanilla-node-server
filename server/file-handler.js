const fs = require('fs');

const serveFile = function(path, res, type) {
    // check if file exists first
    return new Promise(function(resolve) {
        fs.exists(path, (exists) => {
            if (exists) {
                res.writeHead(200, { 'Content-type': type });
                const htmlStream = fs.createReadStream(path, 'utf8');
                htmlStream.pipe(res);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

const FileHandler = {
    serveHtml(path, res) {
        return serveFile(path, res, 'text/html');
    },
    serveCss(path, res) {
        return serveFile(path, res, 'text/css');
    },
    serveJs(path, res) {
        return serveFile(path, res, 'text/javascript');
    }
};

module.exports = FileHandler;
