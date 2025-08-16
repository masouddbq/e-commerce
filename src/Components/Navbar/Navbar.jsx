import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';

// Vehicle data for each category
const vehicleData = {
  vehicle: [
    { id: 1, name: "سایپا 131", link: "/vehicle/saipa-131" },
    { id: 2, name: "پژو 206", link: "/vehicle/peugeot-206" },
    { id: 3, name: "تویوتا کمری", link: "/vehicle/toyota-camry" },
    { id: 4, name: "هیوندای آوانته", link: "/vehicle/hyundai-avante" },
    { id: 5, name: "پژو 405", link: "/vehicle/peugeot-405" },
    { id: 6, name: "سمند", link: "/vehicle/samand" }
  ],
  suv: [
    { id: 1, name: "جیلی", link: "/suv/jili" },
    { id: 2, name: "نیسان جوک", link: "/suv/nissan-juke" },
    { id: 3, name: "هیوندای توسان", link: "/suv/hyundai-tucson" },
    { id: 4, name: "کیا اسپورتیج", link: "/suv/kia-sportage" },
    { id: 5, name: "میتسوبیشی ASX", link: "/suv/mitsubishi-asx" }
  ],
  pickup: [
    { id: 1, name: "نیسان دیزل", link: "/pickup/nissan-diesel" },
    { id: 2, name: "تویوتا هیلوکس", link: "/pickup/toyota-hilux" },
    { id: 3, name: "میتسوبیشی L200", link: "/pickup/mitsubishi-l200" },
    { id: 4, name: "فورد رنجر", link: "/pickup/ford-ranger" }
  ]
};

const navAddresses = [
    {id : 1 , link : "/vehicle" , title : "سواری", category: "vehicle"},
    {id : 2 , link : "/suv" , title : "شاسی بلند", category: "suv"},
    {id : 3 , link : "/pickup" , title : "دیزل", category: "pickup"},
]

