const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer  = require('multer')
const path = require('path')
// const upload = multer({ dest: 'uploads/' })

var configStorage = multer.diskStorage({
   destination: function (req, file, cb) {

      // console.log(file)

      cb(null, 'server/firmwares')
   },
   filename: function (req, file, cb) {
      cb(null, file.originalname)
   }
})
var upload = multer({ storage: configStorage }).array('config')

const refParser = require('json-schema-ref-parser')
// refParser.dereference(configFilePath).then(schema => {
//    return res.status(200).json(schema)
// })


const session = require('express-session')
app.use(session({
   resave: false,
   saveUninitialized: true,
   secret: 'any string'
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.use(express.static(__dirname + '/../build'));

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin",
       req.headers.origin);
   res.header("Access-Control-Allow-Headers",
       "Origin, X-Requested-With, Content-Type, Accept");
   res.header("Access-Control-Allow-Methods",
       "GET, POST, PUT, DELETE, OPTIONS");
   res.header("Access-Control-Allow-Credentials", "true");
   next();
});

require('./controllers/firmwares.controller.server')(app, upload)
require('./controllers/configurations.controller.server')(app, upload)
require('./controllers/schemas.controller.server')(app, upload)
// require('./controllers/generic.controller.server')(app)
// require('./controllers/users.controller.server')(app)
// require('./controllers/hello.controller.server')(app)
// require('./controllers/collection.controller.server')(app)
require('./controllers/comparison.controller.server')(app)

// app.get('/*', function(req,res) {
//    res.sendFile(path.join(__dirname+'/../build/index.html'));
// });

app.listen(process.env.PORT || 4000)
