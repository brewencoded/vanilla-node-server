const {
    serveCss,
    serveJs,
    serveHtml
} = require('./file-handler');

const setRoute = function(path, method) {
    return {
        handler: function(fn) {
            this.routes.push({
                path,
                method,
                handler: fn
            });
        }.bind(Router)
    };
};

const serveFile = function(req, res) {
    return {
        html(path) {
            serveHtml(path, res);
        },
        css(path) {
            serveCss(path, res);
        },
        js(path) {
            serveJs(path, res);
        }
    };
};

const Router = {
    routes: [],
    staticPath: null,
    defaultResponse: null,
    init() {
        return Object.create(this);
    },
    default(fn) {
        this.defaultResponse = fn;
    },
    delete(path) {
        return setRoute(path, 'delete');
    },
    defaultFileNotFound(res) {
        res.writeHead(404, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({
            message: 'path not found'
        }));
    },
    fileNotFound(req, res) {
        if (this.defaultResponse) {
            this.defaultResponse(req, res);
        } else {
            this.defaultFileNotFound(res);
        }
    },
    get(path) {
        return setRoute(path, 'get');
    },
    post(path) {
        return setRoute(path, 'post');
    },
    put(path) {
        return setRoute(path, 'put');
    },
    route: setRoute,
    serve: serveFile,
    static(path) {
        this.staticPath = path;
    },
    start(req, res) {
        // add serveFiles to res
        res.serve = () => {
            return this.serve(req, res);
        };
        // check if route is set
        const matchingRoute = this.routes.find((route) => route.path === req.url && route.method === req.method.toLowerCase());
        if (matchingRoute) {
            matchingRoute.handler(req, res);
        } else if (req.url.indexOf('.css') !== -1) {
            serveCss(this.staticPath + req.url, res)
            .then((fileFound) => {
                if (!fileFound) {
                    this.defaultFileNotFound(res);
                }
            });
        } else if (req.url.indexOf('.js') !== -1) {
            serveJs(this.staticPath + req.url, res)
            .then((fileFound) => {
                if (!fileFound) {
                    this.defaultFileNotFound(res);
                }
            });
        } else if (req.url.indexOf('.html') !== -1) {
            serveHtml(this.staticPath + req.url, res)
            .then((fileFound) => {
                if (!fileFound) {
                    this.fileNotFound(req, res);
                }
            });
        } else {
            this.fileNotFound(req, res);
        }

    }
};

const singleton = {
    router: null
};

module.exports = function ExportRouter() {
    if (!singleton.router) {
        singleton.router = Router.init();
        return singleton.router;
    }
    return singleton.router;
};
