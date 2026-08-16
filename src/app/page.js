import HomeHeader from '@/components/home/HomeHeader';
import HeroSection from '@/components/home/HeroSection';
import ContentSection from '@/components/home/ContentSection';
import HomeFooter from '@/components/home/HomeFooter';

export default function Home() {
  return (
    <div id="app" className="app-container">
      <div className="ambient-bg">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      <HomeHeader />
      <HeroSection />
      <ContentSection />
      <HomeFooter />
    </div>
  );
}
