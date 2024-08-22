const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing1 = require("../module/listing.js");

let mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then( () => {
  console.log("Connected to db");
})
.catch( (err)=> {
  console.log(err);
});

async function main() {
  await mongoose.connect(mongo_url);
}

const initDb = async () => {
   await Listing1.deleteMany({});
   initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "665b10d140fedfc39dff2604"
   }));
   await Listing1.insertMany(initData.data);
   console.log("Data was initilized");
}

initDb();