import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import { supabase } from "../../lib/supabase";

// Vehicle data for each category
const vehicleData = {
  vehicle: [
    { id: 1, name: "سایپا 131", link: "/vehicle/saipa-131" },
    { id: 2, name: "پژو 206", link: "/vehicle/peugeot-206" },
    { id: 3, name: "تویوتا کمری", link: "/vehicle/toyota-camry" },
    { id: 4, name: "هیوندای آوانته", link: "/vehicle/hyundai-avante" },
    { id: 5, name: "پژو 405", link: "/vehicle/peugeot-405" },
    { id: 6, name: "سمند", link: "/vehicle/samand" },
  ],
  suv: [
    { id: 1, name: "جیلی", link: "/suv/jili" },
    { id: 2, name: "نیسان جوک", link: "/suv/nissan-juke" },
    { id: 3, name: "هیوندای توسان", link: "/suv/hyundai-tucson" },
    { id: 4, name: "کیا اسپورتیج", link: "/suv/kia-sportage" },
    { id: 5, name: "میتسوبیشی ASX", link: "/suv/mitsubishi-asx" },
  ],
  pickup: [
    { id: 1, name: "نیسان دیزل", link: "/pickup/nissan-diesel" },
    { id: 2, name: "تویوتا هیلوکس", link: "/pickup/toyota-hilux" },
    { id: 3, name: "میتسوبیشی L200", link: "/pickup/mitsubishi-l200" },
    { id: 4, name: "فورد رنجر", link: "/pickup/ford-ranger" },
  ],
};

const navAddresses = [
  { id: 1, link: "/vehicle", title: "سواری", category: "vehicle" },
  { id: 2, link: "/suv", title: "شاسی بلند", category: "suv" },
  { id: 3, link: "/pickup", title: "وانت", category: "pickup" },
];

