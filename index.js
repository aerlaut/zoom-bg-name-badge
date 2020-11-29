const express = require('express')
const path = require('path')
const multer = require('multer')

require('dotenv').config()

const app = express()
const port = process.env.SERVER_PORT
const host = process.env.SERVER_HOST
const upload = multer({
  dest: 'imgs/',
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    let mimetype = filetypes.test(file.mimetype)
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if(mimetype && extname) {
      return cb(null, true)
    }

    cb("Error: File upload only supports the following filetypes - " + filetypes);
  }
}).single('img')

app.use(express.static('public'))

// Serve front page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, + "/public/index.html"))
})

// Listen to POST requests
app.post("/upload", (req, res) => {

  // Check for upload errors
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      res.status(500).json({ msg : err })
    } else {

        // TODO : Save filename in database

        // Error success, return url for filename
        res.json({
          msg: 'test',
        })
    }
  })

})

// Run app
app.listen(port, host, () => {
  console.log(`ZoomBG App listening at http://${host}:${port}`)
})