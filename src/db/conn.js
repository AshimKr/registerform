const mongoose = require('mongoose');

const db = "mongodb+srv://ashim:ashimkumar@cluster0.do6aw.mongodb.net/registration?retryWrites=true&w=majority"

mongoose.connect(db,{
    useCreateIndex:true,
    useNewUrlParser: true,
    useUnifiedTopology: true
    
}).then(console.log("Database Connection Is Successful"))
.catch((e)=>{
    console.log(`connection is not successful ${e}`);
})