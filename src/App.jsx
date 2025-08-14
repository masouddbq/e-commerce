import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar'
import HomePage from './Components/HomePage/HomePage'
import Vehicle from './Components/Categories/Vehicle';
import Suv from './Components/Categories/Suv';
import Pickup from './Components/Categories/Pickup';
import ContactUs from './Components/Pages/ContactUs';
import AboutUs from './Components/Pages/AboutUs';
import CustomerClub from './Components/Pages/CustomerClub';
import Footer from './Components/Footer/Footer';
import AdminPanel from './Components/Admin/AdminPanel'
import Login from './Components/Pages/Login';
import Register from './Components/Pages/Register';
import ProductDetail from './Components/ProductDetail/ProductDetail';
import BrandPage from './Components/Pages/BrandPage';
import CategoriesPage from './Components/Pages/CategoriesPage';

function App() {




  return (
    <div className='base-container'>
      <BrowserRouter>
        <Navbar />
          <div className='main'>
            <Routes>
              <Route path='/' element={<HomePage />}/>
              <Route path='/categories' element={<CategoriesPage />}/>
              <Route path='/vehicle' element={<Vehicle />}/>
              <Route path='/suv' element={<Suv />}/>
              <Route path='/pickup' element={<Pickup />}/>
              <Route path='/contact' element={<ContactUs />}/>
              <Route path='/about' element={<AboutUs />}/>
              <Route path='/club' element={<CustomerClub />}/>
              <Route path='/login' element={<Login />}/>
              <Route path='/register' element={<Register />}/>
              <Route path='/admin' element={<AdminPanel />}/>
              
              {/* Brand Pages Routes */}
              <Route path='/brands/:brandSlug' element={<BrandPage />}/>
              
              {/* Product Detail Routes */}
              <Route path='/product/:brand/:productId' element={<ProductDetail />}/>
            </Routes>
          </div>
          <Footer className='footer' />
      </BrowserRouter>
    </div>
  )
}

export default App
