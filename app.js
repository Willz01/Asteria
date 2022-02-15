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


// enpoints --routes
const moviesRouter = require('./router/moviesrouter')
app.use('/movies', moviesRouter)

const bookingsRouter = require('./router/bookingrouter')
app.use('/bookings', bookingsRouter)



app.listen(PORT, () => {
  console.log(`Asteria server running @ PORT: ${PORT}`);
})