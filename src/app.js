process.env.NODE_ENV = process.env.NODE_ENV || 'development'


const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const session = require('express-session')

const config = require('./config')

//替换Promise
mongoose.Promise = global.Promise = require('bluebird')

//连接数据库
mongoose.connect(config.mongo.uri,config.mongo.options)

let modelPath = path.join(__dirname,'model')
fs.readdirSync(modelPath).forEach((file)=>{
	if (/(.*)\.js$/.test(file)) {
		require(modelPath + '/' + file);
	}
})

const app = express()

app.use('/static',express.static('tmp'))
// 跨域
app.use(cors())

// compress all responses
app.use(compression())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(session({
	secret: "mxie-secret",
	resave: false,
	saveUninitialized: false,
	cookie:config.session.cookie,
}))

require('./routes.js')(app)

app.listen(config.port,function () {
  console.log('server Listening on ' + config.port + '\n')
})
