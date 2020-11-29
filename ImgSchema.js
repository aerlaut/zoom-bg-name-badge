const Schema = require("mongoose").Schema;

// Create Mongoose models
const Image = new Schema({
  url : {
    type: String,
    index: true,
    unique: true
  },
  filename : {
    type: String
  },
  views : {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

module.exports = Image