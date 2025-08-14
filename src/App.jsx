import { useState, useEffect } from 'react'
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
import { supabase } from './lib/supabase'
import AdminPanel from './Components/Admin/AdminPanel'

// Brand Pages
import SaipaPage from './Components/Pages/SaipaPage';
import IranKhodroPage from './Components/Pages/IranKhodroPage';
import PeugeotPage from './Components/Pages/PeugeotPage';
import HyundaiPage from './Components/Pages/HyundaiPage';
import NissanPage from './Components/Pages/NissanPage';
import ToyotaPage from './Components/Pages/ToyotaPage';
import LexusPage from './Components/Pages/LexusPage';
import KiaPage from './Components/Pages/KiaPage';
import MGPage from './Components/Pages/MGPage';
import MazdaPage from './Components/Pages/MazdaPage';
import SuzukiPage from './Components/Pages/SuzukiPage';
import MitsubishiPage from './Components/Pages/MitsubishiPage';
import RenaultPage from './Components/Pages/RenaultPage';
import VolkswagenPage from './Components/Pages/VolkswagenPage';
import FAWPage from './Components/Pages/FAWPage';
import GeelyPage from './Components/Pages/GeelyPage';
import JACPage from './Components/Pages/JACPage';
import ProductDetail from './Components/ProductDetail/ProductDetail';

function App() {

  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1)
      
      if (error) {
        console.error('Error:', error)
      } else {
        console.log('Success! Data:', data)
      }
    } catch (err) {
      console.error('Connection failed:', err)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])


  return (
    <div className='base-container'>
      <BrowserRouter>
        <Navbar />
          <div className='main'>
            <Routes>
              <Route path='/' element={<HomePage />}/>
              <Route path='/vehicle' element={<Vehicle />}/>
              <Route path='/suv' element={<Suv />}/>
              <Route path='/pickup' element={<Pickup />}/>
              <Route path='/contact' element={<ContactUs />}/>
              <Route path='/about' element={<AboutUs />}/>
              <Route path='/club' element={<CustomerClub />}/>
              <Route path='/admin' element={<AdminPanel />}/>
              
              {/* Brand Pages */}
              <Route path='/brands/saipa' element={<SaipaPage />}/>
              <Route path='/brands/irankhodro' element={<IranKhodroPage />}/>
              <Route path='/brands/peugeot' element={<PeugeotPage />}/>
              <Route path='/brands/hyundai' element={<HyundaiPage />}/>
              <Route path='/brands/nissan' element={<NissanPage />}/>
              <Route path='/brands/toyota' element={<ToyotaPage />}/>
              <Route path='/brands/lexus' element={<LexusPage />}/>
              <Route path='/brands/kia' element={<KiaPage />}/>
              <Route path='/brands/mg' element={<MGPage />}/>
              <Route path='/brands/mazda' element={<MazdaPage />}/>
              <Route path='/brands/suzuki' element={<SuzukiPage />}/>
              <Route path='/brands/mitsubishi' element={<MitsubishiPage />}/>
              <Route path='/brands/renault' element={<RenaultPage />}/>
              <Route path='/brands/faw' element={<FAWPage />}/>
              <Route path='/brands/geely' element={<GeelyPage />}/>
              <Route path='/brands/volkswagen' element={<VolkswagenPage />}/>
              <Route path='/brands/jac' element={<JACPage />}/>
              
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
