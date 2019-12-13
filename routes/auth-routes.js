const router = require("express").Router();
const passport = require("passport");

// auth login

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// auth logout
router.get("/logout", (req, res) => {
  // handle with passport
  // res.send("logging out");
  req.logOut();
  res.redirect("/");
});

// auth with google
// step 1
// router.get("/google", (req, res) => {
//   // handle with passport
//   res.send("logging in with google");
// });

// step 2
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

// callback route for google to redirect to
router.get(
  "/google/redirect",
  // uses the code in the URI to get the user's profile info
  passport.authenticate("google"),
  (req, res) => {
    // passport allows you to grab the user on the req
    // res.send(req.user);
    res.redirect("/profile");
  }
);

module.exports = router;
