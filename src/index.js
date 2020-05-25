const express = require('express');
const app = express();
const morgan = require('morgan');
const router = require('../routes/index');
const swaggerDoc = require('../swaggerDoc');

swaggerDoc(app);

app.use(express.urlencoded(({extended: false})));
app.use(express.json());

app.use(morgan('dev'));
app.use(router);

app.listen(3001, ()=>{
  console.log(`Server Listen on port ${3001}`);
});