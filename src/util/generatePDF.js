const pdf = require('html-pdf');
const fs = require('fs');

module.exports = (html, output, callback) => {
  pdf.create(
    html,
    {
      format: 'A4',
      phantomArgs: ['--local-url-access=false'],
    },
  ).toFile(output, createPDFHandler);

  function createPDFHandler(err, pdf) {
    if (err) {
      callback(err);
    }
  
    const file = fs.readFileSync(pdf.filename)

    callback(null, file);
  }
}


