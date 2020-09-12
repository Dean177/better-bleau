const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)

const loadAssets = Promise.all([readFile('./app.js'), readFile('./app.css')])

let content = null

const app = express()

app.use('*', async (request, response, next) => {
  const url = `https://bleau.info${request.originalUrl}`
  const bleauResponse = await axios.get(url)
  const contentType = bleauResponse.headers['content-type'] || ''
  if (contentType.includes('text/html')) {
    const $ = cheerio.load(bleauResponse.data)
    $('body').append(content)
    response.send($.html())
  } else {
    response.redirect(url)
  }
})

loadAssets.then(([jsFile, cssFile]) => {
  content = `
    <style>${cssFile}</style>
    <script>${jsFile}</script>
  `
  app.listen(process.env.PORT || 3000, () => {
    console.info('Started')
  })
})
