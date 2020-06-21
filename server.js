require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./app/_helpers/error-handler');
const initializeDb = require("./app/_helpers/db-initializer");

// Database initialization through config file
initializeDb(require("./config/db").url);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Api routes
app.use('/users', require('./app/routes/users.controller'));

// Global error handler
app.use(errorHandler);

// Start server
const port = process.env.PORT || 4000;
app.listen(port, function () {
    console.log('Server started on port ' + port);
});