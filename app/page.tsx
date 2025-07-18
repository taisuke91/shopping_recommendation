import ShoppingRecommendation from './components/ShoppingRecommendation';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <main className="flex-1">
          <ShoppingRecommendation />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
