const express = require('express')
const router = express.Router()

// include controller
const memberControllers = require('../controllers/member.controller')

// include libary validate data
const { validateBody, schemas } = require('../validator/member.validator')

// include passport
const passport = require('passport')
// require('../passports/user.passport')

router.route('/')
    .get(
        // passport.authenticate('jwt', { session: false }),
        memberControllers.allMember)

router.route('/img/:name')
    .get(
        memberControllers.getImage)

router.route('/:id')
    .get(
        // passport.authenticate('jwt', { session: false }), 
        memberControllers.getMember)

// router.route('/upload')
//     .post(
//         // upload.single('fileImg'),
//         (req, res ,next) => {
//             console.log('upload')
//             console.log(req.body)
//         }
//     )

router.route('/add')
    .post(
        // upload image
        // upload.single('avatar'),
        // passport.authenticate('jwt', { session: false }), 
        // validateBody(schemas.add), 
        memberControllers.addMember
    )

router.route('/update/:id')
    .put(
        passport.authenticate('jwt', { session: false }),
        // validateBody(schemas.update), 
        memberControllers.updateMember)

router.route('/delete/:id')
    .delete(
        passport.authenticate('jwt', { session: false }),
        memberControllers.deleteMember)

// router.route('/signin')
//     .post(
//         validateBody(schemas.signin), 
//         userControllers.signin)

module.exports = router