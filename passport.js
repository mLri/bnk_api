const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { JWT_SECRET } = require('./configs/' + process.env.NODE_ENV + '/jwt')

// include model
const User = require('./models/user.model')

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try{
        // reverse payload
        let _splitString = (payload.sub).split("");
        let _reverseArray = _splitString.reverse();
        let id = (_reverseArray.join("")).split(".")

        let _user = await User._findOne({_id: id[0]})

        if(!_user.status){
            return done(null, false)
        }

        done(null, _user)
    } catch(error){
        done(error, false)
    }
    
}))
