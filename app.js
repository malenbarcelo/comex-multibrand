const express = require('express')
const path = require('path')
const publicPath =  path.resolve('./public')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const indexRoutes = require('./src/routes/indexRoutes.js')
const usersRoutes = require('./src/routes/usersRoutes.js')
const dataRoutes = require('./src/routes/dataRoutes.js')
const apisRoutes = require('./src/routes/apisRoutes.js')
const statisticsRoutes = require('./src/routes/statisticsRoutes.js')
const importsRoutes = require('./src/routes/importsRoutes.js')
const userLoggedMiddleware = require('./src/middlewares/userLoggedMiddleware.js')

const app = express()

//use public as statis
app.use(express.static(publicPath))

//use cors to allow any website to connet to my app
//app.use(cors())

//get forms info as objects
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//set views folder in src/views
app.set('views', path.join(__dirname, 'src/views'));

//set templates extension (ejs)
app.set('view engine','ejs')

//configure session
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false
}))

//middlewares
app.use(userLoggedMiddleware)

//Declare and listen port
const APP_PORT = 3001
app.listen(APP_PORT,() => console.log("Servidor corriendo en puerto " + APP_PORT))

//Routes
app.use('/',indexRoutes)
app.use('/users',usersRoutes)
app.use('/data',dataRoutes)
app.use('/imports',importsRoutes)
app.use('/statistics',statisticsRoutes)
app.use('/apis',apisRoutes)

/*console.log('jaime: ' + bcrypt.hashSync('jbarcelo',10))
console.log('malen: ' + bcrypt.hashSync('mbarcelo',10))
console.log('tomas: ' + bcrypt.hashSync('tallegri',10))*/
