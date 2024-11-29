const express = require('express')
const path = require('path')
const publicPath =  path.resolve('./public')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bcrypt = require('bcryptjs')
const userLoggedMiddleware = require('./src/middlewares/userLoggedMiddleware.js')

//ROUTES
const appRoutes = require('./src/routes/appRoutes.js')
const dataRoutes = require('./src/routes/apisRoutes/dataRoutes.js')
const importsRoutes = require('./src/routes/apisRoutes/importsRoutes.js')



const indexRoutes = require('./src/routes/indexRoutes.js')
const usersRoutes = require('./src/routes/usersRoutes.js')
//const dataRoutes = require('./src/routes/dataRoutes.js')
const apisRoutes = require('./src/routes/apisRoutes.js')
const statisticsRoutes = require('./src/routes/statisticsRoutes.js')
const importsRoutesOld = require('./src/routes/importsRoutesOld.js')
const costingsRoutes = require('./src/routes/costingsRoutes.js')



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
    store: new FileStore(),
    secret:'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Change to true in PRD to use HTTPS
}))

//middlewares
app.use(userLoggedMiddleware)

//Declare and listen port
const APP_PORT = 3001
app.listen(APP_PORT,() => console.log("Servidor corriendo en puerto " + APP_PORT))

//Routes
app.use('/',appRoutes)
app.use('/apis/data',dataRoutes)
app.use('/apis/imports',importsRoutes)







app.use('/',indexRoutes)
app.use('/users',usersRoutes)

app.use('/data',dataRoutes)
app.use('/data/apis',dataRoutes)

app.use('/costings',costingsRoutes)
app.use('/costings/apis',costingsRoutes)

app.use('/imports',importsRoutesOld)
app.use('/statistics',statisticsRoutes)
app.use('/apis',apisRoutes)

// console.log('jaime: ' + bcrypt.hashSync('jbarcelo',10))
// console.log('malen: ' + bcrypt.hashSync('mbarcelo',10))
// console.log('tomas: ' + bcrypt.hashSync('tallegri',10))
