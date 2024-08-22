const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); 

const listingSchema = new Schema ({
  title: {
    type: String,
    required: true
  },

  description: String,
  image: {
    type: String,
    default: 
    "https://a0.muscache.com/im/pictures/miso/Hosting-53371625/original/b230521e-d33c-4c5e-a2ba-d1d5277ade92.jpeg?im_w=720",
    set: (v) => v === ""
    ? "https://a0.muscache.com/im/pictures/miso/Hosting-53371625/original/b230521e-d33c-4c5e-a2ba-d1d5277ade92.jpeg?im_w=720": v
  }, 
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
    type: Schema.Types.ObjectId,
    ref: "Review"
    }
],
owner: {
  type: Schema.Types.ObjectId,
  ref: "User",
}
});
listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing) {
     await Review.deleteMany({ _id: {$in: listing.reviews }})
  }  
 
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;