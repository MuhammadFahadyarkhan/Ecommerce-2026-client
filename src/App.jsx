import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import TopBar from './components/TopBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { UserData } from "@/context/UserContext";
import Verify from './pages/Verify'
import Loading from './components/Loading'
import Products from './pages/Products'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'
import ProductPage from './pages/ProductPage'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import Orders from './pages/Orders'
import OrderPage from './pages/OrderPage'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const {isAuth,loading} = UserData();

  return (
   <>
  {
    loading ? (<Loading />
    ) :(
     <BrowserRouter>
   <TopBar />
   <Navbar />
   <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/products' element={<Products />} />
    <Route path='/product/:id' element={<ProductPage />} />
    <Route path='/cart' element={isAuth ? <Cart /> : <Navigate to='/login' replace />} />
    <Route path='/orders' element={isAuth ? <Orders /> : <Navigate to='/login' replace />} />
    <Route path='/admin/dashboard' element={isAuth ? <AdminDashboard /> : <Navigate to='/login' replace />} />
    <Route path='/order/:id' element={isAuth ? <OrderPage /> : <Navigate to='/login' replace />} />
    <Route path='/checkout' element={isAuth ? <Checkout /> : <Navigate to='/login' replace />} />
    <Route path='/payment/:id' element={isAuth ? <Payment /> : <Navigate to='/login' replace />} />
    <Route path='*' element={<NotFound />} />
    <Route path='/login' element={isAuth?<Home /> : <Login />} />
    <Route path='/verify' element={isAuth?<Home /> :<Verify />} />
   </Routes>
   <Footer />
   </BrowserRouter>
  )}
   </>
  )
}

export default App