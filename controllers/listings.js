const Listing= require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

//search
module.exports.searchListing= async(req,res)=>{
    const searchedListings = await Listing.find(req.query);
    // // res.render("listings/index.ejs", {allListings});
    res.render("listings/search.ejs", {searchedListings});
    // console.log(searchedListings);
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
    const {id}=req.params;
    const listing= await Listing.findById(id)
    .populate({path: "reviews",
        populate: {
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async(req,res,next)=>{
    let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
    
    const url=req.file.path;
    const filename=req.file.filename;
    const newListng= new Listing(req.body.listing);
    newListng.owner= req.user._id;
    newListng.image= {url, filename}

    newListng.geometry=response.body.features[0].geometry;

    let savedLis=await newListng.save();
    console.log(savedLis);

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl= listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image= {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}= req.params;
    const deleted= await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};