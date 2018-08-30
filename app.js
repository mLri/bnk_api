const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const busboyBodyParser = require('busboy-body-parser')

/* config file */
const db_config = require('./configs/' + process.env.NODE_ENV + '/database')
const _pathApp = require('./configs/' + process.env.NODE_ENV + '/path')

mongoose.connect(`mongodb://${ db_config.BASE_URL }:${ db_config.DB_PORT}/${ db_config.DB_NAME }`, { useNewUrlParser: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('DB connected...')
    console.log('_dirname app => ', __dirname)
    _pathApp.PATH_APP = __dirname;
    console.log('_PATH_APP => ', _pathApp.PATH_APP)
    const app = express()
    const port = process.env.PORT || 3100

    app.use(cors())
    app.use(morgan('dev'))
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json())
    app.use(busboyBodyParser())
    // app.use(bodyParser.urlencoded({ extended: false }))

    app.use(express.static('uploads'))

    // use instant passport-jwt Strategy
    require('./passports/user.passport')

    /* use router */
    app.use('/api/user', require('./routes/user.route'))
    app.use('/api/member', require('./routes/member.route'))

    app.listen(port, () => {
        console.log('server is running or port : ' + port)
    })
});

/* old connection 
    /* connect database */
    // mongoose.connect(`mongodb://${ db_config.BASE_URL }/${ db_config.DB_NAME }`,
    //     function(err){
    //         // if(err) throw err
    //         if(err){
    //             console.log('can not connect database.')
    //             console.log('Fuck Error!!!!!!!! :' +err)
    //             return
    //         }else{
    //             console.log('connect database success...')
    //             const app = express()
    //             const port = process.env.PORT || 3100

    //             app.use(morgan('dev'))
    //             app.use(bodyParser.json())

    //             /* use router */

    //             app.listen(port, () => {
    //                 console.log('server is running or port : ' + port)
    //             })
    //         }
    //     }
    // );
    // mongoose.Promise = global.Promise;


    // const app = express()
    // const port = process.env.PORT || 3100

    // app.use(morgan('dev'))
    // app.use(bodyParser.json())

    // /* use router */

    // app.listen(port, () => {
    //     console.log('server is running or port : ' + port)
    // })
