const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const data = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:3001/todolistDB",{ useUnifiedTopology: true ,useNewUrlParser: true});

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item",itemSchema);

const listSchema = {
    name: String,
    item: [itemSchema]
};

const List = mongoose.model("List",listSchema);

//var items = ["Buy food", "make food", "eat food"];
//var workItems = [];

const item1 = new Item({
    name: "Welcome to your Todo list!"
});

const item2 = new Item({
    name: "Hit the + button to add a new Item!"
});

const item3 = new Item({
    name: "<-- click here to delete an item"
});

const defaultItems = [item1,item2,item3];


app.get("/",function(req,res){

    Item.find({},function(err,itemsList){
        if(itemsList.length === 0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully saved default items to DB");
                }
            });
            res.redirect("/");
        }
        else{
            res.render("list",{listTitle:"Today",newListItems:itemsList});
        }
    })
    //let day = data.getDate();

});

app.post("/",function(req,res){

    const itemName = req.body.newItem;
    const listName = req.body.list;
    const newItem = new Item({
        name: itemName
    });
    if(listName === "Today"){
        
        newItem.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listName},function(err,foundList){
            if(!err){
                foundList.item.push(newItem);
                foundList.save();
                res.redirect("/"+listName);
            }
        });
    }
});

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    console.log(req.body);
    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("Item successfully removed");
                res.redirect("/");
            }
        });
    }
    else{
       List.findOneAndUpdate({name: listName},{$pull: {item: {_id: checkedItemId}}},function(err,foundList){
           if(!err){
               res.redirect("/"+listName);
           }
       });
    }
    
});

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name: customListName,
                    item: defaultItems
                });
                list.save();
                res.redirect("/"+customListName);
            }
            else{
                res.render("list",{listTitle:customListName,newListItems:foundList.item});
            }
        }
    });
});


app.listen(3000,function(){
    console.log("server started on port 3000");
});