var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var app = express(); // reference Express 
// Var Step = require("step");
var googl = require('goo.gl');
var gKey = googl.setKey('AIzaSyBXobGbNYWd9dc0PUQ8Qb27kOI6nQWXxPs');
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

mongoose.Promise = Promise; // configure mongoose for ES6 promises
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public")); //Static Directory

// Mongoose config and init
mongoose.connect("mongodb://localhost/scraperdata14"); // Mongod connection
var db = mongoose.connection;
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
}); 
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Routes

app.get("/scrape", function(req, res) {

function skraper(srce,sURL,urlSwitch,skrapeParm) {
  // urlSwitch (boolean) is for URL scrapes that require their base url as a prefix 
  // skrapeParm the scrape search term 
    console.log("\n***********************************\n" +
                "Scraping top stories from " +srce+"."+
                "\n***********************************\n");

    request (sURL, function(error, response, html) { 
      var $ = cheerio.load(html);
            $(skrapeParm).each(function(i, element) {
              var link = $(this).children("a").attr("href");
                var title = $(this).children("a").text().trim(); 
                 // format the Title
                    title = title.replace(/\t|\n/g, "");  // strip out certain characters
                    if (urlSwitch) link = sURL + link; // If URL root is required.

                    if (title.indexOf('(UPI) --') > -1 ) 
                              title = title.substring(title.indexOf('(UPI) --')+8,title.length);

                    if (title.length > 65) 
                        title = title.substring(0,64); // format title if necessary
                        title = title.trim(); // Trim Title
                    // Create shareable URL

                    googl.shorten(link).then(function (shortUrl) { 
                          if (sURL && title && link)
                                {
                                   var outPut = {};
                                   outPut.source = srce;
                                   outPut.title = title; 
                                   outPut.link = shortUrl;

                                   var rekord = new Article(outPut);
                                     rekord.save(function(err,doc)  { 
                                       if (err){
                                         console.log(err);
                                              }
                                      else {
                                         console.log(doc);
                                            }
                                                }); //Write 
                                            }
                                }).catch(function (err) {
                                    console.error(err.message);
                            }); //googl.shorten error message
                      }, function(error) {
                            throw error;
                  });// Scrape              
          }); // Request
} // skraper

skraper("Reuters","http://www.reuters.com/",true,".article-heading");
// skraper("UPI","http://www.upi.com/",false,".story");
// skraper("Deutsche Welle","http://www.dw.com/",true,".news");
skraper("Bloomberg","https://www.bloomberg.com/",true,".top-news-v3-story-headline");
skraper("Time","http://www.time.com/",true,".rail-article-title");

res.send("Scrape Complete");

});

// Read 
app.get("/articles", function(req, res) {
    Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

app.post("/articles/:id", function(req, res) {
  var newNote = new Note(req.body);

  newNote.save(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id }).exec(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });
    }
  });
});


// Listen on port 3000
app.listen(7000, function() {
  console.log("App running on port 7000!");
});