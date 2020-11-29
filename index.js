const express = require('express')
const path = require('path')
const multer = require('multer')
const cryptoRandomString = require('crypto-random-string')
const mongoose = require('mongoose')
const ImgSchema = require('./ImgSchema.js')
const Img = mongoose.model('image', ImgSchema);

require('dotenv').config()

// Create app
const app = express()
const port = process.env.SERVER_PORT
const host = process.env.SERVER_HOST
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const db_host = process.env.DB_HOST
const db_port = process.env.DB_PORT
const db_name = process.env.DB_NAME
app.use(express.static('public'))
app.use(express.static('imgs'))

// Connect to database
mongoose.connect(`mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}?authSource=admin&ssl=false`)

// Serve front page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, + "/public/index.html"))
})


// Fetch image shared by URL
app.get("/share/:imgid", (req, res) => {

  // Get data from database
  Img.findOneAndUpdate({ url: req.params.imgid },
                       { $inc : { views : 1 } },
                       { projection : { filename : 1 } },
                       (err, doc) => {
                          if(err) res.status(500).json({ msg : err })
                          res.json({
                            status: 'OK',
                            filename : doc.filename
                          })
                       })

})

// Listen for save images
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

app.post("/upload", (req, res) => {

  // Check for upload errors
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      res.status(500).json({ msg : err })
    } else {

        // Generate unique URL
        let imgUrl = cryptoRandomString({length: 6, type: 'alphanumeric'})

        // Save file in database
        let newImg = { url : imgUrl,
                        filename : req.file.filename
                      }

        Img.create(newImg, (err) => {
          if (err) res.status(500).json({ msg : err })

          // Success, return url for filename
          res.json({
            status: 'OK',
            msg: newImg.url,
          })
        })
    }
  })

})

// Run app
app.listen(port, host, () => {
  console.log(`ZoomBG App listening at http://${host}:${port}`)
})