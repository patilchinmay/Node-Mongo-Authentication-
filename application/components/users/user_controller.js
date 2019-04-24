const http = require("http");
const UserModel = require('./user_model');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const async = require("async");
const response_service = require('../../utils/response_service');

exports.user_register = async (req, res, next) => {
    const email     = req.body.email || '';
    const password  = req.body.password || '';

    if (email && password) {
        response_service.send({
            status: response_service.getCode().codes.OK,
            data: {email: email, password: password},
        }, res);
    }else{
        response_service.send({
            status: response_service.getCode().codes.BAD_REQUEST,
            data: 'Please provide username and password',
        }, res);
    }
}