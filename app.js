const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine','ejs');

app.get("/",function(req,res){

    var today = new Date();
    var day = today.getDay();
    res.render("list",{today:day});
});

app.listen(3000,function(){
    console.log("server started on port 3000");
});