const navPages = [
  { id: 4, link: "/", title: "خانه" },
  { id: 2, link: "/contact", title: "تماس با ما" },
  { id: 3, link: "/about", title: "درباره ما" },
  { id: 1, link: "/club", title: "باشگاه مشتریان" },
];

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState({
    vehicle: [],
    suv: [],
    pickup: [],
  });
  const [loadingCategory, setLoadingCategory] = useState({
    vehicle: false,
    suv: false,
    pickup: false,
  });

  const handleMouseEnter = (category) => {
    setOpenDropdown(category);
    // Lazy-load products for this category (6 random)
    if (
      category &&
      categoryProducts[category]?.length === 0 &&
      !loadingCategory[category]
    ) {
      fetchCategoryProducts(category);
    }
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

  // When mobile menu opens, no need to preload products anymore
  // useEffect(() => {
  //   if (mobileMenuOpen) {
  //     ['vehicle', 'suv', 'pickup'].forEach((cat) => {
  //       if (categoryProducts[cat]?.length === 0 && !loadingCategory[cat]) {
  //         fetchCategoryProducts(cat);
  //       }
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [mobileMenuOpen]);

  const getVehicleTypeTitle = (category) => {
    if (category === "vehicle") return "سواری";
    if (category === "suv") return "شاسی بلند";
    if (category === "pickup") return "وانت";
    return "";
  };

  const getBrandSlug = (brand) => {
    const brandMap = {
      تویوتا: "toyota",
      هیوندای: "hyundai",
      نیسان: "nissan",
      کیا: "kia",
      لکسوس: "lexus",
      جیلی: "geely",
      مزدا: "mazda",
      ام‌جی: "mg",
      "ام جی": "mg",
      میتسوبیشی: "mitsubishi",
      فولکس‌واگن: "volkswagen",
      "فولکس واگن": "volkswagen",
      سایپا: "saipa",
      سوزوکی: "suzuki",
      رنو: "renault",
      پژو: "peugeot",
      "ایران خودرو": "irankhodro",
      ایران‌خودرو: "irankhodro",
      فاو: "faw",
      جی‌ای‌سی: "jac",
      جک: "jac",
    };
    if (!brand) return "brand";
    return brandMap[brand] || String(brand).toLowerCase();
  };

  // تابع برای کوتاه کردن نام محصولات در موبایل
  const getShortProductName = (productName) => {
    if (!productName) return "";

    // حذف کلمات اضافی و کوتاه کردن
    let shortName = productName;

    // حذف کلمات رایج که فضای زیادی می‌گیرند
    shortName = shortName.replace(/لنت ترمز/g, "");
    shortName = shortName.replace(/لنت/g, "");
    shortName = shortName.replace(/ترمز/g, "");
    shortName = shortName.replace(/جلو/g, "ج");
    shortName = shortName.replace(/عقب/g, "ع");
    shortName = shortName.replace(/چپ/g, "چ");
    shortName = shortName.replace(/راست/g, "ر");

    // حذف فاصله‌های اضافی
    shortName = shortName.replace(/\s+/g, " ").trim();

    // اگر خیلی کوتاه شد، حداقل 3 کاراکتر نمایش بده
    if (shortName.length < 3) {
      shortName = productName.substring(0, 8);
    }

    // اگر هنوز خیلی طولانی است، آن را کوتاه کن
    if (shortName.length > 15) {
      shortName = shortName.substring(0, 15) + "...";
    }

    return shortName;
  };

  const shuffleSliceSix = (arr) => {
    const cloned = [...arr];
    for (let i = cloned.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
    }
    return cloned.slice(0, 6);
  };

  const fetchCategoryProducts = async (category) => {
    try {
      setLoadingCategory((prev) => ({ ...prev, [category]: true }));
      const vehicleTypeTitle = getVehicleTypeTitle(category);
      const { data, error } = await supabase
        .from("products")
        .select("id,name,brand,image,vehicleType")
        .eq("vehicleType", vehicleTypeTitle);
      if (!error && Array.isArray(data)) {
        const pick = shuffleSliceSix(data);
        setCategoryProducts((prev) => ({ ...prev, [category]: pick }));
      }
    } catch (e) {
      // silently ignore
    } finally {
      setLoadingCategory((prev) => ({ ...prev, [category]: false }));
    }
  };

  return (
    <React.Fragment>
      {/* Desktop Navbar */}
      <div className="hidden lg:flex fixed z-50 top-0 left-0 right-0 justify-evenly items-center shadow-2xl shadow-gray-400 w-full sm:bg-gradient-to-tl from-blue-600 to-blue-950">
        <div className="flex justify-center items-center w-full">
          {navPages.map((page) => (
            <Link
              className="text-white text-sm mx-3 hover:text-orange-300 transition-colors duration-200"
              key={page.id}
              to={page.link}
            >
              {page.title}
            </Link>
          ))}
          {/* Customer auth removed; checkout handles OTP login */}
        </div>
        <Link to="/" className="w-full h-10 text-center text-white text-2xl font-semibold hover:text-orange-300 transition-colors">
          لِنــت شـــــاپ
        </Link>
        <div className="flex justify-center items-center text-sm w-full">
          {navAddresses.map((address) => (
            <div
              key={address.id}
              className="relative"
              onMouseEnter={() => handleMouseEnter(address.category)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                className="text-white mx-3 hover:text-orange-300 duration-100 hover:font-extrabold flex items-center"
                to={address.link}
              >
                {address.title}
                <KeyboardArrowDownIcon className="text-gray-300" />
              </Link>

              {/* Desktop Dropdown */}
              {openDropdown === address.category && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[320px] z-50">
                  <div className="py-2">
                    {/* Random 6 products of this category */}
                    {categoryProducts[address.category]?.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        در حال بارگذاری...
                      </div>
                    ) : (
                      categoryProducts[address.category].map((p) => (
                        <Link
                          key={p.id}
                          to={`/product/${getBrandSlug(p.brand)}/${p.id}`}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-gray-400">
                                بدون تصویر
                              </span>
                            )}
                          </div>
                          <span className="truncate">{p.name}</span>
                        </Link>
                      ))
                    )}
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
      <div className="lg:hidden bg-gradient-to-br fixed top-0 left-0 right-0 z-50 from-blue-600 to-blue-900 shadow-2xl shadow-gray-400 w-full overflow-hidden">
        {/* Mobile Header */}
        <div className="flex justify-center items-center px-4 w-full">
          <button
            onClick={toggleMobileMenu}
            className="text-white p-1.5 -translate-y-1 hover:bg-blue-700 rounded-lg transition-colors duration-200"
          >
            {mobileMenuOpen ? (
              <CloseIcon className="text-lg" />
            ) : (
              <MenuIcon className="text-lg" />
            )}
          </button>
          <Link to="/" className="flex flex-col justify-center items-center mt-1 ml-4 w-full hover:opacity-80 transition-opacity">
            <h1 className="text-white text-lg sm:text-xl font-semibold text-center flex-1">
              لِنــت شـــــاپ
            </h1>
            <h1 className="text-gray-50 animate-pulse duration-1000 opacity-80 transform -translate-y-3 text-md sm:text-xl font-semibold text-center flex-1">
              Lentshop
            </h1>
          </Link>

          {/* Customer auth removed; checkout handles OTP login */}
        </div>

        {/* Mobile Menu - Compact & Minimal (animated) */}
        <div
          aria-hidden={!mobileMenuOpen}
          className={`bg-white border-t border-gray-200 shadow-lg w-full overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Main Navigation - Compact Horizontal */}
          <div className="mt-10 px-3 border-b border-gray-100 w-full">
            <div className="flex flex-wrap justify-center gap-1.5 w-full">
              {navPages.map((page) => (
                <Link
                  key={page.id}
                  to={page.link}
                  onClick={closeMobileMenu}
                  className="px-2.5 py-1.5 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200 rounded-md text-xs sm:text-sm whitespace-nowrap bg-gray-50"
                >
                  {page.title}
                </Link>
              ))}
              {/* Customer auth removed */}
            </div>
          </div>

          {/* Vehicle Categories - Simple Links */}
          <div className="py-2 px-3 w-full">
            <div className="space-y-2 w-full">
              {navAddresses.map((address) => (
                <Link
                  key={address.id}
                  to={address.link}
                  onClick={closeMobileMenu}
                  className="block w-full px-4 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200 rounded-lg text-base font-semibold bg-gray-50 border border-gray-200 text-center"
                >
                  {address.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-gray-200 rounded-b-3xl w-full opacity-90 z-50 lg:z-40 fixed top-12 lg:top-10 left-0 right-0 text-gray-800 font-extrabold overflow-hidden">
        <h1 className="text-center text-[9.8px] md:text-[14px] px-4 py-2 break-words">
          ارسال در ساعات کاری : مشهد <span className="animate-pulse text-red-500">ارسال رایگان</span>(2ساعت)- ارسال شهر های دیگر :
          تیپاکس 2 روزه/ شماره تماس ۰۹۲۰۹۳۵۰۲۳۵
        </h1>
      </div>
    </React.Fragment>
  );
};

export default Navbar;
