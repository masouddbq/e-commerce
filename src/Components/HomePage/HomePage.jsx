import React from 'react';
import HeroSlider from './HeroSlider';
import BrandCategories from './BrandCategories';
import PopularProducts from './PopularProducts';
import FeaturesSection from './FeaturesSection';
import CustomerReviews from './CustomerReviews';
import NewsletterSection from './NewsletterSection';
import SpecialOffers from './SpecialOffers';
import AboutSection from './AboutSection';
import FeaturedProducts from './FeaturedProducts';
import QuickAccessButton from './QuickAccessButton';

const HomePage = () => {
  return (
    <div className='flex flex-col w-full'>
      <BrandCategories />
      <HeroSlider />
      <QuickAccessButton />
      <AboutSection />
      <FeaturesSection />
      <SpecialOffers />
      <FeaturedProducts />
      <PopularProducts />
      <CustomerReviews />
      <NewsletterSection />
    </div>
  )
}

export default HomePage