import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { prayerAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { 
  ArrowLeft,
  Heart,
  Users,
  Target,
  Calendar,
  Play,
  Pause,
  Share2,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Minus
} from 'lucide-react';
import toast from 'react-hot-toast';

const PrayerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showIntention, setShowIntention] = useState(false);
  const [participationCount, setParticipationCount] = useState(1);

  // Fetch prayer details
  const { data: prayerData, isLoading, error } = useQuery(
    ['prayer', id],
    () => prayerAPI.getPrayerById(id!),
    { enabled: !!id }
  );

  // Fetch prayer stats
  const { data: statsData } = useQuery(
    ['prayer-stats', id],
    () => prayerAPI.getPrayerStats(id!),
    { enabled: !!id }
  );

  const prayer = prayerData?.data?.prayer;
  const stats = statsData?.data?.stats;

  // Participation mutation
  const participateMutation = useMutation(
    (count: number) => prayerAPI.participateInPrayer(id!, { count }),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.success('مشارکت شما با موفقیت ثبت شد');
          queryClient.invalidateQueries(['prayer', id]);
          queryClient.invalidateQueries(['prayer-stats', id]);
        } else {
          toast.error(response.error || 'خطا در ثبت مشارکت');
        }
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'خطا در ثبت مشارکت');
      },
    }
  );

  const handleParticipate = async () => {
    if (!user) {
      toast.error('برای مشارکت باید ابتدا وارد شوید');
      navigate('/login');
      return;
    }

    await participateMutation.mutateAsync(participationCount);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('لینک کپی شد');
    } catch (error) {
      toast.error('خطا در کپی کردن لینک');
    }
  };

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
          <p className="text-gray-600">در حال بارگذاری جزئیات ختم...</p>
        </div>
      </div>
    );
  }

  if (error || !prayer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">ختم یافت نشد</h3>
          <p className="text-gray-600 mb-6">
            ختم مورد نظر وجود ندارد یا حذف شده است
          </p>
          <button 
            onClick={() => navigate('/prayers')} 
            className="btn-primary"
          >
            بازگشت به لیست ختم‌ها
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4 space-x-reverse">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{prayer.title}</h1>
          <div className="flex items-center space-x-4 space-x-reverse">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prayer.status)}`}>
              {getStatusText(prayer.status)}
            </span>
            <span className="text-gray-500 text-sm">
              ایجاد شده توسط {prayer.creator.name}
            </span>
          </div>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={copyToClipboard}
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            title="کپی لینک"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            title="اشتراک‌گذاری"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Intention */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center space-x-2 space-x-reverse">
                <Heart className="w-5 h-5 text-primary-600" />
                <span>نیت ختم</span>
              </h2>
              <button
                onClick={() => setShowIntention(!showIntention)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showIntention ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className={`transition-all duration-300 ${showIntention ? 'opacity-100' : 'opacity-50 blur-sm'}`}>
              <p className="text-gray-700 leading-relaxed">{prayer.intention}</p>
            </div>
            {!showIntention && (
              <p className="text-sm text-gray-500 mt-2">
                برای مشاهده نیت کلیک کنید
              </p>
            )}
          </div>

          {/* Description */}
          {prayer.description && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">توضیحات</h2>
              <p className="text-gray-700 leading-relaxed">{prayer.description}</p>
            </div>
          )}

          {/* Progress */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">پیشرفت ختم</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">پیشرفت کلی</span>
                <span className="font-bold text-lg">
                  {prayer.currentCount} / {prayer.targetCount}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${calculateProgress(prayer.currentCount, prayer.targetCount)}%` }}
                ></div>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-primary-600">
                  {calculateProgress(prayer.currentCount, prayer.targetCount).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Participation */}
          {prayer.status === 'ACTIVE' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">مشارکت در ختم</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4 space-x-reverse">
                  <button
                    onClick={() => setParticipationCount(Math.max(1, participationCount - 1))}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">{participationCount}</div>
                    <div className="text-sm text-gray-500">صلوات</div>
                  </div>
                  <button
                    onClick={() => setParticipationCount(participationCount + 1)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleParticipate}
                  disabled={participateMutation.isLoading}
                  className="btn-primary w-full py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {participateMutation.isLoading ? 'در حال ثبت...' : 'ثبت مشارکت'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">آمار ختم</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">مشارکت‌کنندگان</span>
                </div>
                <span className="font-bold">{stats?.totalParticipants || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">هدف</span>
                </div>
                <span className="font-bold">{prayer.targetCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-600">شروع</span>
                </div>
                <span className="font-bold">{formatDate(prayer.startDate)}</span>
              </div>
              {prayer.endDate && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-600">پایان</span>
                  </div>
                  <span className="font-bold">{formatDate(prayer.endDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Creator Info */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">ایجادکننده</h2>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-lg">
                  {prayer.creator.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium">{prayer.creator.name}</div>
                <div className="text-sm text-gray-500">{prayer.creator.email}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {user && prayer.createdBy === user.id && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">مدیریت ختم</h2>
              <div className="space-y-3">
                <button className="btn-outline w-full">
                  <Pause className="w-4 h-4 ml-2" />
                  توقف ختم
                </button>
                <button className="btn-outline w-full text-red-600 hover:text-red-700">
                  لغو ختم
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrayerDetail; 