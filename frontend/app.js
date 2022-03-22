const path = require('path')

const express = require('express')


const app = express()
app.use(express.json())
const PORT = 5601

app.use(express.static(path.join(__dirname, '../', 'frontend')))

app.all('/views/*', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, 'views', 'page-not-found.html'));
});

app.all("*", (req, res) => {
  res.sendFile(path.join(
    __dirname, '../',
    'frontend',
    'index.html'
  ))
});


// served pages '/start', '/bookings', '/signUp'


app.listen(PORT, () => {
  console.log(`Asteria server running @ PORT: ${PORT}`);
  console.log('Start page served at http://127.0.0.1:5601/');
})