var bodyParser = require('body-parser');
// var csrf = require('csurf');
var express = require('express');
var mongoose = require('mongoose');
var session = require('client-sessions');
var cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const corsOptions={
  origin:'http://localhost:8080/'
}
/**
 * Given a user object:
 *
 *  - Store the user object as a req.user
 *  - Make the user object available to templates as #{user}
 *  - Set a session cookie with the user object
 *
 *  @param {Object} req - The http request object.
 *  @param {Object} res - The http response object.
 *  @param {Object} user - A user object.
 */
module.exports.createUserSession = function(req, res, user) {
  var cleanUser = {
    firstName:  user.firstName,
    lastName:   user.lastName,
    email:      user.email,
    data:       user.data || {},
  };

  req.session.user = cleanUser;
  req.user = cleanUser;
  res.locals.user = cleanUser;
};

/**
 * Create and initialize an Express application that is 'fully loaded' and
 * ready for usage!
 *
 * This will also handle setting up all dependencies (like database
 * connections).
 *
 * @returns {Object} - An Express app object.
 */
module.exports.createApp = function() {
  mongoose.connect('mongodb://localhost/svcc');

  var app = express();
  //CORS-enabled web server listening on port 8080
  app.use(cors(corsOptions))
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // settings


  // middleware
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    cookieName: 'session',
    secret: 'keyboard cat',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  }));
  app.use(cors(corsOptions))
//   app.use(csrf());

  // routes
app.get('/',(req,res)=>{
    res.send("hello")
})
  return app;
};
