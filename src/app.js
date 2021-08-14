require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');
require('./db/conn');
const hbs = require('hbs');
const MyModel = require("./models/collection");
const cookieParser = require('cookie-parser');
const auth = require("../src/middleware/auth")


const port = process.env.PORT || 3100;




// const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../template/views");
const partials_path = path.join(__dirname, "../template/partials");


hbs.registerPartials(partials_path);


app.set("view engine", "hbs");
app.set("views", views_path);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(express.static(static_path))


app.get("/", (req, res) => {
    res.render("index")
})


app.get("/home", auth, (req,res)=>{
    res.render("loggedIn");
    console.log(`the cookie os secret page is ${req.cookies.jwt}`);
})



app.get("/signup", (req, res) => {
    res.render("signup")
})



app.post("/signup", async (req, res) => {
    try {
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const email = req.body.email;
        const number = req.body.number;
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;

        if (password === confirm_password) {
            const dataInsert = new MyModel({
                firstname: first_name,
                lastname: last_name,
                email: email,
                phone: number,
                password: password,
                confirmpassword: confirm_password,
            });

            // console.log("the data entered is : " + dataInsert);

            const token = await dataInsert.generateAuthToken();
            // console.log("the token part is : "+ token);

            res.cookie("jwt", token, {
                expires:new Date(Date.now() + 600000),
                httpOnly:true,
                // secure:true
            });
            // console.log(cookie);
            console.log("cookies done");


            const inserted = await dataInsert.save();
            if (inserted) {
                res.render("loggedIn")
                console.log(inserted);
            } else {
                res.send("something is wrong");
            }
        } else {
            res.send("password must be Same")
        }


    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
})





app.get("/login", (req, res) => {
    res.render("login")
})




app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const findDoc = await MyModel.findOne({email});

        const checkpassword = await bcrypt.compare(password, findDoc.password);
        console.log(checkpassword);

        const token = await findDoc.generateAuthToken();
        console.log("the token part is : "+ token);

        res.cookie("jwt", token, {
            expires:new Date(Date.now() + 600000),
            httpOnly:true
        });

        if(findDoc){
            if(checkpassword){
                res.render("loggedIn")
            }else{
                res.send("wrong Password")
            }
        }
        else{
            res.send("wrong Email")
        }

    } catch (error) {
        res.status(404).send(error)
    }
})




app.listen(port, () => {
    console.log(`listing on port ${port}`);
})