const express = require('express')
const path = require('path')

require('dotenv').config()

const app = express()
const port = process.env.SERVER_PORT
const host = process.env.SERVER_HOST

app.use(express.static('public'))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, + "/public/index.html"))
})

app.listen(port, host, () => {
  console.log(`ZoomBG App listening at http://${host}:${port}`)
})