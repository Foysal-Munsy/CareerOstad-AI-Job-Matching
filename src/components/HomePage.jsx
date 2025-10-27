import React from "react";
import ExploreCareerPaths from "./sections/ExploreCareerPaths";
import FeaturedJobs from "./sections/FeaturedJobs";
import TrustedCompanies from "./sections/TrustedCompanies";
import CareerTools from "./sections/CareerTools";
import SuccessStories from "./sections/SuccessStories";
import CallToAction from "./sections/CallToAction";
import Banner from "./sections/Banner";
import KeyHighlights from "./sections/KeyHighlights";
import HowItWorks from "./sections/HowItWorks";
import HomepageVerification from "./verification/HomepageVerification";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white-800">
      {/* Import and render all sections */}
      <Banner></Banner>
      <KeyHighlights />
      <HowItWorks />
      <FeaturedJobs />
      <ExploreCareerPaths />
      <HomepageVerification />
      <TrustedCompanies />

      {/* <CareerTools /> */}
      {/* <SuccessStories /> */}
      {/* <CallToAction /> */}
    </div>
  );
};

export default HomePage;
