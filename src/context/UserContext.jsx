import { server } from '@/main';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from "js-cookie"

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Changed from array to boolean for standard practice
    const [btnLoading, setBtnLoading] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
 
    async function loginUser(email, navigate) {
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${server}/api/user/login`, {
                email 
            });

            // Handle both spellings just in case your backend uses either
            toast.success(data.message || data.messege);  
            localStorage.setItem("email", email);
            navigate("/verify"); 
            
        } catch (error) {
            // Safely extract error message from backend or fallback to network message
            const errorMessage = error.response?.data?.message || error.response?.data?.messege || error.message;
            toast.error(errorMessage);
        } finally {
            setBtnLoading(false);
        }
    }

     async function verifyUser(otp, navigate,fetchCart) {
        setBtnLoading(true);
        const email= localStorage.getItem("email")
        try {
            const { data } = await axios.post(`${server}/api/user/verify`, {
               email,otp 
            });

            toast.success(data.message || data.messege);  
            localStorage.clear();
            navigate("/"); 
            setIsAuth(true)
            setUser(data.user)
           
            Cookies.set("token", data.token,{
                expires:30,
                secure:true,
                path:"/"
            })
             fetchCart()
        } catch (error) {
            
            const errorMessage = error.response?.data?.message || error.response?.data?.messege || error.message;
            toast.error(errorMessage);
        } finally {
            setBtnLoading(false);
        }
    }
              

      async function fetchUser() {
        const token = Cookies.get("token");
    if (!token) {
      setIsAuth(false);
      setLoading(false);
      return;
    }
    try {
        const {data} = await axios.get(`${server}/api/user/me`,{
       
        headers: {
        token: Cookies.get("token"),
        },
        });
        setIsAuth(true)
        setUser(data.user)
        setLoading(false) 
    } catch (error) {
        console.log(error);
        setIsAuth(false)
        setLoading(false)
    }
}

     function logoutUser(navigate,setTotalItem) {
  Cookies.remove("token");
  setUser(null);
  setIsAuth(false);
  navigate("/login");
  toast.success("Logged Out");
  setTotalItem(0)
}

     useEffect(()=>{
        fetchUser()
     },[])
      
    return (
        <UserContext.Provider value={{ user, loading, btnLoading, isAuth, loginUser,verifyUser,logoutUser }}>
            {children}
            <Toaster />
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);