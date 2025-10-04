import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    name: { required: ["Name is required", true], type: String },
    lastname: { type: String },
    email: {
      required: ["Name is required", true],
      type: String,
      unique: true,
      validator: validator.isEmail,
    },
    password: {
      required: ["password length is greator than 6", true],
      type: String,
      minlength: [6],
      select: true,
    },
    location: { type: String, default: "India" },
  },
  { timestamps: true }
);
 // for encrypting the password which comes from client side
userSchema.pre("save", async function () {
    if (!this.isModified) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  

  userSchema.methods.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword,this.password)
    return isMatch;
  }


  userSchema.methods.createJWT =  function(){
    return  jwt.sign({userId :this._id} , process.env.JWT_SECERET,{
        expiresIn:"1d"
    })

  }

  export default mongoose.model("User",userSchema)