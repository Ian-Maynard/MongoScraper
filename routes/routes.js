const express = require("express");
// var query = require("../controllers/controller")
var cheerio = require("cheerio");
var request = require("request");
var Bitly = require('bitlyapi');
var bitly = new Bitly('fd0a57a9269bf1d523ec4bd38c18f0812c444f04'); // Shorten URL
var router = express.Router();


// console.log("\n***********************************\n" +
//             "Grabbing every thread name and link\n" +
//             "from Reuters" +
//             "\n***********************************\n");

// rURL = "http://www.reuters.com/";

// request(rURL, function(error, response, html) {
//   var $ = cheerio.load(html);
//   var reuters = [];
//   $(".article-heading").each(function(i, element) {
//     var title = $(this).children("a").text();
//     var link = $(this).children("a").attr("href");

//  bitly.shorten(rURL+link).then( function(response) {
//                   link = response.data.url;
//                   console.log('Link is : '+link+"  Title: "+title);
//                   reuters.push({
//                     title: title,
//                     link: link
//                   });
//                 }, function(error) {
//                    throw error;
//                     });
//   });
// });

// console.log("\n***********************************\n" +
//             "Grabbing every thread name and link\n" +
//             "from UPI" +
//             "\n***********************************\n");



// uURL = "http://www.upi.com/";
// request(uURL, function(error, response, html) {
//   var $ = cheerio.load(html);
//   var upi = [];
//   $(".story").each(function(i, element) {

//     var title = $(this).children("a").text().trim();
//     var link = $(this).children("a").attr("href");

//      bitly.shorten(link).then( function(response) {
//                     link = response.data.url;
//                     console.log('Link is : '+link+"  Title: "+title);
//                         upi.push({
//                         title: title,
//                         link: link
//                         });

//                         }, function(error) {
//                         throw error;
//                             });
//                  });         
//     });


// console.log("\n***********************************\n" +
//             "Grabbing every thread name and link\n" +
//             "from the DW" +
//             "\n***********************************\n");

// apURL = "http://www.dw.com";
// var apw = [];
// request (apURL, function(error, response, html) { 
//   var $ = cheerio.load(html);
//   $(".news").each(function(i, element) 
//    {
//     var link = apURL + $(this).children("a").attr("href");
//     var title = $(this).children("a").text().trim(); // Scrape the title from the DOM
//         bitly.shorten(link).then( function(response) {
//                   link = response.data.url;
//                   console.log('Link is : '+link+"  Title: "+title);
//                   apw.push({
//                     title: title,
//                     link: link
//                   });
//                 }, function(error) {
//                    throw error;
//                     });
//                   }); 
// }); //Request


// bnURL = "https://bloomberg.com";
// var bnw = [];

// request (bnURL, function(error, response, html) { 
//   var $ = cheerio.load(html);
//   $(".top-news-v3-story-headline").each(function(i, element)  {
//     var link = bnURL + $(this).children("a").attr("href");
//     var title = $(this).children("a").text().trim(); // Scrape the title from the DOM

//         bitly.shorten(link).then( function(response) {
//                   link = response.data.url;
//                   console.log('Link is : '+link+"  Title: "+title);
//                   bnw.push({
//                     title: title,
//                     link: link
//                   });
//                 }, 
//                 function(error) {
//                    throw error;
//                 });
//   })
// });

// timeURL = "https://time.com";
// var time = [];
// request (timeURL, function(error, response, html) { 
//   var $ = cheerio.load(html);
//   $(".rail-article-title").each(function(i, element)  {
//     var link = $(this).children("a").attr("href");
//     var title = $(this).children("a").text().trim(); // Scrape the title from the DOM
//         bitly.shorten(link).then(function(response) { 
//                   link = response.data.url;
//                   console.log('Link is : '+link+"  Title: "+title);
//                   time.push({
//                     title: title,
//                     link: link
//                   });
//                 }, 
//                 function(error) {
//                    throw error;
//                 });
//   })
// });




module.exports = router;