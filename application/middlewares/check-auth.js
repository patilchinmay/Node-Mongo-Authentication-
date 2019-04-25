const jwt = require('jsonwebtoken');
const config = require('../../config/index');
const response_service = require('../utils/response_service');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, config.JWT_KEY);
        req.userData = decoded;
        next();

    }catch(error){
        return response_service.send({
            status: response_service.getCode().codes.FAILURE,
            message: 'Authentication Failed!',
        }, res);
    }
}