const router = require('../routes/route');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.use(router);

app.listen(process.env.SERVE_PORT, () =>{
    console.log(`Server is running on http://localhost:${process.env.SERVE_PORT}/`);
});