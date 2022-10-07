const bcrypt=require('bcrypt')
const _ =require('lodash')
const axios=require('axios')
const otpGenerator = require ('otp-generator')



const {User}=require('../Model/userModel')
const {Otp}=require('../Model/otpModel')



module.exports.signUp=async(req,res)=>{
    const user = await User.findOne({
        number:req.body.number
    })
    if(user) return res.status(400).send("Already exist")
    const OTP = otpGenerator.generate(6,{
        digits:true,alphabets:false,upperCase:false,specialChars:false
    })
    const number=req.body.number
 
//add url of api here
    const otp = new Otp({number:number,otp:OTP})
    const salt = await bcrypt.genSalt(10)
    otp.otp=await bcrypt.hash(otp.otp,salt)
    const result=await otp.save()
    return res.status(200).send("otp send")
}
module.exports.verifyOtp=async(req,res)=>{
    const optHolder=await Otp.find({
        number:req.body.number
    })
    if(optHolder.length==0)return res.status(400).send("You used Expired OTP")
    const rightOtpFind=optHolder[optHolder.length -1]
    const validUser = await bcrypt.comapre(req.body.otp.rightOtpFind.otp)


    if(rightOtpFind.number==req.body.number && validUser){
        const user=new User(_.pick(req.body,["number"]))
        const token = user.generateJWT()
        const result=await user.save()
        const OTPDelete=await Otp.deleteMany({
            number:rightOtpFind.number
        })
        return res.status(200).send({
            message:"registered",
            token:token,
            data:result

        })
    }else{
        return res.status(400).send("Wrong OTP")
    }
}