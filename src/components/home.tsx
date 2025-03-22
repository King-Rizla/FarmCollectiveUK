import React from "react";
import HeroSection from "./home/HeroSection";
import FeaturesPreview from "./home/FeaturesPreview";
import ProducersCarousel from "./home/ProducersCarousel";
import TestimonialsSection from "./home/TestimonialsSection";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-20">
        {/* Add padding to account for fixed navbar */}
        <HeroSection />
        <FeaturesPreview />
        <ProducersCarousel />
        <TestimonialsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
