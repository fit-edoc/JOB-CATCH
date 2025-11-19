import { render,screen } from "@testing-library/react";
import AllJobs from "../Pages/AllJobs";


test("job card fetching",()=>{

     const mockJob = {
  
    company: "SAG Infotech",
    positoin: "Java Full stack developer",
    workLocation:"Jaipur"
  };

  render(<AllJobs job={mockJob}/>)

   expect(screen.getByText("Java Full stack developer")).toBeInTheDocument();
  expect(screen.getByText("SAG Infotech")).toBeInTheDocument();
})