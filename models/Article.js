
var mongoose = require("mongoose"); // Require mongoose
var Schema = mongoose.Schema; // Create Schema class

// Article schema
var ArticleSchema = new Schema({
  source: {
      type: String,
      required: true
  },
  title: {
    type: String,
    required: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;