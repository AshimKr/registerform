require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const formSchema = mongoose.Schema({
    firstname:{
        type:String,
        required: true,
    },
    lastname:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        unique:true,
        required: true,
    },
    phone:{
        type:Number,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


formSchema.methods.generateAuthToken = async function(){
    try {
        // console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part " + error);
        console.log("the error part " + error);
    }
}

formSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(`password is : ${this.password}`);
    }
})

// creating collection
const MyModel = mongoose.model("FormData", formSchema);

module.exports = MyModel;