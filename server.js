const express = require("express");
const app = express();
const posts = require("./routes/post.js");
const users = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("veiw engi ne", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysuperseceretstring",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash("success");
  res.locals.errors = req.flash("error");
  next();
});

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;

  if(name === "anonymous") {
    req.flash("error", "user not registered");
  }else{
     req.flash("success", "user successfully registerd");
  }
 req.session.name = name;
 res.redirect("/hello");
});

app.get("/hello", (req, res) => {

  res.render("page.ejs", { name: req.session.name });
});

// app.get("/recount", (req, res) => {
//   if(req.session.count) {
// nod    req.session.count++;
//   }else{
//     req.session.count = 1;
//   }
//   res.send(`You sent a request: ${req.session.count} times`);
// });

// app.get("/test", (req, res) => {
//       res.send("Successfully session run");
// });

// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req, res) => {
//   res.cookie("made-in", "India", {signed: true});
//   res.send("signed cookie sent");
// });

// app.get("/verify", (req, res) => {
//   console.log(req.signedCookies);
//   res.send("Cookie verified");
// })

// app.get("/getcookie", (req, res) => { 
//   res.cookie("greet", "manager");
//   res.cookie("madeIn", "India");
//   res.send("sent you some cookies!");
// });

// app.get("/greet", (req, res) => {
//   let { name = "anonynous" } = req.cookies;
//   res.send(`Hi, ${name}`) 
// })

// app.get("/", (req, res) => {
//   console.dir(req.cookies);
//   res.send("Hi, I am root!");
// });


app.use("/posts", posts);
app.use("/users", users);

app.listen(3000, () => {

  console.log("Server is listing to 3000")
});