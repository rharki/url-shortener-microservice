import { UrlEntry } from './urlEntry';

// this function returns the next shortcode to be assigned to a new URL
export function getShortCode() {
  // console.log("getShortCode function has been called.");
  return UrlEntry
    .find()
    .sort({ shortCode: -1 })
    .limit(1)
    .select({ _id: 0, shortCode: 1 })
    .then(docs => {
      return docs.length === 1 ? docs[0].shortCode + 1 : 0;
    });
}
 
export function isDuplicate(url) {
  return UrlEntry
    .findOne({ original: url})
    .then(doc => doc ? doc.shortCode : false );
}
 
// this function inserts the new url in the database, calls getshortcode function first, and then inserts.
export function insertNew(url) {
  // console.log("insertNew function has been called.");
  return getShortCode().then(newCode => {
    let newUrl = new UrlEntry({ original: url, shortCode: newCode });
    return newUrl.save();
  });
}