import jobModel from "../model/jobModel.js";





export const createJobcontroller = async(req,res)=>{

    try {
        const {company , position} = req.body;

        if(!company || !position){
            res.status(400).send({message:"provide all fields",success:false})
        }

      req.body.createdBy = req.user.userId
      const job = await jobModel.create(req.body)

      res.status(200).send({message:"job successfully created",job})
        
    } catch (error) {
        
    }
}

export const getJobController = async(req,res)=>{

   try {
    

    
      const jobs = await jobModel.find({}).sort({createdBy:-1});
      res.status(200).json({
        jobs,
        totaljobs:jobs.length
        
      });

    
   } catch (error) {
    console.log(error);
    res.status(500).send({message:"getjob api not working",success:false})
    
   }


    };
    

export const updateJobcontroller = async(req,res,next)=>{

  try {
    const {company, position} = req.body

    if(!company || !position){
      res.status(400).send({message:"please provide all fields"})
    }

    
    
const {id} = req.params

const job = await jobModel.findOne({_id:id})
if(!job){
  res.status(500).send({success: false,message: 'no jobs found',});
}

if (req.user.userId !== job.createdBy.toString()) {
  next("You are not authorized to update this job");
  return;
}
const updateJob = await jobModel.findOneAndUpdate({_id:id},req.body,{
  new: true,
  runValidators: true,
})

await job.save()

res.status(200).send({message:"job has been updated",updateJob})

  } catch (error) {
    console.error(error);
    console.log(error);
    
    
    res.status(500).json({message:"not working api of job update"})
  }
}



export const deleteJobcontroller = async(req,res)=>{

  const {id}= req.params

  const job = await jobModel.findOne({_id:id})

  if(!job){
    res.status(500).send({success: false,message: 'job not found by this id'});
  }


  if(req.user.userId  !== job.createdBy.toString())
  {
    next("you will not allow to delete this job ")
    return;
  }
  await job.deleteOne()
res.status(200).send({success: true,message: 'job has been deleted',});
   
}


