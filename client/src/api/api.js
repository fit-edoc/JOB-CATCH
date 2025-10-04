export const hostUrl = "http://localhost:8000/api/user"


//user apis 
export const registerApi = `${hostUrl}/register`
export const loginApi = `${hostUrl}/login`
export const updateUser = `${hostUrl}/update`

// jobs apis

export const createJob = `${hostUrl}/createjob`
export const getalljobs = `${hostUrl}/getjobs`
export const updateJobs = `${hostUrl}/updatejob/:id`
export const deleteJob = `${hostUrl}/deletejob/:id`