const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')

/* config file */
const db_config = require('./configs/' + process.env.NODE_ENV + '/database')

mongoose.connect(`mongodb://${ db_config.BASE_URL }:${ db_config.DB_PORT}/${ db_config.DB_NAME }`, { useNewUrlParser: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('DB connected...')
    const app = express()
    const port = process.env.PORT || 3100

    app.use(morgan('dev'))
    app.use(bodyParser.json())

    /* use router */
    app.use('/api/user', require('./routes/user.route'))

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
