
var userService = require('../services/userService');
var express = require('express');
var validator = require("email-validator");
const cacheService = require('../services/cacheService');
const emailService = require('../services/emailService');
var router = express.Router();

router.post('/sign_up_user', async function (req, res) {
    const payload = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    }

    let warning = null;

    if (payload.firstName.length < 3) {
        warning = "First name should have atleast 3 characters!"
    }
    else if (payload.lastName.length < 3) {
        warning = "Last name should have atleast 3 characters!"
    }
    else if (validator.validate(payload.email) == false) {
        warning = "Please provide a valid email address!"
    }
    else if (payload.email.includes("@gmail.com") == false) {
        warning = "We currently support gmail emails only! Please use a gmail account."
    }
    else if (payload.password.length < 8) {
        warning = "Password must be atleast 8 characters!"
    }

    if (warning != null) {
        req.flash('warning', warning)
        res.redirect('/signUp')
    } else {
        await userService.createUserAccount(payload).then(async response => {
            await cacheService.setUserData(response.data)                            
            res.redirect('/')            
        }).catch(error => {
            req.flash('error', "Ooops! Seems there was a problem while trying to create your account."),
                res.redirect('/signUp')
        });
    }
});

router.post('/sign_in_user', async function (req, res, next) {
    const payload = {
        email: req.body.email,
        password: req.body.password,
    }

    let warning = null;

    if (validator.validate(payload.email) == false) {
        warning = "Please provide a valid email address!"
    }
    else if (payload.email.includes("@gmail.com") == false) {
        warning = "We currently support gmail emails only! Please use a gmail account."
    }
    else if (payload.password.length < 8) {
        warning = "Password must be atleast 8 characters!"
    }

    if (warning != null) {
        req.flash('warning', warning)
        res.redirect('/signIn')
    } else {        
        await userService.loginUser(payload).then(
            async response => {                
                await cacheService.setUserData(response.data)                            
                emailService.startEmailTracking(payload.email, payload.password)
                res.redirect('/')
            }).catch(err => {
                if (err?.response?.data == "invalidCredentials") {
                    req.flash('warning', "Invalid Credentials Provided. Please enter the correct details.")
                }
                else {
                    req.flash('error', "Ooops! Seems there was a problem while trying to authenticate you.")

                }                
                res.redirect('/signIn')
            });
    }
});

module.exports = router;