import React, { lazy } from 'react'
import {createBrowserRouter} from 'react-router-dom'
import App from '../App.jsx'
import { ProtectedRoute } from '../middlewareRoutes/ProtectedRoute.jsx'

const Home = lazy(() => import('../Pages/Home.jsx'))
const Register = lazy(() => import('../Pages/Register.jsx'))
const LoginForm = lazy(() => import('../Pages/Login.jsx'))
const JobApplicationForm = lazy(() => import('../Pages/JobForm.jsx'))
const AllJobs = lazy(() => import('../Pages/AllJobs.jsx'))
const Dashboard = lazy(() => import('../Pages/Dashboard.jsx'))
const Profile = lazy(() => import('../Pages/Profile.jsx'))

const router = createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {
                index:true,
                element:<Home/>
            },
            {
                path:"/register",
                element:<Register/>
            },
            {
                path:"/login",
                element:<LoginForm/>
            },
            {
                path:"alljobs",
                element:<AllJobs/>
            },
            {
                path:"/postjob",
                element: <ProtectedRoute>
                    <JobApplicationForm/>
                </ProtectedRoute> 
            },
            {
                path:"/dashboard",
                element: <ProtectedRoute>
                    <Dashboard/>
                </ProtectedRoute>
            },
            {
                path:"/profile",
                element: <ProtectedRoute>
                    <Profile/>
                </ProtectedRoute>
            }
        ]
    }
])

export default router