import mongoose from 'mongoose';
 
// console.log("Reached till the urlEntry page!")

var urlEntrySchema = mongoose.Schema({
  original: String,
  shortCode: { type: Number, index: true }
});
urlEntrySchema.index({ shortCode: 1 });
urlEntrySchema.set('autoIndex', false);
 
export var UrlEntry = mongoose.model('UrlEntry', urlEntrySchema);