require('dotenv').config()
const path = require('path')

const express = require('express')


const app = express()
app.use(express.json())
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

// app.use('/bookings', (req, res) => {
//   res.sendFile(path.join(
//     __dirname, '../',
//     'frontend',
//     'public',
//     'views', 'bookings.html'
//   ))
// })

// app.use('/signUp', (req, res) => {
//   res.sendFile(path.join(
//     __dirname, '../',
//     'frontend',
//     'public',
//     'views', 'signUp.html'
//   ))
// })


//* enpoints --routes

// ':id', '/'--all
const moviesRouter = require('./router/moviesrouter')
app.use('/api/movies', moviesRouter)

const userRouter = require('./router/userrouter')
app.use('/api/users', userRouter)


app.listen(PORT, () => {
  console.log(`Asteria server running @ PORT: ${PORT}`);
  console.log('Start page served at http://127.0.0.1:5600/');
})