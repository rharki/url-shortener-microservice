import express from 'express';
import mongoose from 'mongoose';

import { UrlEntry } from './urlEntry';
import { isValidUrl, createFullUrl } from './extfunc';
import { getShortCode, isDuplicate, insertNew } from './mongo-utils';

export const app = express(); // We export app so index.js can make use of it
 
// mongoose.Promise = global.Promise;
mongoose.connect('mongodb://rharki:rharki123@ds127783.mlab.com:27783/urlshortnerservice');


app.get('/:shortCode', (req, res) => {
  // console.log("deciphering the shortcode now!")
  let shortCode = parseInt(req.params.shortCode); // We parse the input code
  if (isNaN(shortCode)) { // It's not a number :(
    // console.log("Shortcode has to be a number!")
    res.status(500).json({ error: 'Invalid URL shortCode. It must be a number.' })
  } else {
    // console.log("I never thought this will work!")
    UrlEntry.findOne({ shortCode }).then(doc => {
      if (!doc) { // It does not exist as there is no result
        res.status(404).json({ error: 'There is no URL saved with this shortcode entered!' });
      } else { // It exists, we use redirect on the response with the original URL as argument
        // console.log("Almost close to redirection now! " + doc.original)
        res.redirect(doc.original);
      }
    });
  }
});


app.get('/new/*', (req, res) => {
  var passedURL = req.params[0];
  console.log(passedURL);
  if (isValidUrl(passedURL)) {
    isDuplicate(passedURL).then(exists => {
      if (exists) {
        // console.log("URL was SRK - duplicate");
        res.status(500).json({
          error: 'URL already exists in the database.',
          shortCode: exists
        })
      } else {
        // console.log("URL found to NOT be a duplicate, now processing it!");
        // If it's not a duplicate, we insert a new document here.
        insertNew(passedURL).then(insertedDocument => {  // save() gives us the inserted document to use
          if (!insertedDocument) {
            // console.log("Some error in inserting the new URL in the database!");
            res.status(500).json({ error: 'Unknown error' }); // Something failed for some reason.
          } else {
            // console.log("Everything successfully done, not processing the result!");
            // res.status(200).send(`URL successfully shortened: http://www.example.com/${insertedDocument.shortCode}`); // We return the shortened URL
            res.status(200).json({message : 'Url successfully shortened', url : createFullUrl(req, insertedDocument.shortCode)}); // We return the shortened URL
          }
        })
      }
    })
  } else {
  	res.status(500).json({error : 'Invalid URL. Please have some basic courtesy!'});
  }
});

app.get("/hello/:who", function(req, res) {
  res.end("Hello, " + req.params.who + ".");
  // Fun fact: this has security issues
});

app.get("/", function(req, res) {
  res.end("Sorry, but have to show you the much dreaded error 404!");
  // Fun fact: this has security issues
});