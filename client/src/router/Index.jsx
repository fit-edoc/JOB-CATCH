

import {createBrowserRouter} from 'react-router-dom'
import App from '../App.jsx'
import Home from '../Pages/Home.jsx'
import Register from '../Pages/Register.jsx'
import { AuthProvider } from '../context/AuthContext.jsx'
import LoginForm from '../Pages/Login.jsx'
import JobApplicationForm from '../Pages/JobForm.jsx'

const router = createBrowserRouter([
    {
        path:"/",
        element:(<AuthProvider><App/></AuthProvider>),
        children:[
            {
                index:true,
                element:<Home/>
            },
            {
                path:"/register",
                element:<Register/>
            },
            {path:"/login",
                element:<LoginForm/>
            },
            {path:"/jobs",
                element:<JobApplicationForm/>
            }
        ]
    }


])

export default router