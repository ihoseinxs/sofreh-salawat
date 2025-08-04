import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { prayerAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { 
  Heart, 
  Target, 
  Calendar, 
  FileText, 
  Eye, 
  Users,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CreatePrayerFormData {
  title: string;
  description?: string;
  intention: string;
  targetCount: number;
  startDate: string;
  endDate?: string;
  isPublic: boolean;
}

const CreatePrayer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreatePrayerFormData>({
    defaultValues: {
      isPublic: true,
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  const createPrayerMutation = useMutation(
    (data: CreatePrayerFormData) => prayerAPI.createPrayer(data),
    {
      onSuccess: (response) => {
        if (response.success) {
          toast.success('ختم با موفقیت ایجاد شد');
          queryClient.invalidateQueries(['prayers']);
          navigate(`/prayers/${response.data?.prayer.id}`);
        } else {
          toast.error(response.error || 'خطا در ایجاد ختم');
        }
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'خطا در ایجاد ختم');
      },
    }
  );

  const onSubmit = async (data: CreatePrayerFormData) => {
    setLoading(true);
    try {
      await createPrayerMutation.mutateAsync(data);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">نیاز به ورود</h3>
          <p className="text-gray-600 mb-6">
            برای ایجاد ختم باید ابتدا وارد حساب کاربری خود شوید
          </p>
          <button 
            onClick={() => navigate('/login')} 
            className="btn-primary"
          >
            ورود
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4 space-x-reverse">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold mb-2">ایجاد ختم صلوات</h1>
          <p className="text-gray-600">ختم معنوی جدید خود را ایجاد کنید</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* عنوان ختم */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                عنوان ختم *
              </label>
              <div className="relative">
                <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('title', { 
                    required: 'عنوان ختم الزامی است',
                    minLength: {
                      value: 3,
                      message: 'عنوان باید حداقل 3 کاراکتر باشد'
                    }
                  })}
                  type="text"
                  id="title"
                  className="input pr-10"
                  placeholder="مثال: ختم صلوات برای سلامتی خانواده"
                />
              </div>
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* توضیحات */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات (اختیاری)
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={3}
                className="input resize-none"
                placeholder="توضیحات بیشتری درباره ختم خود بنویسید..."
              />
            </div>

            {/* نیت ختم */}
            <div>
              <label htmlFor="intention" className="block text-sm font-medium text-gray-700 mb-2">
                نیت ختم *
              </label>
              <div className="relative">
                <Heart className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <textarea
                  {...register('intention', { 
                    required: 'نیت ختم الزامی است',
                    minLength: {
                      value: 10,
                      message: 'نیت باید حداقل 10 کاراکتر باشد'
                    }
                  })}
                  id="intention"
                  rows={3}
                  className="input pr-10 resize-none"
                  placeholder="نیت خود را برای این ختم بنویسید..."
                />
              </div>
              {errors.intention && (
                <p className="text-red-500 text-sm mt-1">{errors.intention.message}</p>
              )}
            </div>

            {/* تعداد هدف */}
            <div>
              <label htmlFor="targetCount" className="block text-sm font-medium text-gray-700 mb-2">
                تعداد هدف صلوات *
              </label>
              <div className="relative">
                <Target className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('targetCount', { 
                    required: 'تعداد هدف الزامی است',
                    min: {
                      value: 1,
                      message: 'تعداد باید حداقل 1 باشد'
                    },
                    max: {
                      value: 1000000,
                      message: 'تعداد نمی‌تواند بیشتر از 1,000,000 باشد'
                    }
                  })}
                  type="number"
                  id="targetCount"
                  className="input pr-10"
                  placeholder="مثال: 1000"
                />
              </div>
              {errors.targetCount && (
                <p className="text-red-500 text-sm mt-1">{errors.targetCount.message}</p>
              )}
            </div>

            {/* تاریخ شروع */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                تاریخ شروع *
              </label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('startDate', { required: 'تاریخ شروع الزامی است' })}
                  type="date"
                  id="startDate"
                  className="input pr-10"
                />
              </div>
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
              )}
            </div>

            {/* تاریخ پایان */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                تاریخ پایان (اختیاری)
              </label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('endDate')}
                  type="date"
                  id="endDate"
                  className="input pr-10"
                />
              </div>
              <p className="text-gray-500 text-sm mt-1">
                اگر تاریخ پایان مشخص نکنید، ختم تا زمان تکمیل ادامه خواهد داشت
              </p>
            </div>

            {/* عمومی یا خصوصی */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع ختم
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                  <input
                    {...register('isPublic')}
                    type="radio"
                    value="true"
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">عمومی</div>
                      <div className="text-sm text-gray-500">همه کاربران می‌توانند مشارکت کنند</div>
                    </div>
                  </div>
                </label>
                <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                  <input
                    {...register('isPublic')}
                    type="radio"
                    value="false"
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">خصوصی</div>
                      <div className="text-sm text-gray-500">فقط شما و دعوت‌شدگان می‌توانند مشارکت کنند</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* دکمه‌ها */}
            <div className="flex space-x-4 space-x-reverse pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-outline flex-1"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'در حال ایجاد...' : 'ایجاد ختم'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePrayer; 