const navPages = [
    {id : 4 , link : "/" , title : "خانه"},
    {id : 2 , link : "/contact" , title : "تماس با ما"},
    {id : 3 , link : "/about" , title : "درباره ما"},
    {id : 1 , link : "/club" , title : "باشگاه مشتریان"},
]

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMouseEnter = (category) => {
    setOpenDropdown(category);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <div className='hidden lg:flex justify-evenly items-center shadow-2xl shadow-gray-400 w-full bg-gradient-to-t from-blue-600 to-blue-900 relative'>
        <div className='flex justify-center items-center w-full'>
          {navPages.map(page => ( 
            <Link className='text-white text-sm mx-3 hover:text-orange-300 transition-colors duration-200' key={page.id} to={page.link}>{page.title}</Link>
          ))}
          {/* Login/Register Icons */}
          <div className='flex items-center space-x-2 mr-4'>
            <Link 
              to="/login" 
              className='text-white hover:text-orange-300 transition-colors duration-200 flex items-center space-x-1'
              title="ورود به پنل ادمین"
            >
              <LoginIcon className='text-lg' />
              <span className='text-sm'>ورود</span>
            </Link>
            <Link 
              to="/register" 
              className='text-white hover:text-orange-300 transition-colors duration-200 flex items-center space-x-1'
              title="ثبت‌نام ادمین"
            >
              <PersonIcon className='text-lg' />
              <span className='text-sm'>ثبت‌نام</span>
            </Link>
          </div>
        </div>
        <h1 className='w-full h-10 text-center text-white text-2xl font-semibold'>لِنــت شـــــاپ</h1>
        <div className='flex justify-center items-center text-sm w-full'>
          {navAddresses.map(address => ( 
            <div 
              key={address.id} 
              className="relative"
              onMouseEnter={() => handleMouseEnter(address.category)}
              onMouseLeave={handleMouseLeave}
            >
              <Link 
                className='text-white mx-3 hover:text-orange-300 duration-100 hover:font-extrabold flex items-center' 
                to={address.link}
              >
                {address.title}
                <KeyboardArrowDownIcon className='text-gray-300' />
              </Link>
              
              {/* Desktop Dropdown */}
              {openDropdown === address.category && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[200px] z-50">
                  <div className="py-2">
                    {vehicleData[address.category]?.map((vehicle) => (
                      <Link
                        key={vehicle.id}
                        to={vehicle.link}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      >
                        {vehicle.name}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link
                        to={address.link}
                        className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
                        onClick={() => setOpenDropdown(null)}
                      >
                        مشاهده همه {address.title} →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile & Tablet Navbar */}
      <div className='lg:hidden bg-gradient-to-t from-blue-600 to-blue-900 shadow-2xl shadow-gray-400 w-full'>
        {/* Mobile Header */}
        <div className='flex justify-between items-center px-4 py-2 w-full'>
          <button
            onClick={toggleMobileMenu}
            className='text-white p-1.5 hover:bg-blue-700 rounded-lg transition-colors duration-200'
          >
            {mobileMenuOpen ? <CloseIcon className="text-lg" /> : <MenuIcon className="text-lg" />}
          </button>
          
          <h1 className='text-white text-lg sm:text-xl font-semibold text-center flex-1'>لِنــت شـــــاپ</h1>
          
          {/* Mobile Login/Register Icons */}
          <div className='flex items-center space-x-2'>
            <Link 
              to="/login" 
              className='text-white hover:text-orange-300 transition-colors duration-200 p-1.5'
              title="ورود"
            >
              <LoginIcon className='text-lg' />
            </Link>
            <Link 
              to="/register" 
              className='text-white hover:text-orange-300 transition-colors duration-200 p-1.5'
              title="ثبت‌نام"
            >
              <PersonIcon className='text-lg' />
            </Link>
          </div>
        </div>

        {/* Mobile Menu - Compact & Minimal */}
        {mobileMenuOpen && (
          <div className='bg-white border-t border-gray-200 shadow-lg w-full'>
            {/* Main Navigation - Compact Horizontal */}
            <div className='py-2 px-3 border-b border-gray-100'>
              <div className='flex flex-wrap justify-center gap-1.5'>
                {navPages.map(page => (
                  <Link
                    key={page.id}
                    to={page.link}
                    onClick={closeMobileMenu}
                    className='px-2.5 py-1.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md text-xs sm:text-sm whitespace-nowrap bg-gray-50 hover:bg-blue-100'
                  >
                    {page.title}
                  </Link>
                ))}
                {/* Mobile Login/Register Links */}
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className='px-2.5 py-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 rounded-md text-xs sm:text-sm whitespace-nowrap bg-blue-50 hover:bg-blue-100'
                >
                  ورود
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className='px-2.5 py-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 rounded-md text-xs sm:text-sm whitespace-nowrap bg-blue-50 hover:bg-blue-100'
                >
                  ثبت‌نام
                </Link>
              </div>
            </div>

            {/* Vehicle Categories - Compact Grid */}
            <div className='py-2 px-3'>
              <div className='grid grid-cols-3 gap-2'>
                {navAddresses.map(address => (
                  <div key={address.id} className='text-center'>
                    <Link
                      to={address.link}
                      onClick={closeMobileMenu}
                      className='block px-2 py-1.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md text-xs font-medium bg-gray-50 hover:bg-blue-100'
                    >
                      {address.title}
                    </Link>
                    
                    {/* Compact Submenu */}
                    <div className='mt-1 space-y-0.5'>
                      {vehicleData[address.category]?.slice(0, 3).map((vehicle) => (
                        <Link
                          key={vehicle.id}
                          to={vehicle.link}
                          onClick={closeMobileMenu}
                          className='block px-2 py-1 text-xs text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 rounded text-center'
                        >
                          {vehicle.name}
                        </Link>
                      ))}
                      {vehicleData[address.category]?.length > 3 && (
                        <Link
                          to={address.link}
                          onClick={closeMobileMenu}
                          className='block px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 font-medium rounded text-center'
                        >
                          +{vehicleData[address.category].length - 3} بیشتر
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Promo Banner */}
      <div className='bg-gray-300 w-full text-gray-600 font-extrabold'>
        <h1 className='text-center text-sm md:text-md px-4 py-2'>تخفیفات ما شامل دسته بندی های سواری و شاسی بلند شده ! از دستشون ندی...</h1>
      </div>
    </>
  )
}

export default Navbar