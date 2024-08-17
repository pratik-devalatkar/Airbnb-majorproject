const mongoose= require("mongoose");
const initData= require("./data.js");
const Listing= require("../models/listing.js");

let mongo_url= "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(mongo_url);
}

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner:"66966dcbaaa74483ba97c8e6"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}
initDB();