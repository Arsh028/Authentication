const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
const ejs = require("ejs");

const app = express();

//using ejs templating
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true , useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});
const secret = "secret messege";
//add encrypt package as a plugin
userSchema.plugin(encrypt, { secret: secret , encryptedFields:["password"]});


const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",function(req,res){
    email_input = req.body.email;
    password_input = req.body.password;

    User.findOne({email : email_input},function(err,foundUser){
        if(err){console.log(err);}
        else{
            if(foundUser.password == password_input)
            {
                res.render("secrets");
            }
            else{console.log("fail");}
        }
    });

});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser = new User({
        email : req.body.email,
        password : req.body.password
    });

    newUser.save(function(err){
        if(err){console.log(err);}
        else{
            res.render("secrets");
        }
    });
});


app.listen(3000,function(){
    console.log("server running on port 3000");
});