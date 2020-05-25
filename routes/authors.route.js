const { Router } = require('express');
const router = Router();
const request = require('request');
const _ = require('lodash');
const authors = require('../authors');

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Authors management
 */

router.get('/authors', (req, res) => {
  res.json(authors);
});

/**
 * @swagger
 * path:
 *  /authors/:
 *    get:
 *      summary: Get all authors
 *      tags: [Authors]
 *      responses:
 *        "200":
 *          description: A list of authors
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Authors'
 */

router.get('/authors/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const author = authors.find(author => id === author.id);
  if (!author) return res.status(400).json({'Error': 'Author not found'});
  res.json(author);
});

/**
 * @swagger
 * path:
 *  /authors/{authorID}:
 *    get:
 *      summary: Get an author by id
 *      tags: [Authors]
 *      parameters:
 *        - in: path
 *          name: authorID
 *          schema:
 *            type: integer
 *          required: true
 *          description:
 *      responses:
 *        "200":
 *          description: An author object
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Author'
 *        "404":
 *          content:
 *            application/json:
 *                example: {'Error': 'Author not found'}
 */

router.post('/authors', (req, res) => {
  const firstName = req.body.name.first;
  const lastName = req.body.name.last;
  if(firstName && lastName) {
    req.body.id = authors[authors.length - 1].id + 1;
    const newAuthor = { ...req.body };
    authors.push(newAuthor);
    res.json(newAuthor);
  } else {
    res.status(400).json({'statusCode': 'Bad request'});
  }
});

/**
 * @swagger
 * path:
 *  /authors/:
 *    post:
 *      summary: Create a new author
 *      tags: [Authors]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Author'
 *      responses:
 *        "200":
 *          description: An author schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Author'
 *        "400":
 *          content:
 *            application/json:
 *                example: {'statusCode': 'Bad request'}
 */

router.delete('/authors/:id', (req, res) => {
  const id = parseInt(req.params.id);
  request('http://localhost:3001/api/v1/books', (error, response, body) => {     // Utilizo esta llamada para simular llamada a base de datos y no usar el JSON que tengo en el código.
    if(error) throw error;
    const books = JSON.parse(body);
    const bookExist = books.filter(book => id === book.authorID);
    if (bookExist.length > 0) return res.status(400).json({'Error': `To delete this author you must first delete its ${bookExist.length} associated books.`});
    _.remove(authors, (author) => {
      return author.id === id;
    });
    res.json(authors);
  });
});

/**
 * @swagger
 * path:
 *  /authors/{authorID}:
 *    delete:
 *      summary: Delete an author by id
 *      tags: [Authors]
 *      parameters:
 *        - in: path
 *          name: authorID
 *          schema:
 *            type: integer
 *          required: true
 *          description:
 *      responses:
 *        "200":
 *          description: Delete an author by id
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Authors'
 *        "400":
 *          content:
 *            application/json:
 *                example: {'Error': 'To delete this author you must first delete its 3 associated books.'}
 */

router.put('/authors/:id', (req, res) => {
  const id = parseInt(req.params.id);
  // Decidi implementar un find para utilizar menos recursos que un each
  const authorToChange = authors.find(author => id === author.id);
  if (!authorToChange) return res.status(404).json({'Error': 'Author not found'});
  delete req.body.id;
  Object.assign(authorToChange, req.body);
  res.json({'modified':'ok', 'result': authorToChange});
});

/**
 * @swagger
 * path:
 *  /authors/{authorID}:
 *    put:
 *      summary: Edit an author
 *      tags: [Authors]
 *      parameters:
 *        - in: path
 *          name: authorID
 *          schema:
 *            type: integer
 *          required: true
 *          description:
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Author'
 *      responses:
 *        "200":
 *          description: An author schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Author'
 *        "404":
 *          content:
 *            application/json:
 *                example: {'Error': 'Author not found'}
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      Author:
 *        type: object
 *        required:
 *          - id
 *          - name
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: object
 *            properties:
 *              first:
 *                type: string
 *              last:
 *                type: string
 *            required:
 *              - first
 *              - last
 *        example:
 *          id: 0
 *          name:
 *            first: Maka
 *            last: Pecha
 *      Authors:
 *        type: array
 *        description: Array of Authors
 *        items:
 *          $ref: '#/components/schemas/Author'
 */

module.exports = router;