// Import module
const jsonfile = require('jsonfile');

// Import config
const config = jsonfile.readFileSync('./config.json');

const key = config.key;

class HttpError extends Error {
    toJSON() {
        const stack = process.env.NODE_ENV === 'development' ? this.stack : undefined
        return {
            type: this.type || 'SERVER_ERROR',
            message: this.message || 'Server Error',
            stack
        }
    }
}

class NotFoundError extends HttpError {
    constructor(message = 'Not found', type = 'NOT_FOUND') {
        super(message)
        this.status = 404
        this.type = type
    }
}

class BadRequestError extends HttpError {
    constructor(message = 'Bad request', type = 'BAD_REQUEST') {
        super(message)
        this.status = 400
        this.type = type
    }
}

class ServerError extends HttpError {
    constructor(message = 'Server Error', type = 'SERVER_ERROR') {
        super(message)
        this.status = 500
        this.type = type
    }
}

class KeyAuthentification {
    constructor(myKey) {
        this.key = key;
        this.myKey = myKey;
    }

    authentification() {
        if (this.key !== this.myKey) return false;
        return true;
    }
}

module.exports = { HttpError, NotFoundError, BadRequestError, ServerError, KeyAuthentification };