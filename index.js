import express from "express";
import path from "path";  // path use hota h html file ko render krane m
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"

//Connecting MongoDb
mongoose
    .connect("mongodb://localhost:27017",{
    dbName:"backend",
})
    .then(()=> console.log("Mongodb is connected now..."))
    .catch((e)=> console.log(e));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});
const User = mongoose.model("User",userSchema);


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

// Authentication ----
const isAuthenticated = async(req,res,next)=>{
    const {token} = req.cookies;

    console.log(req.cookies)
    if (token){
        const decoded = jwt.verify(token, "aaaaa");
        console.log(decoded);
        req.user = await User.findById(decoded._id);
        next();
    }
    else{  
        res.render("login");
    }

};
    app.get("/", isAuthenticated,(req,res)=>{  //is func k run krne se phle isAuthentication func chalega
        console.log(req.user);
        res.render("logout", { name: req.user.name});
       
        // console.log(req.cookies);
        // console.log(req.cookies.token);
        // const {token} = req.cookies;

    });
    app.get("/register",(req,res)=>{
        res.render("register")
    })
    app.get('/login',(req,res)=>{
        res.render("login")
    })


    app.get("/", (req,res) =>{
        res.render("login.ejs");                    // dont need extention mean index.ejs
    })


    // post requests ------

    app.post("/login",async(req,res)=>{
        const {email,password} = req.body;             // form m fields hmne bhre h unhe get kr rha h
        let user = await User.findOne({ email });
        if (!user) return res.redirect("/register")

        const isMatch = user.password===password       // db se password match kr rha h jo form m dale h
        if (!isMatch) return res.render('login',{email,message: "Incorrect Password"});

        const token = jwt.sign({ _id:user._id}, "aaaaa");
        res.cookie("token",token,{                     // set cookies
            httpOnly:true,expires:new Date(Date.now()+60*1000)
        });
        res.redirect("/");
    })

    app.post("/register",async(req,res)=>{
        const {name,email,password} = req.body;

        let user = await User.findOne({email});
        if (user) {
            return res.redirect("/login")
        }
          user = await User.create({
            name,
            email,
            password,
        })

        const token = jwt.sign({ _id:user._id}, "aaaaa");
        // console.log(token);

        res.cookie("token",token,{          // set cookies
            httpOnly:true,expires:new Date(Date.now()+60*1000)
        });
        res.redirect("/");
    });

    app.get("/logout", (req,res)=>{
        res.cookie("token", null, {
            httpOnly:true,
            expires: new Date(Date.now()),
        });
        console.log("Logout: token expires")
        res.redirect("/")
    })


    // app.get("/add", (req,res)=>{
    // msg.create({ name:"Pranjal", email: "sample@gmail.com"}).then(()=>{

    //     res.send("well done")
    // })


// app.get("/success", (req,res)=>{
//     res.render("success");
// })

// app.post("/contact", async(req,res) =>{
//     // const userData=({username: req.body.name, email: req.body.email});
//     const {name,email} = req.body;
//     await msg.create({name,email})

    // res.render("success");  // render se success wali file chl jaygi
//     res.redirect("/success"); 
// })

// app.get("/users",(req,res)=>{
//     res.json({
//         users,
//     });
// });

// const server = express();
app.listen(5000,()=>{
    console.log("server is working on index.....")
})