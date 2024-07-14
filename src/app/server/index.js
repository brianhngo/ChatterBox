const express = require('express');
const dotenv = require('dotenv');

const cors = require('cors');
const morgan = require('morgan');
const profileRouter = require('./api/Profile');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
dotenv.config();

const app = express();
const port = process.env.PORT;

// packages we need
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/profile', profileRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
