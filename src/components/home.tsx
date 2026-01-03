import React from 'react';
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesPreview from "@/components/home/FeaturesPreview";
import ProducersCarousel from "@/components/home/ProducersCarousel";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import Footer from "@/components/layout/Footer";

const Home = () => {
  return (
    <div className="bg-amber-50 min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesPreview />
        <ProducersCarousel />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
