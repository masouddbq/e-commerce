import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './Components/Navbar/Navbar'
import { CartProvider } from './Components/Common/CartContext'
import { AuthProvider } from './Components/Common/AuthContext'
import CartModal from './Components/Common/CartModal'
import FloatingCartButton from './Components/Common/FloatingCartButton'
import QuickSearchButton from './Components/Common/QuickSearchButton'
import BottomTabBar from './Components/Common/BottomTabBar'
import Breadcrumbs from './Components/Common/Breadcrumbs'
import ScrollToTop from './Components/Common/ScrollToTop'
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
import BrandProductsPage from './Components/Pages/BrandProductsPage';
import CategoriesPage from './Components/Pages/CategoriesPage';
import Checkout from './Components/Pages/Checkout';
import CheckoutSuccess from './Components/Pages/CheckoutSuccess';
import SpecialsPage from './Components/Pages/SpecialsPage';
import SearchResults from './Components/Pages/SearchResults';
import Terms from './Components/Pages/Terms';
import Privacy from './Components/Pages/Privacy';
import Guide from './Components/Pages/Guide';
import Payment from './Components/Pages/Payment';
import PaymentForm from './Components/Payment/PaymentForm';
import CardToCardPayment from './Components/Payment/CardToCardPayment';
import PaymentVerification from './Components/Payment/PaymentVerification';
import PaymentTestPage from './Components/Payment/PaymentTestPage';
import Shipping from './Components/Pages/Shipping';
import Return from './Components/Pages/Return';

function App() {




  return (
    <HelmetProvider>
      <div className='base-container'>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
                                  <ScrollToTop />
                                  <Navbar />
                        <CartModal />
                        <FloatingCartButton />
                        <QuickSearchButton />
                        <BottomTabBar />
                        <Breadcrumbs />
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
              <Route path='/brand-products/:brandSlug' element={<BrandProductsPage />}/>
              
              {/* Product Detail Routes */}
              <Route path='/product/:brand/:productId' element={<ProductDetail />}/>
              <Route path='/product/:productId' element={<ProductDetail />}/>
              
              {/* Search Results */}
              <Route path='/search-results/:searchTerm' element={<SearchResults />}/>
              
              {/* Checkout */}
              <Route path='/checkout' element={<Checkout />}/>
              <Route path='/checkout/success' element={<CheckoutSuccess />}/>

              {/* Specials */}
              <Route path='/specials' element={<SpecialsPage />}/>

              {/* Payment Routes */}
              <Route path='/payment' element={<Payment />}/>
              <Route path='/payment/form' element={<PaymentForm />}/>
              <Route path='/payment/card-to-card' element={<CardToCardPayment />}/>
              <Route path='/payment/verify' element={<PaymentVerification />}/>
              <Route path='/payment/callback' element={<PaymentVerification />}/>
              <Route path='/payment/test' element={<PaymentTestPage />}/>

              {/* Footer Pages */}
              <Route path='/terms' element={<Terms />}/>
              <Route path='/privacy' element={<Privacy />}/>
              <Route path='/guide' element={<Guide />}/>
              <Route path='/shipping' element={<Shipping />}/>
              <Route path='/return' element={<Return />}/>

            </Routes>
          </div>
          <Footer className='footer' />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </div>
    </HelmetProvider>
  )
}

export default App
