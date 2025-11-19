import jobModel from "./server/model/jobModel"




const jobsdata = [
  {
    "company": "Tata Consultancy Services",
    "position": "Frontend Developer",
    "status": "pending",
    "workType": "full-time",
    "salary": { "min": 450000, "max": 600000, "currency": "INR", "disclosed": true },
    "workLocation": "Noida",
    "applyLink": "https://tcs.com/careers/apply-frontend-dev",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "Infosys",
    "position": "Backend Engineer",
    "status": "pending",
    "workType": "full-time",
    "salary": { "min": 500000, "max": 750000, "currency": "INR", "disclosed": true },
    "workLocation": "Bangalore",
    "applyLink": "https://infosys.com/jobs/backend-engineer",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "Google India",
    "position": "Software Engineer Intern",
    "status": "pending",
    "workType": "internship",
    "salary": { "min": 25000, "max": 35000, "currency": "INR", "disclosed": true },
    "workLocation": "Hyderabad",
    "applyLink": "https://careers.google.com/jobs/se-intern",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "Microsoft",
    "position": "Cloud Support Associate",
    "status": "interview",
    "workType": "full-time",
    "salary": { "min": 600000, "max": 900000, "currency": "INR", "disclosed": true },
    "workLocation": "Hyderabad",
    "applyLink": "https://microsoft.com/careers/cloud-support",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "Amazon",
    "position": "SDE 1",
    "status": "pending",
    "workType": "full-time",
    "salary": { "min": 1200000, "max": 1600000, "currency": "INR", "disclosed": true },
    "workLocation": "Bangalore",
    "applyLink": "https://amazon.jobs/sde1/apply",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "Wipro",
    "position": "IT Support Engineer",
    "status": "rejected",
    "workType": "full-time",
    "salary": { "min": 300000, "max": 450000, "currency": "INR", "disclosed": true },
    "workLocation": "Pune",
    "applyLink": "https://wipro.com/careers/it-support",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "HCL Technologies",
    "position": "Java Developer",
    "status": "pending",
    "workType": "full-time",
    "salary": { "min": 500000, "max": 800000, "currency": "INR", "disclosed": true },
    "workLocation": "Noida",
    "applyLink": "https://hcltech.com/jobs/java-developer",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "Paytm",
    "position": "React Developer",
    "status": "interview",
    "workType": "contract",
    "salary": { "min": 70000, "max": 100000, "currency": "INR", "disclosed": true },
    "workLocation": "Delhi",
    "applyLink": "https://paytm.com/careers/react-dev",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "Flipkart",
    "position": "Data Analyst",
    "status": "pending",
    "workType": "full-time",
    "salary": { "min": 550000, "max": 900000, "currency": "INR", "disclosed": true },
    "workLocation": "Bangalore",
    "applyLink": "https://careers.flipkart.com/data-analyst",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "Zomato",
    "position": "Full Stack Developer",
    "status": "pending",
    "workType": "full-time",
    "salary": { "min": 700000, "max": 1100000, "currency": "INR", "disclosed": true },
    "workLocation": "Gurugram",
    "applyLink": "https://zomato.com/jobs/fullstack-dev",
    "createdBy": "6739ab21983bcf0012e89010"
  },

  {
    "company": "Byju's",
    "position": "Business Development Associate",
    "status": "pending",
    "workType": "full-time",
    "salary": { "min": 500000, "max": 800000, "currency": "INR", "disclosed": true },
    "workLocation": "Bangalore",
    "applyLink": "https://byjus.com/careers/bda",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "Delhivery",
    "position": "Operations Executive",
    "status": "pending",
    "workType": "full-time",
    "salary": { "min": 250000, "max": 400000, "currency": "INR", "disclosed": true },
    "workLocation": "Delhi",
    "applyLink": "https://delhivery.com/careers/ops-exec",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "Ola Electric",
    "position": "Embedded Engineer",
    "status": "pending",
    "workType": "full-time",
    "salary": { "min": 800000, "max": 1200000, "currency": "INR", "disclosed": true },
    "workLocation": "Bangalore",
    "applyLink": "https://olaelectric.com/careers/embedded-eng",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "Nykaa",
    "position": "UI/UX Designer",
    "status": "interview",
    "workType": "full-time",
    "salary": { "min": 600000, "max": 900000, "currency": "INR", "disclosed": true },
    "workLocation": "Mumbai",
    "applyLink": "https://nykaa.com/careers/uiux-designer",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "Swiggy",
    "position": "Node.js Developer",
    "status": "pending",
    "workType": "full-time",
    "salary": { "min": 550000, "max": 950000, "currency": "INR", "disclosed": true },
    "workLocation": "Bangalore",
    "applyLink": "https://swiggy.com/careers/node-dev",
    "createdBy": "6739ab21983bcf0012e89010"
  },

  {
    "company": "PhonePe",
    "position": "QA Engineer",
    "status": "pending",
    "workType": "full-time",
    "salary": { "min": 450000, "max": 700000, "currency": "INR", "disclosed": true },
    "workLocation": "Bangalore",
    "applyLink": "https://phonepe.com/jobs/qa-engineer",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "Urban Company",
    "position": "Data Engineer",
    "status": "pending",
    "workType": "full-time",
    "salary": { "min": 900000, "max": 1300000, "currency": "INR", "disclosed": true },
    "workLocation": "Gurugram",
    "applyLink": "https://urbancompany.com/careers/data-eng",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "CRED",
    "position": "Frontend Developer (React)",
    "status": "pending",
    "workType": "full-time",
    "salary": { "min": 1000000, "max": 1600000, "currency": "INR", "disclosed": true },
    "workLocation": "Bangalore",
    "applyLink": "https://cred.club/careers/frontend-react",
    "createdBy": "6739ab21983bcf0012e89010"
  },
  {
    "company": "MakeMyTrip",
    "position": "DevOps Engineer",
    "status": "pending",
    "workType": "full-time",
    "salary": { "min": 800000, "max": 1300000, "currency": "INR", "disclosed": true },
    "workLocation": "Gurugram",
    "applyLink": "https://careers.makemytrip.com/devops",
    "createdBy": "6739ab21983bcf0012e89010"
  }
]
