import BannerSlider from '../components/home/BannerSlider';
import Layout from '../components/layout/Layout'
import ProductSection from '../components/home/ProductSection';
import CategorySection from '../components/home/CategorySection';
import SupportInfo from '../components/home/SupportInfo';
import AppDownload from '../components/home/AppDownload';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Home() {
  return (
    <Layout>
      <ErrorBoundary>
        <ProductSection 
         title="پر تخفیف‌ترین‌ها" 
         label="discounted" 
        />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <BannerSlider />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <CategorySection />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <ProductSection 
          title="پرفروش‌ترین‌ها" 
          label="bestseller" 
        />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <ProductSection  
          title="پیشنهادهای ویژه" 
          label="recommended" 
        />
      </ErrorBoundary>
      
      <SupportInfo />
      {/* <AppDownload /> */}
    </Layout>
  );
}