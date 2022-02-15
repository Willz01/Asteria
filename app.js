require('dotenv').config()
const path = require('path')

const express = require('express')


const app = express()
app.use(express.json())
const PORT = 5600

app.use(express.static(path.join(__dirname, 'frontend', 'public')))


app.use('/', express.static(
  path.join(
    __dirname,
    'frontend',
    'public')
)
)


app.listen(PORT, () => {
  console.log(`Asteria server running @ PORT: ${PORT}`);
})