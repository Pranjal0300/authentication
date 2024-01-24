import express from "express";
import path from "path";  // path use hota h html file ko render krane m
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

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

// Middlewares----
    app.use(express.static(path.join(path.resolve(),"public")) ) // loading static folder
    // console.log(path.join(path.resolve(),"public"))
    app.use(express.urlencoded({extended:true }));
    app.use(cookieParser())

// setting up view engine
    app.set("view engine", "ejs");

// Authentication----
    app.get("/",(req,res)=>{
        console.log(req.cookies);
        res.render("login");
    });

    app.get("/", (req,res) =>{
        res.render("login.ejs");   // dont need extention mean index.ejs
    })
    app.post("/login",(req,res)=>{
        res.cookie("token","this_is_token",{
            httpOnly:true,expires:new Date(Date.now()+60*1000)
        });
        res.redirect("/");
    });
    

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