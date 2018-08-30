
const fs = require('fs')

module.exports.uploadFile = function(files, dest){
    /* 
       @ files[object of formData]
       @ dest[name folder]
       @ return { error, message_error, object }
    */
    return new Promise(function(resolve, reject){

        let allNameImg = []

        if(typeof files === 'object' && !Array.isArray(files)){

            let countFiles = Object.keys(files).length

            for(let key in files) {

                let fileName = files[key].name
                let metaImg = files[key]

                if(metaImg.mimetype === 'image/jpeg' || metaImg.mimetype === 'image/png') {
                    // rename image
                    let splitFileName = fileName.split(".")
                    let ranName = Math.random().toString(36).substring(2, 15) 
                        + Math.random().toString(36).substring(2, 15);
                    let nameImgUpload = 'O_' + ranName + '.' + splitFileName[splitFileName.length-1]
                    
                    console.log(dest + '/' + nameImgUpload)
                    let wS = fs.createWriteStream(dest + '/' + nameImgUpload)
                    wS.write(metaImg.data)

                    // the finish event is emitted when all data has been flushed from the stream
                    wS.on('finish', () => {  
                        allNameImg.push(nameImgUpload)
                        --countFiles
                        if(countFiles === 0){
                            resolve({ error: false, msg: 'uploaded.', allNameImg: allNameImg })
                        }
                    });

                    // handle error
                    wS.on('error', () => {
                        console.log('Error upload => file have a punha')
                        resolve({ error: true, msg: 'can not upload file!', allNameImg: allNameImg })
                    })

                    wS.end();  
                }else {
                    resolve({ error: true, msg: 'not an image!', allNameImg: allNameImg })
                }
            }// end for
        }else {
            console.log('not object')
            resolve({ error: true, msg: 'files not object!', allNameImg: allNameImg })
        }
        
    })
}

module.exports.resize = function(){
    return new Promise(function(resolve, reject){

    })
}

module.exports.unlinkFile = function(path, files){

    console.log('typeof files =>',typeof files)
    if(typeof files === 'string'){
        fs.unlink(`${path}/${files}`, (err) => {
            if(err){
                console.log('path/file.txt was deleted');
                console.log(err)
            }else{
                console.log('delete image success ...')
            }
        })
    }else {
        // typeof => object
        for(let key in files) {
            fs.unlink(`${path}/${files[key]}`, (err) => {
                if (err) {
                    console.log('path/file.txt was deleted');
                    console.log(err)
                }else {
                    console.log('delete image success ...')
                }
            });
        }
    }
    

}