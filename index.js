const express = require('express')
const Datastore = require('nedb')
const { isURL } = require('validator')
const crs = require('crypto-random-string')
const url = require('url')
const database = new Datastore({ filename: 'lurl.db', autoload: true })
const app = express()
let linkToGive = ''

app.set('view engine', 'pug')
app.use('/', express.json({limit: '1mb'}))

app.get('/', (req, res) => res.render('index'))

app.post('/', (req, res) => {
  if (isURL(req.body.url)) {
    const parsedUrl = url.parse(req.body.url)

    database.findOne({href: parsedUrl.href}, (err, docs) => {
      if (err) throw new Error(err)

      if (docs) {
        linkToGive = docs._id
      } else {
        const { protocol, hostname, pathname, href } = url.parse(req.body.url)

        linkToGive = crs({type: 'url-safe', length: 8})
        database.insert({ _id: linkToGive, protocol, hostname, pathname, href })
      }
    })

    res.json({})
  } else {
    res.json({ error: 'Invalid URL', received: req.body.url })
  }
})

app.use(express.static('public'))

app.get('/present', (req, res) => res.render('present', {link: linkToGive}))

app.get('/:id', (req, res) => {
  database.findOne({_id: req.params.id}, (err, docs) => {
    if (err) throw new Error(err)

    if (docs) {
      const prot = docs.protocol === null ? 'http:' : docs.protocol
      const fullpath = !docs.hostname ? docs.href : `${docs.hostname}${docs.pathname}`

      res.redirect(`${prot}//${fullpath}`)
    }

    res.send()
  })
})

app.get('*', (req, res) => res.render('404'))

app.listen(process.env.PORT || 3000)
