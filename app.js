require('dotenv').config()
const path = require('path')

const express = require('express')


const app = express()
app.use(express.json())
const PORT = 5600

app.use(express.static(path.join(__dirname, 'frontend', 'public')))

// serve
app.use('/', express.static(
  path.join(
    __dirname,
    'frontend',
    'public',
    'views'
  )
)
)


// enpoints
app.use('/movies', (req, res, next) => {

})
app.use('/bookings', (req, res, next) => {

})



app.listen(PORT, () => {
  console.log(`Asteria server running @ PORT: ${PORT}`);
})