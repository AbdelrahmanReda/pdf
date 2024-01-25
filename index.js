const express = require('express');
const pdfRouter = require('./pdfRouter');
const app = express();

app.get('/', (req, res) => {
  res.send('Express on Vercel');
});

app.use(express.json());
app.use('/api', pdfRouter); // Mount the router under the '/api' path

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
