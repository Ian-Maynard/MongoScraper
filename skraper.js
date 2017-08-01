var cheerio = require("cheerio");
var request = require("request");
var Step = require("step");
var Bitly = require('bitlyapi');
var bitly = new Bitly('fd0a57a9269bf1d523ec4bd38c18f0812c444f04');

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
                // console.log(link);
                // format the Title

                    title = title.replace(/\t|\n/g, "");  // strip out certain characters
                      if (urlSwitch) 
                        link = sURL + link; // If URL root is required.

                      if (title.indexOf('(UPI) --') > -1 ) 
                        title = title.substring(title.indexOf('(UPI) --')+8,title.length);

                      if (title.length > 50) 
                        title = title.substring(0,49); // format title if necessary
                  
                    title = title.trim(); // Trim Title
                    

                    bitly.shorten(link).then(function(response) { 
                      var outPut = {}; // init  data structure
                      output.title = title;
                      output.link = response.data.url;
                      var rekord = new Article(output);
                      console.log('Link is : '+link+"  Title: "+title);

                            rekord.save(function(err,doc){
                                  if(err){
                                      console.log(err);
                                  }
                                  else {
                                    console.log(doc);
                                  }
                              }); 
                            }, 
                            function(error) {
                            throw error;
                        }); // Shorten the URL to facillitate sharing
              });// Scrape 
    }); // Request
    return outPut;
} // skraper

// rURL = "http://www.reuters.com/";  -  ".article-heading" - 
// uURL = "http://www.upi.com/"; - ".story"
// apURL = "http://www.dw.com"; - ".news"
// bnURL = "https://bloomberg.com"; - .top-news-v3-story-headline
// timeURL = "https://time.com"; - .rail-article-title

nooz=[];
nooz = skraper("http://www.reuters.com/",true,".article-heading");
nooz = skraper("http://www.upi.com/",false,".story");
nooz = skraper("http://www.dw.com/",true,".news");
nooz = skraper("https://www.bloomberg.com/",true,".top-news-v3-story-headline");
nooz = skraper("http://www.time.com/",true,".rail-article-title");

