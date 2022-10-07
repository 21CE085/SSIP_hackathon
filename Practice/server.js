require('dotenv/config')
const mongoose=require('mongoose')
const app=require('./app')




mongoose.connect(process.env.MONGOBD_URL_LOCAL,{
    useNewUrlParser:true,
    useUnifiledTopology:true,
    useCreateIndex: true
})
    .then(()=>console.log("DB-Connected"))



const port =process.env.PORT || 8080


app.listen(port,()=>{
    console.log("Server Started")
})