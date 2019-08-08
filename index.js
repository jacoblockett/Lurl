const express = require('express')
const validator = require('validator')
// const Datastore = require('nedb')
// const database = new Datastore({
//   filename: 'lurl.db',
//   autoload: true
// })
const app = express()

app.use('/api/shorturl/new', express.static('public'))

app.use('/api/shorturl/new', express.json({limit: '1mb'}))

app.post('/api/shorturl/new', (req, res) => {
  if (validator.isURL(req.body.url)) {
    res.json({
      iGot: req.body.url,
      isURL: true
    })
  } else {
    res.json({
      iGot: req.body.url,
      isURL: false
    })
  }
})

app.get('/api/shorturl/:id', (req, res) => {
  res.send('there')
})

app.use('*', express.static('public/404.html'))

app.listen(3000)