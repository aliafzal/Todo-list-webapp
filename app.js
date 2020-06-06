const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const data = require(__dirname + "/date.js");

var items = ["Buy food", "make food", "eat food"];
var workItems = [];
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static("public"));


app.get("/",function(req,res){

    let day = data.getDate();
    res.render("list",{listTitle:day,newListItems:items});

});

app.post("/",function(req,res){

    var item = req.body.newItem;
    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work")
    }
    else{
        items.push(item);
        res.redirect("/");
    }
});


app.get("/work",function(req,res){

    res.render("list",{listTitle:"Work List",newListItems:workItems});

});

app.post("/work",function(req,res){
    var item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});


app.listen(3000,function(){
    console.log("server started on port 3000");
});