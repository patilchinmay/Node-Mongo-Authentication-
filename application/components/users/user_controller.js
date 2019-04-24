const http = require("http");
const User = require('./user_model');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const async = require("async");
const response_service = require('../../utils/response_service');

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
                    console.log(`password_hash_ = ${hash}`)
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

        console.log(user);
        console.log(`password_hash = ${password_hash}`);
        
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
            data: 'Please provide username and password',
        }, res);
    }
}