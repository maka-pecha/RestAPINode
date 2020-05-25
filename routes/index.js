const { Router } = require('express');
const router = Router();
const books = require('./books.route');
const authors = require('./authors.route');

router.get('/', (req, res) => {
  res.send('Hello World, I am Maka');
  res.json({"title" : "Hello World, I am Maka"});
});

router.use('/api/v1', books);
router.use('/api/v1', authors);

module.exports = router;
