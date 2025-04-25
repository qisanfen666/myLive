import { User } from '../models/userModel'
import bcrypt from 'bcryptjs'

const userCreate = async (username:string,password:string,email:string)=>{
    const hashedPassword = await bcrypt.hash(password,10)
    const user = new User({
        username:username,
        password:hashedPassword,
        email:email     //省略了createAt字段,因为在schema中已经定义了默认值
    })
    return await user.save()    //save()方法是mongoose中保存数据的方法,相当于sql中的insert into
}

const userFind = async (username:string)=>{
    const user = await User.findOne({username:username})
    return user
}

export {
    userCreate,
    userFind,
}