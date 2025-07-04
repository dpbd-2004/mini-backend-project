const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owners-model");

if(process.env.NODE_ENV === "development"){
    router.post("/create", async function(req, res){
        let owners = await ownerModel.find();
        if(owners.length > 0)   return res.status(503).send("You don't have permission to create a new owner.");

        let {fullName, email, password} = req.body;
        let createdOwner = await ownerModel.create({
            fullName,
            email,
            password
        });
        res.status(201).send(createdOwner);
    });
}

router.get("/admin", function(req, res){
    let success = req.flash("success");
    res.render("createproducts", { success });
});


module.exports = router;