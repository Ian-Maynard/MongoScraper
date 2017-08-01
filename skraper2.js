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
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public")); //Static Directory
// Mongoose config and init
mongoose.connect("mongodb://localhost/scraperdat2"); // Mongod connection
var db = mongoose.connection;
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
}); 
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Routes

function skraper(sURL,urlSwitch,skrapeParm) {
  // urlSwitch (boolean) is for URL scrapes that require their base url as a prefix 
  // skrapeParm the scrape search term 

    console.log("\n***********************************\n" +
                "Scraping top stories from " +sURL+"."+
                "\n***********************************\n");

    request (sURL, function(error, response, html) { 

      var $ = cheerio.load(html);
              $(skrapeParm).each(function(i, element)  {
                var link = $(this).children("a").attr("href");
                var title = $(this).children("a").text().trim(); // Scrape the title from the DOM
                    console.log(link);

                // format the Title
                    title = title.replace(/\t|\n/g, "");  // strip out certain characters
                      if (urlSwitch) 
                        link = sURL + link; // If URL root is required.

                      if (title.indexOf('(UPI) --') > -1 ) 
                        title = title.substring(title.indexOf('(UPI) --')+8,title.length);

                      if (title.length > 50) 
                        title = title.substring(0,49); // format title if necessary
                  
                    title = title.trim(); // Trim Title
                    googl.shorten(link).then(function (shortUrl) { 
                                console.log(sURL+" - "+title+" - "+shortUrl);
                                
                                 // init 
                                if (sURL && title && link)
                                    {
                                            var outPut = {};
                                            outPut.source = sURL;
                                            outPut.title = title; 
                                            outPut.link = shortUrl;
                                            var rekord = new Article(outPut);
                                    
                                            rekord.save(function(err,doc)  {

                                                if(err){
                                                    console.log(err);
                                                }
                                                else {
                                                    console.log(doc);
                                            }
                                        });
                                    }
                                        ;}).catch(function (err) {
                            console.error(err.message);
                            }); //googl.shorten error message
                            }, 
                            function(error) {
                            throw error;
              });// Scrape 
    }); // Request

} // skraper

skraper("http://www.reuters.com/",true,".article-heading");
skraper("http://www.upi.com/",false,".story");
skraper("http://www.dw.com/",true,".news");
skraper("https://www.bloomberg.com/",true,".top-news-v3-story-headline");
skraper("http://www.time.com/",true,".rail-article-title");

