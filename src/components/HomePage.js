import React from 'react';
import ExploreCareerPaths from './sections/ExploreCareerPaths';
import FeaturedJobs from './sections/FeaturedJobs';
import TrustedCompanies from './sections/TrustedCompanies';
import CareerTools from './sections/CareerTools';
import SuccessStories from './sections/SuccessStories';
import CallToAction from './sections/CallToAction';
import Banner from './sections/Banner';
import KeyHighlights from './sections/KeyHighlights';
import HowItWorks from './sections/HowItWorks';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Import and render all sections */}
      <Banner></Banner>

      <KeyHighlights />
      <HowItWorks />
      <ExploreCareerPaths />
      <FeaturedJobs />
      <TrustedCompanies />
      <CareerTools />
      <SuccessStories />
      <CallToAction />
    </div>
  );
};

export default HomePage;
