import userModel from "../model/userModel.js";
console.log("working importing");


export const registerController =  async(req,res)=>{
try {
    const {name,email,password,role} = req.body;


    if(!name || !email || !password){
        res.status(400).send({message:"please field required fields",success:false})
    }

    const existingUser = await userModel.findOne({email})
    if(existingUser){
        res.status(409).send({message:"this email is already registered you can login",success:false})
    }

    const user = await userModel.create({name,password,email,role})

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
    res.status(400).send({message:"enter correct password",success:false})
}

const token = findEmail.createJWT()
findEmail.password = undefined

res.status(200).send({message:"login successfully",success:true,user:findEmail,token})


    } catch (error) {
        console.log(error);
        res.status(500).send({message:"login api not working",success:false})
        
        
    }
}




export const updateUserController = async(req,res)=>{
    try {
        const {name, email, location, lastname, role, bio, skills, resumeLink, companyName, companyDescription} = req.body;

        if(!name || !email){
            return res.status(400).send({message:"name and email are required fields "})
        }

        const user = await userModel.findOne({_id:req.user.userId})
        user.name = name;
        user.lastname = lastname || user.lastname;
        user.location = location || user.location;
        user.email = email;
        
        if (role) user.role = role;
        if (bio !== undefined) user.bio = bio;
        if (skills) user.skills = skills;
        if (resumeLink !== undefined) user.resumeLink = resumeLink;
        if (companyName !== undefined) user.companyName = companyName;
        if (companyDescription !== undefined) user.companyDescription = companyDescription;

        await user.save()
        const token = user.createJWT()

        res.status(200).send({message:"updated successfully",user,token})

    } catch (error) {
        console.log(error);
        res.status(400).send({message:"update api not working"})
    }
  }

export const saveJobController = async(req, res) => {
    try {
        const { jobId } = req.body;
        const user = await userModel.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }

        if (user.savedJobs.includes(jobId)) {
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
        } else {
            user.savedJobs.push(jobId);
        }

        await user.save();
        res.status(200).send({message: "Saved jobs updated successfully", savedJobs: user.savedJobs});
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Error updating saved jobs"});
    }
}

export const getSavedJobsController = async(req, res) => {
    try {
        const user = await userModel.findById(req.user.userId).populate('savedJobs');
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }
        res.status(200).send({success: true, savedJobs: user.savedJobs});
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Error fetching saved jobs"});
    }
}