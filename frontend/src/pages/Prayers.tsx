import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { prayerAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Target, 
  Calendar, 
  Heart,
  Eye,
  Play,
  Share2
} from 'lucide-react';
import { Prayer } from '../types';

const Prayers = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  // Fetch prayers
  const { data: prayersData, isLoading, error } = useQuery(
    ['prayers', { status: statusFilter, sort: sortBy }],
    () => prayerAPI.getPrayers({ status: statusFilter === 'all' ? undefined : statusFilter })
  );

  const prayers = prayersData?.data?.prayers || [];

  // Filter prayers based on search term
  const filteredPrayers = prayers.filter((prayer: Prayer) =>
    prayer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prayer.intention.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'فعال';
      case 'COMPLETED':
        return 'تکمیل شده';
      case 'PAUSED':
        return 'متوقف';
      case 'CANCELLED':
        return 'لغو شده';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری ختم‌ها...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">خطا در بارگذاری ختم‌ها</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">ختم‌های صلوات</h1>
          <p className="text-gray-600">مشاهده و مشارکت در ختم‌های معنوی</p>
        </div>
        {user && (
          <Link to="/create-prayer" className="btn-primary flex items-center space-x-2 space-x-reverse">
            <Plus className="w-5 h-5" />
            <span>ایجاد ختم جدید</span>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="جستجو در ختم‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pr-10"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="ACTIVE">فعال</option>
              <option value="COMPLETED">تکمیل شده</option>
              <option value="PAUSED">متوقف</option>
              <option value="CANCELLED">لغو شده</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
            >
              <option value="latest">جدیدترین</option>
              <option value="oldest">قدیمی‌ترین</option>
              <option value="progress">پیشرفت</option>
              <option value="participants">تعداد مشارکت‌کنندگان</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prayers Grid */}
      {filteredPrayers.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">ختمی یافت نشد</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'هیچ ختمی با فیلترهای انتخابی یافت نشد'
              : 'هنوز هیچ ختمی ایجاد نشده است'
            }
          </p>
          {user && (
            <Link to="/create-prayer" className="btn-primary">
              ایجاد اولین ختم
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrayers.map((prayer: Prayer) => (
            <motion.div
              key={prayer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card-hover group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-primary-600 transition-colors">
                    {prayer.title}
                  </h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prayer.status)}`}>
                    {getStatusText(prayer.status)}
                  </span>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <Link to={`/prayers/${prayer.id}`} className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Intention */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {prayer.intention}
              </p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">پیشرفت</span>
                  <span className="font-medium">
                    {prayer.currentCount} / {prayer.targetCount}
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculateProgress(prayer.currentCount, prayer.targetCount)}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 text-center text-sm">
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="font-medium">{prayer.prayerStats?.totalParticipants || 0}</div>
                  <div className="text-gray-500 text-xs">مشارکت‌کننده</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Target className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="font-medium">{prayer.targetCount}</div>
                  <div className="text-gray-500 text-xs">هدف</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="font-medium">{formatDate(prayer.startDate)}</div>
                  <div className="text-gray-500 text-xs">شروع</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 space-x-reverse">
                <Link 
                  to={`/prayers/${prayer.id}`}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <Play className="w-4 h-4" />
                  <span>مشارکت</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prayers; 