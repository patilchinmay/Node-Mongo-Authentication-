const http = require("http");
const User = require('./user_model');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const async = require("async");
const response_service = require('../../utils/response_service');
const config = require('../../../config/index')

function hash_password(password){
    return new Promise(async (resolve, reject) => {
        try{
            bcryptjs.hash(password, 13, (err, hash) => {
                if (err){
                    return response_service.send({
                        status: response_service.getCode().codes.FAILURE,
                        message: 'An error occured!',
                        data: err
                    }, res);
                    
                }else{
                    resolve(hash); 
                }
            });
    
        } catch (error){
            return response_service.send({
                status: response_service.getCode().codes.FAILURE,
                message: 'An error occured!',
                data: error
            }, res);
        }
    });    
}

// Check if the user already exists
function check_unique_user(email){
    return new Promise( async (resolve, reject) => {
        try{
            User.find({email:email})
                .exec()
                .then((existing_user) => {
                    if (existing_user.length >= 1){
                        resolve(true); // User already exists
                    } else {
                        resolve(false); // User doesn't exist
                    }
                })
        } catch (error) {
            return response_service.send({
                status: response_service.getCode().codes.FAILURE,
                message: 'An error occured!',
                data: error
            }, res);
        }
    })
}

// Register a user
exports.user_register = async (req, res, next) => {
    const email     = req.body.email || '';
    const password  = req.body.password || '';

    if (email && password) {
        // Check if the user already exists. Return either true or false.
        let existing_user = await check_unique_user(email);

        // Stop execution and return if the user already exists!
        if(existing_user == true){
            return response_service.send({
                    status: response_service.getCode().codes.CONFLICT,
                    message: 'Email already exists!'
                }, res);
        }

        let password_hash = await hash_password(password);

        const user = new User({
            _id:  new mongoose.Types.ObjectId(),
            email: email,
            password: password_hash,
            timestamp: Date.now()
        });
        
        // Create user in the mongo db.
        user.save()
            .then(saved_user =>{
                response_service.send({
                    data: saved_user._id,
                    status: response_service.getCode().codes.CREATED,
                    message: 'User successfully registered!',
                }, res);
            })
            .catch(err => {
                response_service.send({
                    status: response_service.getCode().codes.FAILURE,
                    message: 'Failed to save user!',
                    data: err
                }, res);
            });
    }else{
        response_service.send({
            status: response_service.getCode().codes.BAD_REQUEST,
            message: 'Please provide email and password',
        }, res);
    }
}

// Log in a user
exports.user_login = async (req, res, next) => {
    const email     = req.body.email || '';
    const password  = req.body.password || '';

    if (email && password) {
        User.find({email:email})
            .select()
            .exec()
            .then(user => {
                // More thatn 1 user found with the same email
                if(user.length < 1){
                    return response_service.send({
                        status: response_service.getCode().codes.FAILURE,
                        message: 'Authentication Failed!',
                    }, res);
                }

                // Validate password
                bcryptjs.compare(password, user[0].password, (err, result) => {
                    if(err){
                        // If there is an error while comparing. System couldn't compare passwords.
                        return response_service.send({
                            status: response_service.getCode().codes.FAILURE,
                            message: 'Authentication Failed!',
                        }, res);
                    } else if (result){
                        //If the password is correct. Create a token for sending it to user
                        const token = jwt.sign({
                            email: user[0].email,
                            user_id: user[0]._id
                        },
                        config.JWT_KEY,         // SERVE THROUGH ENVIRONMENT VARIABLE IN PRODUCTION
                        {
                            expiresIn: "24h" // Update var expires
                        });

                        var signed = Date.now();
                        var expires = signed + (24*60*60*1000); //(Hours*Minutes*Seconds*Miliseconds)
                        
                        // Send the token
                        return response_service.send({
                            status: response_service.getCode().codes.OK,
                            message: 'Authentication Successful!',
                            data: {
                                    token: token,
                                    _id: user[0]._id,
                                    iat: signed,
                                    exp: expires,
                                    email: user[0].email
                            }
                        }, res);
                        
                    } else {
                        // If the password is incorrect
                        return response_service.send({
                            status: response_service.getCode().codes.FAILURE,
                            message: 'Authentication Failed!',
                        }, res);
                    }
                });
            })
            .catch(error => {
                return response_service.send({
                    status: response_service.getCode().codes.FAILURE,
                    message: 'An error occured!',
                    data: err
                }, res);
            });
    }else{
        response_service.send({
            status: response_service.getCode().codes.BAD_REQUEST,
            message: 'Please provide email and password',
        }, res);
    }
}

exports.user_protected = async (req, res, next) => {
    return response_service.send({
        status: response_service.getCode().codes.OK,
        message: 'User is logged in',
        data: req.userData  // userData is populated in check-auth middleware. It is called in the routes files while calling this function.
    }, res);
}