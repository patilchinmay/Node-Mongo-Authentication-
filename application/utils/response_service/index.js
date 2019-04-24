const codes = require('./response_codes');

class response_service {
    static send(options, resp) {
        const message = options.message || null;
        const response = {};
        response.code = options.status[0];
        response.data = options.data || 'No Data';
        response.status = options.status[1];
        response.message = options.message || null;
        if (message) {
            response.message = message;
        }
        resp.status(response.code).send(response);
    }

    static getCode() {
        return codes;
    }
}

module.exports = response_service;

