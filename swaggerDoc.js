const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Node REST API project. Books and Authors",
      version: "1.0.0",
      description:
        "A project to create a REST API in Node. In Incluit and SimTLIX training",
      contact: {
        name: "Macarena Pecha",
        url: "https://linkedin.com/in/macarena-pecha-62aaa7170",
        email: "macupecha@hotmail.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3001/api/v1"
      }
    ]
  },
  apis: ['./routes/authors.route.js', './routes/books.route.js']
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: false
  }));
};
