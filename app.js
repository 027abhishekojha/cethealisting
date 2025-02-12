const express = require("express");
const app = express();
const port = 8080;

const mongoose = require("mongoose");
const Listing = require("./model/listing");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const methodOverride = require('method-override')

const path =  require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))



//Db Configuration
main().then(() => {
    console.log("Database connection established!!!")
}).catch((err) => {
    console.log("Some error caught in database")
});


async function main() {
    await mongoose.connect(MONGO_URL);
}


//APIs
app.get("/listings/new", (req, res) => {
    // res.send("working well");
    res.render("listings/new.ejs");
})

app.post("/listings", async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save().then(res=>{
        console.log("New Data Inserted to DB")}).catch("Some Error Occur");
    res.redirect("/listings");
});

//show route
app.get("/listings/:id", async (req, res) =>{
    try{
        let {id} = req.params;
        let listing = await Listing.findById(id);
        // console.log(listing[0][1]);
        res.render("listings/show.ejs", {listing});
    }catch (err){
        console.log("Some Error occur");
    }
});


// listing all route
app.get("/listings", async (req, res) =>{
    try{
       let allListing =  await Listing.find({});
        // console.log(allListing);
        // res.send("Data Captured Successfully", {allListing});
        res.render("listings/index.ejs", {allListing});
    }catch (err) {
        console.log(err);
    }
});


//testing route
app.get("/testlisting", async (req, res) => {
    let sampleListing = new Listing({
        title: "The Royal Palm",
        description: "Famous for it West Oceanic nature view",
        price: 1500,
        location: "Goregaon Mumbai",
        country: "India"
    });
    await sampleListing.save();
    console.log("Sample Data Inserted to DB");
    res.send("Sample Data Inserted to DB");
});


//edit route

app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing})
});

//update route
// app.put("/listings/:id", async (req, res) =>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect("/listings");
// });

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // res.send("Data Updated Successfully");
    res.redirect("/listings");
});

//destroy route
app.delete("/listings/:id", async (req, res) => {
   let {id} = req.params;
   await Listing.findByIdAndDelete(id);
   // res.send("Post deleted Successfully");
    res.redirect("/listings");
});

app.listen(port, () => {
    try {
        console.log(`App is listening on port ${port}`);
    } catch (err) {
        console.log("Some error occur");
    }

});

app.get("/", (req, res) => {
    try {
        res.send("Server is working Properly");
    } catch (err) {
        console.log(err)
    }
});
