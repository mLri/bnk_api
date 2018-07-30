const mongoose = require('mongoose')
const Schema = mongoose.Schema

/*
    TODO: created, modified wrong time
*/
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    tel: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    }
})

const User = module.exports = mongoose.model('user', userSchema);

module.exports._findAll = function(){
    return new Promise(function(resolve, reject){
        User.find({}, function(err, doc){
            if(err) console.log(':: method :: _findAll ERROR => ', err)
            if(doc){
                return resolve({ status: true, data: doc })
            }else{
                return resolve({ status: false, data: doc })
            }
        })
    })
}

module.exports._findOne = function(condition){
    return new Promise(function(resolve, reject){
        User.findOne(condition, function(err, doc){
            if(err) console.log(':: method :: _findOne ERROR => ', err)
            if(doc){
                return resolve({ status: true, data: doc })
            }else{
                return resolve({ status: false, data: doc })
            }
        })
    })
}

module.exports._create = function(data){
    return new Promise(function(resolve, reject){
        User.create(data, function(err, doc){
            if(err) console.log(':: method :: _create ERROR => ', err)
            if(doc){
                return resolve({ status: true, data: doc })
            }else{
                return resolve({ status: false, data: doc })
            }
            
        })
    })
}

module.exports._update = function(id, data){
    let _condition = {
        _id : id
    }
    let _query = data
    return new Promise(function(resolve, reject){
        User.findOneAndUpdate(_condition, _query, function(err, doc){
            if(err) console.log(':: method :: _update ERROR => ', err)
            if(doc){
                return resolve({ status: true, data: doc })
            }else{
                return resolve({ status: false, data: doc })
            }
        })
    })
}

module.exports._delete = function(id){
    let _condition = {
        _id : id
    }
    return new Promise(function(resolve, reject){
        User.findByIdAndRemove(_condition, function(err, doc){
            if(err) console.log(':: method :: _delete ERROR => ', err)
            if(doc){
                return resolve({ status: true, data: doc })
            }else{
                return resolve({ status: false, data: doc })
            }
        })
    })
}
