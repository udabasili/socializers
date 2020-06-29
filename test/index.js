const express = require('express');
const app = express();

// require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();

const port = process.env.PORT || 6000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));
module.exports = server