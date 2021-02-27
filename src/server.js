const express = require('express');
const ejs = require('ejs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');

const generatePDF = require('./util/generatePDF');

const app = express();

const passengers = [
  {
    name: 'Welton',
    flightNumber: 'AD4145',
    time: '13:15'
  },
  {
    name: 'José',
    flightNumber: 'AD4145',
    time: '13:15'
  },
  {
    name: 'Letícia',
    flightNumber: 'AD4145',
    time: '13:15'
  },
];

app.use(express.static(path.resolve(__dirname, '..', 'public')))

app.get('/', async (_request, response) => {
  const asyncRenderFile = promisify(ejs.renderFile);
  const asyncPDF = promisify(generatePDF);

  try {
    const page = await asyncRenderFile(
        path.resolve(__dirname, 'content.ejs'),
        { passengers }
      );

    const file = await asyncPDF(
      page,
      path.resolve(__dirname, '..', 'public', `${uuidv4()}.pdf`)
    );

    return response.contentType('application/pdf').send(file);
  
  } catch (err) {
    return response.status(500).json({ 
      error: 'Could not create PDF file',
      details: err,
    });
  }
});

app.listen(3000);
