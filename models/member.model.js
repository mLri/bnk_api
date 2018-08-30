const mongoose = require('mongoose')
const Schema = mongoose.Schema

/*
    TODO: created, modified wrong time
*/
const memberSchema = new Schema({
    firstName: {
        th: {
            type: String,
            require: true
        },
        en: {
            type: String,
            require: true
        }
    },
    lastName: {
        th: {
            type: String,
            require: true
        },
        en: {
            type: String,
            require: true
        }
    },
    nickName: {
        type: String,
        required: true
    },
    birth: {
        type: String,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    province: {
        type: String,
        require: true
    },
    like: {
        type: String,
        required: true
    },
    blood: {
        type: String,
        required: true
    },
    hobby: {
        type: String,
        required: true
    },
    avatar: {
        name: {
            type: String,
            require: true
        },
        path: {
            type: String,
            require: true
        },
        size: {
            type: String
        },
        type: {
            type: String,
            require: true
        }
    },
    gen: {
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

const Model = module.exports = mongoose.model('member', memberSchema);

module.exports._findAll = function(){
    return new Promise(function(resolve, reject){
        Model.find({}, function(err, doc){
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
        Model.findOne(condition, function(err, doc){
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
        Model.create(data, function(err, doc){
            if(err){
                console.log(':: method :: _create ERROR => ', err)
                return resolve({ status: false, data: doc})
            } 
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
        Model.findOneAndUpdate(_condition, _query, function(err, doc){
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
        Model.findByIdAndRemove(_condition, function(err, doc){
            if(err) console.log(':: method :: _delete ERROR => ', err)
            if(doc){
                return resolve({ status: true, data: doc })
            }else{
                return resolve({ status: false, data: doc })
            }
        })
    })
}
