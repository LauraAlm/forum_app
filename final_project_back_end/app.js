const express = require('express');
const cors = require('cors');
const router = require('./router/router');
const app = express();
const port = 2500;
const mongoose = require('mongoose');

require('dotenv').config();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

mongoose
  .connect(
    'mongodb+srv://admin1:admin1@cluster0.vhwqcky.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('Connection successful.');
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.json());
app.use(cors());
app.use('', router);
app.listen(port, () => {});
