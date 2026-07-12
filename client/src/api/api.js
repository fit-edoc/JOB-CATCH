export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://job-catch.onrender.com');

export const hostUrl = `${API_BASE_URL}/api/user`;
export const jobUrl = `${API_BASE_URL}/api/job`;

//user apis 
export const registerApi = `${hostUrl}/register`
export const loginApi = `${hostUrl}/login`
export const updateUser = `${hostUrl}/update`

// jobs apis
export const createJobApi = `${jobUrl}/createjob`
export const getalljobs = `${jobUrl}/getjobs`
export const updateJobs = `${jobUrl}/updatejob/:id`
export const deleteJob = `${jobUrl}/deletejob/:id`