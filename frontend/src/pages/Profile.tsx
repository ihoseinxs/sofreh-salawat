import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { userAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { 
  User,
  Mail,
  Phone,
  Calendar,
  Target,
  Users,
  Award,
  Edit,
  Save,
  X,
  Heart,
  TrendingUp,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
}

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch user stats
  const { data: statsData, isLoading: statsLoading } = useQuery(
    ['user-stats'],
    () => userAPI.getUserStats(),
    { enabled: !!user }
  );

  // Fetch user participations
  const { data: participationsData, isLoading: participationsLoading } = useQuery(
    ['user-participations'],
    () => userAPI.getUserParticipations(),
    { enabled: !!user }
  );

  const stats = statsData?.data?.stats;
  const participations = participationsData?.data?.participations || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      await updateProfile(data);
      setIsEditing(false);
      toast.success('پروفایل با موفقیت بروزرسانی شد');
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">نیاز به ورود</h3>
          <p className="text-gray-600">
            برای مشاهده پروفایل باید ابتدا وارد حساب کاربری خود شوید
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">پروفایل کاربری</h1>
          <p className="text-gray-600">مدیریت اطلاعات شخصی و مشاهده آمار</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-outline flex items-center space-x-2 space-x-reverse"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          <span>{isEditing ? 'انصراف' : 'ویرایش'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">اطلاعات شخصی</h2>
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    نام و نام خانوادگی
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('name', { required: 'نام الزامی است' })}
                      type="text"
                      id="name"
                      className="input pr-10"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    ایمیل
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('email', {
                        required: 'ایمیل الزامی است',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'ایمیل معتبر نیست',
                        },
                      })}
                      type="email"
                      id="email"
                      className="input pr-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    شماره تلفن (اختیاری)
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('phone')}
                      type="tel"
                      id="phone"
                      className="input pr-10"
                      placeholder="09123456789"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-outline flex-1"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">نام و نام خانوادگی</div>
                    <div className="font-medium">{user.name}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">ایمیل</div>
                    <div className="font-medium">{user.email}</div>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">شماره تلفن</div>
                      <div className="font-medium">{user.phone}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">تاریخ عضویت</div>
                    <div className="font-medium">{formatDate(user.createdAt)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Participations */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">مشارکت‌های اخیر</h2>
            {participationsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">در حال بارگذاری...</p>
              </div>
            ) : participations.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">هنوز در هیچ ختمی مشارکت نکرده‌اید</p>
              </div>
            ) : (
              <div className="space-y-4">
                {participations.slice(0, 5).map((participation) => (
                  <div key={participation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Heart className="w-5 h-5 text-primary-600" />
                      <div>
                        <div className="font-medium">{participation.prayer?.title}</div>
                        <div className="text-sm text-gray-500">
                          {participation.count} صلوات
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(participation.date)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* User Stats */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">آمار فعالیت</h2>
            {statsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">در حال بارگذاری...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Target className="w-5 h-5 text-green-600" />
                    <span className="text-gray-600">کل صلوات</span>
                  </div>
                  <span className="font-bold text-lg">{stats?.totalPrayers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-600">مشارکت‌ها</span>
                  </div>
                  <span className="font-bold text-lg">{stats?.totalParticipations || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <span className="text-gray-600">ختم‌های تکمیل شده</span>
                  </div>
                  <span className="font-bold text-lg">{stats?.completedPrayers || 0}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">آمار سریع</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary-600">
                  {stats?.totalPrayers || 0}
                </div>
                <div className="text-sm text-gray-600">صلوات</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {stats?.totalParticipations || 0}
                </div>
                <div className="text-sm text-gray-600">مشارکت</div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">وضعیت حساب</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">نوع حساب</span>
                <span className="font-medium">{user.role === 'ADMIN' ? 'مدیر' : 'کاربر'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">وضعیت</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'فعال' : 'غیرفعال'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 