const express = require('express')
const Datastore = require('nedb')
const database = new Datastore({
  filename: 'lurl.db',
  autoload: true
})
const app = express()
let linkToGive = ''

app.use('/api/shorturl/new', express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public'))
app.use('/api/shorturl/new', express.json({limit: '1mb'}))

app.set('view engine', 'pug')

app.post('/api/shorturl/new', (req, res) => {
  const validator = require('validator')
  const crs = require('crypto-random-string')
  const url = require('url')

  if (validator.isURL(req.body.url)) {
    const parsedUrl = url.parse(req.body.url)

    database.findOne({href: parsedUrl.href}, (err, docs) => {
      if (err) throw new Error(err)

      if (docs) {
        linkToGive = docs._id
      } else {
        linkToGive = crs({type: 'url-safe', length: 8})
        database.insert({
          _id: linkToGive,
          ...url.parse(req.body.url)
        })
      }
    })

    res.json({})
  } else {
    res.json({
      error: 'Invalid URL',
      received: req.body.url
    })
  }
})

app.get('/api/shorturl/new/present', (req, res) => {
  res.render('present', {link: linkToGive})
})

app.get('/api/shorturl/:id', (req, res) => {
  database.findOne({_id: req.params.id}, (err, docs) => {
    if (err) {
      throw new Error(err)
    }

    if (docs) {
      const prot = docs.protocol === null ? 'http:' : docs.protocol
      const fullpath = !docs.hostname ? docs.href : `${docs.hostname}${docs.pathname}`

      res.redirect(`${prot}//${fullpath}`)
    }

    res.send()
  })
})

app.use('*', express.static('public/404.html'))

app.listen(3000)
