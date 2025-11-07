if(process.env.NODE_ENV != "production"){
    require("dotenv").config(); //dotenv are used to process to env file or run in app.js me lane ke liye
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport"); //req.user(ye aek property hai) ke ander user ki info passport store krta hai
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRoute = require("./routes/listing.js")
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,//session ke ander koi update nahi hu to 24hr ke bad update kare(second me pass hota hai)
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie: {
        express: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: + 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// app.get("/",(req,res) => {
//     res.send("Hi, I am root");
// });

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //req.user(ye aek property hai) ke ander user ki info passport store krta hai
    next();
});

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/",userRoute);

// app.get("/register",async(req,res) => {
//     let fakeuser = new User ({
//         email: "student@gmail.com",
//         username : "delta-student",
//     });
//     let newUser = await User.register(fakeuser,"helloworld");
//     res.send(newUser)    
// })


app.use ((req,res,next) => {
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err , req , res, next) => {
    let {statusCode=500,message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});