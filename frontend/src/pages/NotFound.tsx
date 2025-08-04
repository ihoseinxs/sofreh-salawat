import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl md:text-8xl font-bold text-primary-600 mb-4">404</div>
        <h1 className="text-2xl md:text-3xl font-semibold mb-4">صفحه مورد نظر یافت نشد</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center justify-center space-x-2 space-x-reverse">
            <Home className="w-5 h-5" />
            <span>بازگشت به خانه</span>
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn-outline flex items-center justify-center space-x-2 space-x-reverse"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>بازگشت</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 