const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const { JWT_SECRET } = require('../configs/' + process.env.NODE_ENV + '/jwt');

function setJson(status, msg, data){
    return {
        status: status,
        msg: msg,
        data: data
    }
}

function reverseString(str) {

    var splitString = str.split("");
    var reverseArray = splitString.reverse();
    
    return reverseArray.join("");

}

function genToken(key){

    let _keyEncode = reverseString(key+'.'+JWT_SECRET)

    let _token = JWT.sign({
            iss: 'mLri',
            sub: _keyEncode,
            iat: new Date().getTime(), //curent time
            exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET)

    return _token

    // return JWT.sign({
    //     iss: 'mLri',
    //     sub: key,
    //     iat: new Date().getTime(), //curent time
    //     exp: new Date().setDate(new Date().getDate() + 1)
    // }, JWT_SECRET)
}

module.exports = {

    allUsers: async (req, res) => {
        
        console.log('req allUser => ', req.user)

        try {
            let _allUser = await User._findAll()

            if(_allUser){
                res.status(200).json(setJson(true, '', _allUser.data))
            }else{
                res.status(403).json(setJson(false, 'Data empty.', {}))
            }
        } catch(error){
            if(error) throw error
        }
    },



    getUser: async (req, res) => {
        try {
            const _id = (req.params.id).trim()
            let _user = await User._findOne({ _id: _id})
            
            // found user
            if(_user.status){
                res.status(200).json(setJson(true, '', _user.data))
            }else{
                res.status(403).json(setJson(false, 'Not found data.', {}))
            }
        } catch(error){
            if(error) throw error
        }
    },



    addUser: async (req, res) => {
        try {
            const _email = req.body.email
            const _data = req.body
    
            // check duplicate email
            let _dupEmail = await User._findOne({ email: _email })

            // if don't duplicate email
            if(!_dupEmail.status){

                // hash password
                let _salt = await bcrypt.genSalt(10)
                _data.pass = await bcrypt.hash(_data.pass, _salt)

                let _newUser = await User._create(_data)
                console.log('_newUser => ', _newUser)
                return res.status(200).json(setJson(true, 'Save success.', _newUser.data))
            }else{
                return res.status(403).json(
                    setJson(false, 'Email is already in use or wrong format email', {})
                )
            }
        } catch(error) {
            if(error) throw error
        }
    },

    /* Don't shoute be changed pass | another api */
    updateUser: async (req, res) => {
        try {

            const _id = req.params.id
            const _data = req.body

            let _updated = await User._update(_id, _data)

            if(_updated.status){
                res.status(200).json(setJson(true, '', _updated.data))
            }else{
                res.status(403).json(setJson(false, 'Can not update, please check id or param or data.'))
            }
        } catch(error){
            if(error) throw error
        }
    },



    deleteUser: async (req, res) => {
        try {
            const _id = req.params.id

            let _deleted = await User._delete(_id)

            if(_deleted.status){
                res.status(200).json(setJson(true, '', _deleted.data))
            }else{
                res.status(403).json(setJson(false, 'Can not delete, please check id', {}))
            }
        } catch(error){
            if(error) throw error
        }
    },


    signin: async (req, res) => {
        try{
            
            let _email = req.body.email
            let _pass = req.body.pass

            // find user
            let _user = await User._findOne({ email: _email })

            if(_user.status){
                //found user
                // compare password
                let _isUser = await bcrypt.compare(_pass, _user.data.pass)

                if(_isUser){
                    // generate a token
                    let _token = genToken(_user.data._id)

                    let _data = {
                        firstName: _user.data.firstName,
                        lastName: _user.data.lastName,
                        email: _user.data.email,
                        picture: _user.data.picture,
                        tel: _user.data.tel,
                        token: _token
                    }

                    res.status(200).json(setJson(true, '', _data))

                }else{
                    res.status(403).json(setJson(false, 'username or password is wrong!', {}))
                }

            }else{
                //not found user!!!!
                res.status(403).json(setJson(false, 'not found user !!!', {}))
            }
                
        } catch(error){
            if(error) throw error
        }
    }
}