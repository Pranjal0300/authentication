import express from "express";
import path from "path";  // path use hota h html file ko render krane m
import mongoose from "mongoose";

mongoose
    .connect("mongodb://localhost:27017",{
    dbName:"backend",
})
    .then(()=> console.log("Mongodb is connected now..."))
    .catch((e)=> console.log(e));

const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
});
const msg = mongoose.model("Message",messageSchema);


    const app = express();
    // app.get("/products",(req,res)=>{             // for render html file.....
    //     const pathlocation = path.resolve();
    //     res.sendFile(path.join(pathlocation,"./index.html"));
    // });    
    
    app.use(express.static(path.join(path.resolve(),"public")) ) // loading static folder
    // console.log(path.join(path.resolve(),"public"))
    app.use(express.urlencoded({extended:true }));
    
    // setting up view engine
    app.set("view engine", "ejs");
    app.get("/", (req,res) =>{
        res.render("index.ejs", {name: "Abhishek"});   // dont need extention mean index.ejs
    })
    app.get("/add", (req,res)=>{
    msg.create({ name:"Pranjal", email: "sample@gmail.com"}).then(()=>{

        res.send("well done")
    })

})
app.get("/success", (req,res)=>{
    res.render("success");
})

app.post("/contact", async(req,res) =>{
    // const userData=({username: req.body.name, email: req.body.email});
    const {name,email} = req.body;
    await msg.create({name,email})
    // res.render("success");  // render se success wali file chl jaygi
    res.redirect("/success"); 
})

app.get("/users",(req,res)=>{
    res.json({
        users,
    });
});

// const server = express();
app.listen(5000,()=>{
    console.log("server is working on index.....")
})