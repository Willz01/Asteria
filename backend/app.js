require('dotenv').config()
const path = require('path')

const express = require('express')


const app = express()
app.use(express.json())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const PORT = 5600


app.use(express.static(path.join(__dirname, '../', 'frontend')))

// served pages '/start', '/bookings', '/signUp'
app.use('/start', (req, res) => {
  res.sendFile(path.join(
    __dirname, '../',
    'frontend',
    'index.html'
  ))
})

//* enpoints --routes

// ':id', '/'--all
const moviesRouter = require('./router/moviesrouter')
app.use('/api/movies', moviesRouter)

const userRouter = require('./router/userrouter')
app.use('/api/users', userRouter)

const theaterRouter = require('./router/theaterrouter')
app.use('/api/theaters', theaterRouter)

const bookingRouter = require('./router/bookingrouter')
app.use('/api/bookings', bookingRouter)

const screeningRouter = require('./router/screeningrouter')
app.use('/api/screenings', screeningRouter)

const reservedSeatRouter = require('./router/reservedseatrouter')
app.use('/api/reservedseat', reservedSeatRouter)

app.listen(PORT, () => {
  console.log(`Asteria server running @ PORT: ${PORT}`);
  console.log('Start page served at http://127.0.0.1:5600/');
})