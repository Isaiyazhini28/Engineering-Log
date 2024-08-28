import './App.css'
import Myform from './pages/Myform';
// import Signup from "./pages/signup"
// import { Button } from "@/components/ui/button"
// import Forget from './pages/Forget'
// import Login from './pages/Login'
// import Otp from './pages/Otp'
// import Home from './pages/Home'
// import { BrowserRouter as  Router, Route, Link, Routes,createBrowserRouter, RouterProvider } from "react-router-dom"
// import { QueryClientProvider } from '@tanstack/react-query';
// import queryClient from './pages/queryClient'; // import your QueryClient instance
// import ParentComponent from './pages/parent'
// import { count } from 'console'
// import Grid from './pages/grid';
// import DynamicGrid from './pages/grid'
// import MyForm from './pages/Myform';
// import dynamicform from './pages/dynamicform'
import { DynamicFormComp } from './pages/testform'
import { ZodSchema } from 'zod'




const App: React.FC = () => {
// function App() {
  
     
  // const router = createBrowserRouter([
  //  {
  //   path: "/",
  //   element: <Login/>,
  //  },
  //  {
  //   path: "/signup",
  //   element: <Signup/>,
  //  },
  //  {
  //   path: "/forget",
  //   element: <Forget/>,
  //  },
  //  {
  //   path: "/home",
  //   element: <Home/>
  //  },
  //  {
  //   path: "/otp",
  //   element: <Otp/>
  //  },
  // ]);

  // const data = [
  //   { id: 1, name: 'John Doe', age: 28 },
  //   { id: 2, name: 'Jane Smith', age: 32 },
  //   { id: 3, name: 'Alice Johnson', age: 45 },
  // ];


  
  return (

    // <div>
    //   <h1>Parent Component</h1>
    //   <ParentComponent
        
    //   />
    // </div>
    
    // <div className="container mx-auto p-4">
    //   <h1 className="text-2xl font-bold mb-4">User Grid</h1>
    //   <Grid data={data} />
    // </div>

    // <div className="container mx-auto p-4">
    //   <h1 className="text-2xl font-bold mb-4">Dynamic User Grid</h1>

    //   <DynamicGrid />
    // </div>


    // <div className="min-h-screen bg-gray-100 flex items-center justify-center min-w-full">
    //   <Myform/>
    // </div>

    <div className='flex h-full w-full overflow-y-auto overflow-x-hidden bg-red-400 text-black'>
     <DynamicFormComp/>
     
    </div>
  );
}

export default App;
