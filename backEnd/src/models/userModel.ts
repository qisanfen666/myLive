import mongoose from 'mongoose'

//schema是mongoose中定义数据模型的方式
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const User = mongoose.model('User',userSchema)

export {
    User,
}



