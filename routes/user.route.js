const express = require('express')
const router = express.Router()

// include controller
const userControllers = require('../controllers/user.controller')

// include libary validate data
const { validateBody, schemas } = require('../validator/user.validator')

// include passport
const passport = require('passport')
require('../passports/user.passport')

router.route('/')
    .get(
        passport.authenticate('jwt', { session: false }), 
        userControllers.allUsers)

router.route('/:id')
    .get(
        passport.authenticate('jwt', { session: false }), 
        userControllers.getUser)

router.route('/add')
    .post(
        passport.authenticate('jwt', { session: false }), 
        validateBody(schemas.add), 
        userControllers.addUser)

router.route('/update/:id')
    .put(
        passport.authenticate('jwt', { session: false }),
        validateBody(schemas.update), 
        userControllers.updateUser)

router.route('/delete/:id')
    .delete(
        passport.authenticate('jwt', { session: false }),
        userControllers.deleteUser)

router.route('/signin')
    .post(
        validateBody(schemas.signin), 
        userControllers.signin)

module.exports = router