import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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

  const handleMouseEnter = (category) => {
    setOpenDropdown(category);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <>
    <div className='flex justify-evenly items-center shadow-2xl shadow-gray-400 w-full bg-gradient-to-t from-blue-600 to-blue-900 relative'>
        <div className='flex justify-center items-center w-full'>
            {navPages.map(page => ( 
                <Link className='text-white text-sm mx-3' key={page.id} to={page.link}>{page.title}</Link>
            ))}
        </div>
        <h1 className='w-full h-10 text-center text-white  text-2xl font-semibold'>لِنــت شـــــاپ</h1>
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
                  
                  {/* Simple Dropdown */}
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
    <div className='bg-gray-300 w-full text-gray-600 font-extrabold'>
        <h1 className='text-center text-md'>تخفیفات ما شامل دسته بندی های سواری و شاسی بلند شده ! از دستشون ندی...</h1>
    </div>
    </>
  )
}

export default Navbar