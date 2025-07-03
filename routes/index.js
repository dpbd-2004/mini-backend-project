const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { logout } = require("../controllers/authController")
const router = express.Router();

const userModel = require("../models/user-model");
const productModel = require("../models/product-model");

router.get("/", function(req, res){
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });
});

router.get("/shop", isLoggedIn, async function(req, res){
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, success });
})

router.get("/cart", isLoggedIn, async function(req, res){
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");

  let bill = 0;
  user.cart.forEach(product => {
    bill += product.price + 20 - product.discount;
  });

  res.render("cart", { user, bill });
});


router.get("/addtocart/:productId", isLoggedIn, async function(req, res){
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productId);
  await user.save();
  req.flash("success", "Added to cart");
  res.redirect("/shop");
});


router.get("/logout", isLoggedIn, logout);

module.exports = router