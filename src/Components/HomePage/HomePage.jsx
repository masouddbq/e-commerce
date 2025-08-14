import React from 'react';
import HeroSlider from './HeroSlider';
import BrandCategories from './BrandCategories';
import PopularProducts from './PopularProducts';
import FeaturesSection from './FeaturesSection';
import CustomerReviews from './CustomerReviews';
import BlogSection from './BlogSection';
import NewsletterSection from './NewsletterSection';
import SpecialOffers from './SpecialOffers';
import AboutSection from './AboutSection';
import FeaturedProducts from './FeaturedProducts';

const HomePage = () => {
  return (
    <div className='flex flex-col w-full'>
      <BrandCategories />
      <HeroSlider />
      <AboutSection />
      <FeaturesSection />
      <SpecialOffers />
      <FeaturedProducts />
      <PopularProducts />
      <CustomerReviews />
      <BlogSection />
      <NewsletterSection />
    </div>
  )
}

export default HomePage