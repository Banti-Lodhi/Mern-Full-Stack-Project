if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}
// console.log(process.env.SECERET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const Localstartegy = require("passport-local");
const User = require("./module/user.js");

const listingRouter = require("./routes/listing.js"); 
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

let mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main().then( () => {
  console.log("Connected to db");
})
.catch( (err)=> {
  console.log(err);
});

async function main() {
  await mongoose.connect(mongo_url);
}

app.set("veiw engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const expressOptions = ({
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
});

app.get("/", (req, res) => {
  res.send("Hi, I serve on Browser");
});

app.use(session(expressOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstartegy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/userdemo", async(req, res) => {
//   let fakeUser = new User({
//     email:"Preetam36465@gmail.com", 
//     username: "Preetam-student"
//   });

//   let std_pwd =  await User.register(fakeUser, "psm@111");
//   console.log("Successful password created");
//   res.send(std_pwd);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  let {statusCode = 500, message = "Somthing went wrong"} = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});



app.listen(8080, () => {
   console.log("Server is listing to port 8080");
});