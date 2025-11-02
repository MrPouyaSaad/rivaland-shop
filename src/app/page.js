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
      <main>
        <h1 className="sr-only">
          فروشگاه اینترنتی سایرون | خرید آنلاین لوازم جانبی موبایل و کامپیوتر
        </h1>

        <ErrorBoundary>
          <ProductSection title="پر تخفیف‌ترین‌ها" label="discounted" />
        </ErrorBoundary>

        <ErrorBoundary>
          <BannerSlider />
        </ErrorBoundary>

        <ErrorBoundary>
          <CategorySection />
        </ErrorBoundary>

        <ErrorBoundary>
          <ProductSection title="پرفروش‌ترین‌ها" label="bestseller" />
        </ErrorBoundary>

        <ErrorBoundary>
          <ProductSection title="پیشنهادهای ویژه" label="recommended" />
        </ErrorBoundary>

        <SupportInfo />

        <section className="container mx-auto mt-8 px-4">
          <h2 className="text-xl font-bold mb-2">فروشگاه اینترنتی سایرون</h2>
          <p>
            فروشگاه اینترنتی سایرون با هدف ارائه‌ی جدیدترین لوازم جانبی موبایل، کامپیوتر و گجت‌های هوشمند فعالیت می‌کند.
            ما تلاش می‌کنیم با قیمت مناسب، ضمانت اصالت کالا و ارسال سریع، تجربه‌ای مطمئن از خرید آنلاین را برای شما فراهم کنیم.
          </p>
        </section>
      </main>
    </Layout>
  );
}

