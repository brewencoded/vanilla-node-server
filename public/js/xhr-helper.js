(function(window) {
    var state = {
        xhrHelper: null
    };

    var XHRError = function(code, request) {
        var _error = null;
        if (code === 404) {
            _error = Error('File or resource not found');
            _error.code = code;
            _error.request = request;
        } else if (code === 500) {
            _error = Error('Internal Server Error');
            _error.code = code;
            _error.request = request;
        } else {
            throw Error('XHRError code ' + code + ' not implemented');
        }
        return _error;
    };

    var XHR = {
        httpRequest: null,
        init: function() {
            this.httpRequest = new XMLHttpRequest();
            return Object.create(this);
        },
        ajax: function(url, method, data) {
            var query = '';
            if (data) {
                query = this.encodeData(data);
            }
            if (method.toLowerCase() === 'get') {
                url += '?' + query;
            }

            var XHRResponse = {
                then: function(fn) {
                    XHR.httpRequest.onreadystatechange = function() {
                        if (XHR.httpRequest.readyState === XMLHttpRequest.DONE) {
                            if (XHR.httpRequest.status === 200) {
                                fn(null, XHR.httpRequest.responseText);
                            } else {
                                var error = XHRError(XHR.httpRequest.status, url);
                                fn(error, null);
                            }
                        }
                    };

                    XHR.httpRequest.open(method, url);
                    if (method.toLowerCase() === 'post') {
                        XHR.httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                        XHR.httpRequest.send(query);
                    } else {
                        XHR.httpRequest.send();
                    }

                    return this;
                }
            };
            return XHRResponse;
        },
        encodeData: function(data) {
            return Object.keys(data)
                .map(function(k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
                })
                .join('&');
        }
    };

    if (!state.xhrHelper) {
        var XHRHelper = XHR.init();
        XHRHelper.get = function(url, data) {
            return this.ajax(url, 'GET', data);
        };
        XHRHelper.post = function(url, data) {
            return this.ajax(url, 'POST', data);
        };
        XHRHelper.delete = function(url, data) {
            return this.ajax(url, 'GET', data);
        };

        window.XHRRequest = XHRHelper;
    }

})(window);
