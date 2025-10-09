import React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import { 
  BannerSlider,
  MasterCategory,
  NewArrivals,
  StaticTextSection,
  Static2Section
} from '../components';

const HomePage = () => {
  return (
    <>
      <ErrorBoundary>
        <BannerSlider />
      </ErrorBoundary>
      <StaticTextSection />
      <ErrorBoundary>
        <MasterCategory />
      </ErrorBoundary>
      <ErrorBoundary>
        <NewArrivals 
          title="NEW ARRIVALS" 
          subtitle="Nemo enim ipsam voluptatem quia voluptas sit aspernatur"
          limit={8}
          sortNewest={true}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <Static2Section />
      </ErrorBoundary>
      <ErrorBoundary>
        <NewArrivals 
          title="YOU MIGHT LIKE" 
          subtitle="Nemo enim ipsam voluptatem quia voluptas sit aspernatur" 
          limit={8}
          sortNewest={false}
        />
      </ErrorBoundary>
    </>
  );
};

export default HomePage;