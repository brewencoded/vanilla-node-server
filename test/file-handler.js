const Chai = require('chai');
const {
    expect
} = Chai;
const {
    serveHtml,
    serveCss,
    serveJs
} = require('../server/file-handler');
const fs = require('fs');
const htmlFile = fs.readFileSync(__dirname + '/../public/html/index.html', 'utf8');
const cssFile = fs.readFileSync(__dirname + '/../public/css/styles.css', 'utf8');
const jsFile = fs.readFileSync(__dirname + '/../public/js/xhr-helper.js', 'utf8');

describe('File handler', function () {
    const Writable = require('stream').Writable;
    let ws;

    beforeEach(function () {
        ws = Writable();
        ws._write = function (chunk, enc, next) {
            next();
        };
    });

    context('using serveHtml', function() {
        it('should return file if it exists', function (done) {
            let status, contentType, fileWasFound;
            ws.writeHead = function(stat, content) {
                status = stat;
                contentType = content;
            };
            ws.on('pipe', (src) => {
                let data = '';
                src.on('data', (chunk) => {
                    data += chunk;
                });
                src.on('end', () => {
                    expect(fileWasFound).to.be.true;
                    expect(status).to.equal(200);
                    expect(contentType).to.deep.equal({
                        'Content-type': 'text/html'
                    });
                    expect(data).to.equal(htmlFile);
                    done();
                });
            });
            serveHtml(__dirname + '/../public/html/index.html', ws)
            .then((fileFound) => {
                fileWasFound = fileFound;
            });

        });
        it('should return false if file does not exist', function (done) {
            serveHtml(__dirname + '/../public/html/fake.html', ws)
            .then((fileFound) => {
                expect(fileFound).to.be.false;
                done();
            });
        });
    });

    context('using serveCss', function() {
        it('should return file if it exists', function (done) {
            let status, contentType, fileWasFound;
            ws.writeHead = function(stat, content) {
                status = stat;
                contentType = content;
            };
            ws.on('pipe', (src) => {
                let data = '';
                src.on('data', (chunk) => {
                    data += chunk;
                });
                src.on('end', () => {
                    expect(fileWasFound).to.be.true;
                    expect(status).to.equal(200);
                    expect(contentType).to.deep.equal({
                        'Content-type': 'text/css'
                    });
                    expect(data).to.equal(cssFile);
                    done();
                });
            });
            serveCss(__dirname + '/../public/css/styles.css', ws)
            .then((fileFound) => {
                fileWasFound = fileFound;
            });

        });
        it('should return false if file does not exist', function (done) {
            serveCss(__dirname + '/../public/css/fake.css', ws)
            .then((fileFound) => {
                expect(fileFound).to.be.false;
                done();
            });
        });
    });

    context('using serveJs', function() {
        it('should return file if it exists', function (done) {
            let status, contentType, fileWasFound;
            ws.writeHead = function(stat, content) {
                status = stat;
                contentType = content;
            };
            ws.on('pipe', (src) => {
                let data = '';
                src.on('data', (chunk) => {
                    data += chunk;
                });
                src.on('end', () => {
                    expect(fileWasFound).to.be.true;
                    expect(status).to.equal(200);
                    expect(contentType).to.deep.equal({
                        'Content-type': 'text/javascript'
                    });
                    expect(data).to.equal(jsFile);
                    done();
                });
            });
            serveJs(__dirname + '/../public/js/xhr-helper.js', ws)
            .then((fileFound) => {
                fileWasFound = fileFound;
            });

        });
        it('should return false if file does not exist', function (done) {
            serveJs(__dirname + '/../public/js/fake.js', ws)
            .then((fileFound) => {
                expect(fileFound).to.be.false;
                done();
            });
        });
    });
});
