require('dotenv').config()
const path = require('path')

const express = require('express')


const app = express()
app.use(express.json())
const PORT = 5600

app.use(express.static(path.join(__dirname, '../', 'frontend', 'public')))

// serve --test
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

// ':id', '/'--all
const moviesRouter = require('./router/moviesrouter')
app.use('/api/movies', moviesRouter)


// '/current', '/previous' & '/:id' booking
// const bookingsRouter = require('./router/bookingrouter')
// app.use('/api/bookings', bookingsRouter)

const userRouter = require('./router/userrouter')
app.use('/api/users', userRouter)



app.listen(PORT, () => {
  console.log(`Asteria server running @ PORT: ${PORT}`);
  console.log('Start page served at http://127.0.0.1:5600/');
})