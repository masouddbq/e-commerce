import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

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
    { id: 2, name: "شاسی بلند", link: "/suv/suv" },
    { id: 3, name: "نیسان جوک", link: "/suv/nissan-juke" },
    { id: 4, name: "هیوندای توسان", link: "/suv/hyundai-tucson" },
    { id: 5, name: "کیا اسپورتیج", link: "/suv/kia-sportage" }
  ],
  pickup: [
    { id: 1, name: "نیسان دیزل", link: "/pickup/nissan-diesel" },
    { id: 2, name: "دیزل", link: "/pickup/diesel" },
    { id: 3, name: "پیکاپ", link: "/pickup/pickup" },
    { id: 4, name: "وانت", link: "/pickup/van" }
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

      {/* Mobile Navbar */}
      <div className='lg:hidden bg-gradient-to-t from-blue-600 to-blue-900 shadow-2xl shadow-gray-400'>
        {/* Mobile Header */}
        <div className='flex justify-between items-center px-4 py-3'>
          <button
            onClick={toggleMobileMenu}
            className='text-white p-2 hover:bg-blue-700 rounded-lg transition-colors duration-200'
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          
          <h1 className='text-white text-xl font-semibold text-center flex-1'>لِنــت شـــــاپ</h1>
          
          <div className='w-10'></div> {/* Spacer for centering */}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className='bg-white border-t border-gray-200 shadow-lg'>
            {/* Main Navigation */}
            <div className='py-4'>
              <h3 className='text-gray-600 font-semibold px-4 mb-3 text-sm'>منو اصلی</h3>
              {navPages.map(page => (
                <Link
                  key={page.id}
                  to={page.link}
                  onClick={closeMobileMenu}
                  className='block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 border-b border-gray-100'
                >
                  {page.title}
                </Link>
              ))}
            </div>

            {/* Vehicle Categories */}
            <div className='py-4'>
              <h3 className='text-gray-600 font-semibold px-4 mb-3 text-sm'>دسته‌بندی خودروها</h3>
              {navAddresses.map(address => (
                <div key={address.id} className='border-b border-gray-100'>
                  <Link
                    to={address.link}
                    onClick={closeMobileMenu}
                    className='block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200'
                  >
                    {address.title}
                  </Link>
                  
                  {/* Mobile Submenu */}
                  <div className='bg-gray-50'>
                    {vehicleData[address.category]?.map((vehicle) => (
                      <Link
                        key={vehicle.id}
                        to={vehicle.link}
                        onClick={closeMobileMenu}
                        className='block px-8 py-2 text-sm text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200'
                      >
                        {vehicle.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
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