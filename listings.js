const Listing = require("../module/listing.js");
module.exports.index =
  async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
  }

module.exports.buildListing = (req, res) => {
  res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
  if(!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
  }

module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listings creating!");
  res.redirect("/listings");
 }  

module.exports.editLiting = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  req.flash("success", "Edited Listing!");
  res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
  let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Updated listing!");
    res.redirect(`/listings/${id}`)
  }

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deleteroute = await Listing.findByIdAndDelete(id);
  console.log(deleteroute);
  req.flash("success", "Deleted Listing!");
  res.redirect("/listings");
}