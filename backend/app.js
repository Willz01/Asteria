require('dotenv').config()
const path = require('path')

const express = require('express')
let cors = require('cors')

const app = express()

const allowedOrigins = ['http://localhost:5601'];
const methods = ["GET", "PUT", "POST", "PATCH", "UPDATE", "HEAD", "OPTIONS", "DELETE"]
const headers = ["Origin", "X-Requested-With", "Content-Type", "Accept"]


app.use(cors({
  origin: '*',
  methods: methods,
  headers: headers
}));

app.use(express.json());
const PORT = 5600

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