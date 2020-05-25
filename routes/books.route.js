const { Router } = require('express');
const request = require('request');
const router = Router();
const _ = require('lodash');
const books = require('../books');

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Books management
 */

router.get('/books', (req, res) => {
  request('http://localhost:3001/api/v1/authors', (error, response, body) => {     // Utilizo esta llamada para simular llamada a base de datos y no usar el JSON que tengo en el código.
    if(error) throw error;
    const authors = JSON.parse(body);
    _.each(books, (book) => {
      book.author = authors.find(author => book.authorID === author.id);
    });
    res.json(books);
  });
});

/**
 * @swagger
 * path:
 *  /books/:
 *    get:
 *      summary: Get all books
 *      tags: [Books]
 *      responses:
 *        "200":
 *          description: A list of books
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Books'
 */

router.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(book => id === book.id);
  if (!book) return res.status(404).json({'Error': 'Book not found'});
  request('http://localhost:3001/api/v1/authors', (error, response, body) => {     // Utilizo esta llamada para simular llamada a base de datos y no usar el JSON que tengo en el código.
    if(error) throw error;
    const authors = JSON.parse(body);
    book.author = authors.find(author => book.authorID === author.id);
    res.json(book);
  });
});

/**
 * @swagger
 * path:
 *  /books/{bookID}:
 *    get:
 *      summary: Get a book by id
 *      tags: [Books]
 *      parameters:
 *        - in: path
 *          name: bookID
 *          schema:
 *            type: integer
 *          required: true
 *          description:
 *      responses:
 *        "200":
 *          description: A book object
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Book'
 *        "404":
 *          content:
 *            application/json:
 *                example: {'Error': 'Book not found'}
 */

router.post('/books', (req, res) => {
  const {title, isbn, pageCount, publishedDate, thumbnailUrl, shortDescription, longDescription, status, authorID, categories} = req.body;
  if(title && isbn && pageCount && publishedDate && thumbnailUrl && shortDescription && longDescription && status && typeof authorID !== 'undefined' && categories) {
    request('http://localhost:3001/api/v1/authors', (error, response, body) => {     // Utilizo esta llamada para simular llamada a base de datos y no usar el JSON que tengo en el código.
      if(error) throw error;
      const authors = JSON.parse(body);
      const authorDB_ID = authors.find(author => authorID === author.id);
      if (authorDB_ID) {
        req.body.id = books[books.length - 1].id + 1;
        const newBook = { ...req.body };
        books.push(newBook);
        res.json({'added': 'ok'});
      } else {
        res.status(404).json({'Error': 'authorID not found on Database'});
      }
    });
  } else {
    res.status(400).json({'statusCode': 'Bad request'});
  }
});

/**
 * @swagger
 * path:
 *  /books/:
 *    post:
 *      summary: Create a new book
 *      tags: [Books]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      responses:
 *        "200":
 *          description: A book schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Book'
 *        "404":
 *          content:
 *            application/json:
 *                example: {'Error': 'authorID not found on Database'}
 *        "400":
 *          content:
 *            application/json:
 *                example: {'statusCode': 'Bad request'}
 */

router.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  _.remove(books, (book) => {
    return book.id === id;
  });
  res.json(books);
});

/**
 * @swagger
 * path:
 *  /books/{bookID}:
 *    delete:
 *      summary: Delete a book by id
 *      tags: [Books]
 *      parameters:
 *        - in: path
 *          name: bookID
 *          schema:
 *            type: integer
 *          required: true
 *          description:
 *      responses:
 *        "200":
 *          description: Delete a book by id
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Books'
 */

router.put('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookToChange = books.find(book => id === book.id);
  if (!bookToChange) return res.status(404).json({'Error': 'Book not found'});
  delete req.body.id;
  Object.assign(bookToChange, req.body);
  res.json({'modified':'ok', 'result': bookToChange});
});

/**
 * @swagger
 * path:
 *  /books/{bookID}:
 *    put:
 *      summary: Edit a book
 *      tags: [Books]
 *      parameters:
 *        - in: path
 *          name: bookID
 *          schema:
 *            type: integer
 *          required: true
 *          description:
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      responses:
 *        "200":
 *          description: A book schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Book'
 *        "404":
 *          content:
 *            application/json:
 *                example: {'Error': 'Book not found'}
 */


/**
 * @swagger
 *  components:
 *    schemas:
 *      Book:
 *        type: object
 *        required:
 *          - id
 *          - title
 *          - isbn
 *          - authorID
 *        properties:
 *          id:
 *            type: integer
 *          title:
 *            type: string
 *          isbn:
 *            type: string
 *          pageCount:
 *            type: integer
 *          publishedDate:
 *            type: object
 *            properties:
 *              date:
 *                type: string
 *          thumbnailUrl:
 *            type: string
 *          shortDescription:
 *            type: string
 *          longDescription:
 *            type: string
 *          status:
 *            type: string
 *          authorID:
 *            type: integer
 *          categories:
 *            type: array
 *            items:
 *              type: string
 *          author:
 *            $ref: '#/components/schemas/Author'
 *        example:
 *          id: 0
 *          title: Unlocking Android
 *          isbn: 1933988673
 *          pageCount: 416
 *          publishedDate:
 *            date: 2009-04-01T00:00:00.000-0700
 *          thumbnailUrl: https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/ableson.jpg
 *          shortDescription: Unlocking Android A Developer's Guide provides concise, hands-on instruction for the Android operating system and development tools. This book teaches important architectural concepts in a straightforward writing style and builds on this with practical and useful examples throughout.
 *          longDescription: Android is an open source mobile phone platform based on the Linux operating system and developed by the Open Handset Alliance, a consortium of over 30 hardware, software and telecom companies that focus on open standards for mobile devices. Led by search giant, Google, Android is designed to deliver a better and more open and cost effective mobile experience.    Unlocking Android A Developer's Guide provides concise, hands-on instruction for the Android operating system and development tools. This book teaches important architectural concepts in a straightforward writing style and builds on this with practical and useful examples throughout. Based on his mobile development experience and his deep knowledge of the arcane Android technical documentation, the author conveys the know-how you need to develop practical applications that build upon or replace any of Androids features, however small.    Unlocking Android A Developer's Guide prepares the reader to embrace the platform in easy-to-understand language and builds on this foundation with re-usable Java code examples. It is ideal for corporate and hobbyists alike who have an interest, or a mandate, to deliver software functionality for cell phones.    WHAT'S INSIDE        * Android's place in the market      * Using the Eclipse environment for Android development      * The Intents - how and why they are used      * Application classes            o Activity            o Service            o IntentReceiver       * User interface design      * Using the ContentProvider to manage data      * Persisting data with the SQLite database      * Networking examples      * Telephony applications      * Notification methods      * OpenGL, animation & multimedia      * Sample Applications
 *          status: PUBLISH
 *          authorID: 0
 *          categories: ["Open Source", "Mobile"]
 *      Books:
 *        type: array
 *        description: Array of Books
 *        items:
 *          $ref: '#/components/schemas/Book'
 */

module.exports = router;
