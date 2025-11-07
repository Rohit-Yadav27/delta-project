const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const usercontroller = require("../controllers/users.js");

//router.route me eshme jishka jishka path(means (like - "/login")) same hota hai usko sk sath likh lete hai (get ,post ,delete etc)

router
   .route("/signup")
   .get(usercontroller.renderSignupFrom)
   .post(wrapAsync(usercontroller.signup)
);

router
    .route("/login")
    .get(usercontroller.renderLoginForm)
    .post( 
    saveRedirectUrl,
    passport.authenticate("local",{ //passport was a middleware jo authenticate she phle use hota hai to authenticate and checking all the thing user allready login or not or password was correct or not 
        failureRedirect: "/Login" ,
        failureFlash:true
    }),
    usercontroller.login
);

router.get("/logout",usercontroller.logout);
//req.logout ye passport ka method jo use hota hai loggout krne keliye
//ye use krega seriallised and diserailised method ko use krega or delte kar dega session she(currec she jo chaal rha hai)
//re.logout ye apne app me callback leta hai 
//callback khne ka ptlab hai ki jb logout ho jaye ushke turnt bad kya kam hona chahiye
//ye ak parameter hai jike ander (err)likhte hai agar err aaya to eshme aake store ho jaye ga nahi to empty rhe ga
module.exports = router;