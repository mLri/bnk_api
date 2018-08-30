const Member = require('../models/member.model')
const _FILE = require('../lib/uploadFile')
const fs = require('fs')
const _pathApp = require('../configs/' + process.env.NODE_ENV + '/path')
// const bcrypt = require('bcryptjs')
// const JWT = require('jsonwebtoken')
// const { JWT_SECRET } = require('../configs/' + process.env.NODE_ENV + '/jwt');

function setJson(status, msg, data){
    return {
        status: status,
        msg: msg,
        data: data
    }
}

module.exports = {

    allMember: async (req, res) => {
        
        //req.user = user oauth
        // console.log('req allUser => ', req.user)

        try {
            let _allMember = await Member._findAll()

            if(_allMember){
                res.status(200).json(setJson(true, '', _allMember.data))
            }else{
                res.status(403).json(setJson(false, 'Data empty.', {}))
            }
        } catch(error){
            if(error){
                return res.status(403).json(setJson(false, error, {}))
            }
        }
    },

    getImage: async (req, res) => {
        try {
            console.log('in getImage ...')
            //var _name = req.params.name
            console.log(_pathApp.PATH_APP + '/uploads/' + req.params.name)
            var _rs = fs.createReadStream(_pathApp.PATH_APP + '/uploads/' + req.params.name)
            _rs.pipe(res)
            // console.log(_rs)
            _rs.on('close', () => {
                console.log('finish readStream...')
            })

            _rs.on('error', () => {
                console.log('error createReadStream image')
                res.status(404).json({ err: 'Can not read prop >name<' })
            })
        }catch(error){
            if(error){
                return res.status(403).json(setJson(false, error, {}))
            }
        }
    },



    getMember: async (req, res) => {
        try {
            const _id = (req.params.id).trim()
            let _member = await Member._findOne({ _id: _id})
            
            /* found user */
            if(_member.status){
                res.status(200).json(setJson(true, '', _member.data))
            }else{
                res.status(403).json(setJson(false, 'Not found data.', {}))
            }
        } catch(error){
            if(error) throw error
        }
    },



    addMember: async (req, res) => {
        try {

            let checkFiles = Object.keys(req.files).length

            if(checkFiles !== 0){

                /* upload image */
                const _dest = _pathApp.PATH_APP + '/uploads'
                var objUploaded = await _FILE.uploadFile(req.files, _dest)

                if(!objUploaded.error){
                    console.log('upload success...')

                    /* check object pass body */
                    if(Object.keys(req.body).length !== 0){
                        
                        const _data = JSON.parse(req.body.profile)

                        /* set info image */
                        let _img_name = objUploaded.allNameImg[0]
                        for(let key in req.files){
                            var _img_size = req.files[key].size
                        }
                        _data.avatar.name = _img_name
                        _data.avatar.path = "uploads/" + _img_name
                        _data.avatar.size = _img_size

                        /* insert body to database */
                        let _newMember = await Member._create(_data)
                        console.log('_newMember => ', _newMember)

                        if(_newMember.status){
                            return res.status(200).json(setJson(
                                true,
                                'save successful.',
                                _newMember.data
                            ))
                        }else{
                            /* delete image if insert fails */
                            _FILE.unlinkFile('uploads', objUploaded.allNameImg)

                            return res.status(201).json(setJson(
                                false,
                                'save fail, please check data',
                                {}
                            ))
                        }
                    }else {
                        /* delete image if no body */
                        _FILE.unlinkFile('uploads', objUploaded.allNameImg)
                        return res.status(201).json(setJson(false, 'pass body empty, not insert to db!', {}))
                       
                    }

                } else { 
                    console.log('upload error !!!')
                    return res.status(201).json(setJson(false, 'upload error!', {}))
                }

            }else{
                return res.status(201).json(setJson(false, 'file empty', {}))
            }

        } catch(error) {
            console.log('in catch ------')
            _FILE.unlinkFile('uploads', objUploaded.allNameImg)
            if(error) throw error
        }
    },

    /* Don't shoute be changed pass | another api */
    updateMember: async (req, res) => {
        try {
            const _id = req.params.id
            const _data = JSON.parse(req.body.profile)
            const _oldImage = _data.avatar.name

            let checkFiles = Object.keys(req.files).length

            if(checkFiles !== 0){
                /* upload image */
                const _dest = _pathApp.PATH_APP + '/uploads'
                var objUploaded = await _FILE.uploadFile(req.files, _dest)

                if(!objUploaded.error){
                    console.log('upload success...')
                    /* set info image */
                    let _img_name = objUploaded.allNameImg[0]
                    for(let key in req.files){
                        var _img_size = req.files[key].size
                    }
                    _data.avatar.name = _img_name
                    _data.avatar.path = "uploads/" + _img_name
                    _data.avatar.size = _img_size

                    /* remove old image */
                    _FILE.unlinkFile('uploads', _oldImage)
                    console.log('remove old image success ...')
                } else { 
                    console.log('upload error !!!')
                    return res.status(201).json(setJson(false, 'upload error!', {}))
                }
            }

            console.log('_data => ', _data)
            console.log('_oldImage => ', _oldImage)

            /* check object pass body */
            if(Object.keys(req.body).length !== 0){

                /* insert body to database */
                let _newMember = await Member._update(_id, _data)
                console.log('_newMember => ', _newMember)

                if(_newMember.status){
                    return res.status(200).json(setJson(
                        true,
                        'update successful.',
                        _newMember.data
                    ))
                }else{
                    /* delete image if insert fails */
                    _FILE.unlinkFile('uploads', objUploaded.allNameImg)

                    return res.status(201).json(setJson(
                        false,
                        'save fail, please check data',
                        {}
                    ))
                }
            }else {
                /* delete image if no body */
                _FILE.unlinkFile('uploads', objUploaded.allNameImg)
                return res.status(201).json(setJson(false, 'pass body empty, not insert to db!', {}))
            
            }
                // return res.status(201).json(setJson(false, 'file empty', {}))
            

            // console.log(req)
            // const _id = req.params.id
            // const _data = req.body

            // let _updated = await User._update(_id, _data)

            // if(_updated.status){
            //     res.status(200).json(setJson(true, '', _updated.data))
            // }else{
            //     res.status(403).json(setJson(false, 'Can not update, please check id or param or data.'))
            // }
        } catch(error){
            if(error)
                return res.status(201).json(setJson(false, error, {}))
        }
    },



    deleteMember: async (req, res) => {
        try {
            const _id = req.params.id
            console.log('_id => ', _id)

            let _deleted = await Member._delete(_id)

            console.log('_delete => ', _deleted)
            if(_deleted.status){
                // delete image
                _FILE.unlinkFile('uploads', _deleted.data.avatar.name)

                res.status(200).json(setJson(true, '', _deleted.data))
            }else{
                res.status(201).json(setJson(false, 'Can not delete, please check id', {}))
            }
        } catch(error){
            if(error)
                return res.status(201).json(setJson(false, error, {}))
        }
    }

}