require('dotenv').config()

const express = require('express');
const ejs = require('ejs');
const puppeteer = require('puppeteer');

const path = require('path');
const { promisify } = require('util');

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

app.get('/pdf', async (_request, response) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(process.env.APP_URL, {
    waitUntil: 'networkidle0',
  });

  const pdf = await page.pdf({
    printBackground: true,
    format: 'a4',
    margin: {
      top: '20px',
      bottom: '20px',
      right: '20px',
      left: '20px',
    }
  });
  
  await browser.close();

  return response.contentType('application/pdf').send(pdf);
});

app.get('/', async (_request, response) => {
  const asyncRenderFile = promisify(ejs.renderFile);

  try {
    const page = await asyncRenderFile(
        path.resolve(__dirname, 'content.ejs'),
        { passengers }
      );

    response.send(page)
  } catch (err) {
    return response.status(500).json({ 
      error: 'Could not render page',
      details: err,
    });
  }
});

app.listen(3000);
