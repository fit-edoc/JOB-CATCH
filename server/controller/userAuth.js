import userModel from "../model/userModel.js";
console.log("working importing");


export const registerController =  async(req,res)=>{
try {
    const {name,email,password} = req.body;


    if(!name || !email || !password){
        res.status(400).send({message:"please field reuired fields",success:false})
    }

    const existingUser = await userModel.findOne({email})
    if(existingUser){
        res.status(409).send({message:"this email is already registered you can login",success:false})
    }

    const user = await userModel.create({name,password,email})

    const token  = user.createJWT()

    res.status(201).send({
        success:true,
        message:"registered successfully",
        user:user,
        location:user.location,
        lastname:user.lastname,
        token,
    })
    
} catch (error) {
    console.log(error);
    res.status(500).send({message:"registered api not working",success:true})
    
    
}

}


export const loginController = async(req,res)=>{
    try {
        
const {email,password}= req.body

if(!email || !password){
    res.status(400).send({message:"required both fields should be enter",success:false})
}

const findEmail = await userModel.findOne({email}).select("+password")

if(!findEmail){
    res.status(409).send({message:"user is not registered"})
}

const isMatch = await findEmail.comparePassword(password)
if(!isMatch){
    res.status(400).send({message:"username and password is not match",success:false})
}

const token = findEmail.createJWT()
findEmail.password = undefined

res.status(200).send({message:"login successfully",success:true,token})


    } catch (error) {
        console.log(error);
        res.status(500).send({message:"login api not working",success:false})
        
        
    }
}




export const updateUserController = async(req,res)=>{


    try {
        const {name,email,location,lastname} = req.body;

        if(!name || !email  || !location || !lastname){
            res.status(400).send({message:"all field required "})
        }

        const user = await userModel.findOne({_id:req.user.userId})
        user.name = name
        user.lastname = lastname
        user.location = location
        user.email = email

        await user.save()
        const token = user.createJWT()

        res.status(200).send({message:"update successfuly",user,token})

    } catch (error) {
      res.status(400).send({message:"update api not working"})
    }
  }