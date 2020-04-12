require ('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require ('cors')
console.log(process.env.API_TOKEN)
const helmet = require('helmet')
const MOVIEDATA = require('./movies-data-small.json')


const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
  
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
   return res.status(401).json({ error: 'Unauthorized request' })
   }

  next()


})


function handleGetMovie(req, res) {
  let response = MOVIEDATA

  if (req.query.genre) {
    response = response.filter(movies =>
      // case insensitive searching
      movies.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
  }
  if (req.query.country) {
    response = response.filter(movies =>
      // case insensitive searching
      movies.country.toLowerCase().includes(req.query.country.toLowerCase())
    )
  }

  
if (req.query.average_vote) {
    let selection = req.query.average_vote
    response = response.filter(movies =>   
    movies.avg_vote >= selection)
    
  }

  res.json(response)    
}




 app.get('/movie', handleGetMovie)


   

const PORT = 8020

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})