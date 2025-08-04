import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { 
  Heart, 
  Users, 
  Target, 
  BookOpen, 
  ArrowRight, 
  Star,
  Sparkles,
  Calendar,
  TrendingUp
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Heart,
      title: 'ختم‌های معنوی',
      description: 'ایجاد و مشارکت در ختم‌های صلوات با نیت‌های معنوی',
      color: 'from-green-500 to-emerald-500',
      delay: 0.1
    },
    {
      icon: Users,
      title: 'مشارکت جمعی',
      description: 'همکاری در اعمال خیر و معنوی با دیگران',
      color: 'from-blue-500 to-cyan-500',
      delay: 0.2
    },
    {
      icon: BookOpen,
      title: 'محتوای مذهبی',
      description: 'دسترسی به دعاها، احادیث و آداب معنوی',
      color: 'from-purple-500 to-pink-500',
      delay: 0.3
    },
    {
      icon: Target,
      title: 'پیگیری پیشرفت',
      description: 'مشاهده آمار و گزارش‌های دقیق مشارکت',
      color: 'from-orange-500 to-red-500',
      delay: 0.4
    }
  ];

  const stats = [
    { number: '1000+', label: 'ختم تکمیل شده', icon: Heart },
    { number: '5000+', label: 'کاربر فعال', icon: Users },
    { number: '50K+', label: 'صلوات خوانده شده', icon: Target },
    { number: '100+', label: 'محتوای مذهبی', icon: BookOpen }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 islamic-pattern opacity-30"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-20 floating"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-full opacity-20 floating" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full opacity-20 floating" style={{ animationDelay: '2s' }}></div>

        <motion.div 
          className="relative z-10 text-center py-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-2xl pulse-glow">
                  <Heart className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-hero">
              سفره صلوات
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              پلتفرم معنوی برای اجرای ختم‌های صلوات و نذرهای مذهبی. 
              به جمع معنوی ما بپیوندید و در اعمال خیر مشارکت کنید.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <>
                <Link to="/create-prayer" className="btn-primary text-lg px-8 py-4 group">
                  <span>ایجاد ختم جدید</span>
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/prayers" className="btn-outline text-lg px-8 py-4">
                  مشاهده ختم‌ها
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-4 group">
                  <span>شروع کنید</span>
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="btn-outline text-lg px-8 py-4">
                  ورود
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="card text-center hover-lift"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${index === 0 ? 'from-green-500 to-emerald-500' : index === 1 ? 'from-blue-500 to-cyan-500' : index === 2 ? 'from-purple-500 to-pink-500' : 'from-orange-500 to-red-500'} rounded-xl flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gradient mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gradient">ویژگی‌های پلتفرم</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              امکانات متنوع و کاربردی برای تجربه‌ای معنوی و کاربردی
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="card-hover text-center group"
                  style={{ transitionDelay: `${feature.delay}s` }}
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <motion.div
          className="card-dark text-center relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">
              آماده شروع سفر معنوی خود هستید؟
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              به جمع هزاران کاربر معنوی ما بپیوندید و در اعمال خیر مشارکت کنید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link to="/prayers" className="btn-primary text-lg px-8 py-4 group">
                  <span>مشاهده ختم‌ها</span>
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-4 group">
                    <span>ثبت‌نام رایگان</span>
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/content" className="btn-outline text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10">
                    محتوای مذهبی
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="card-hover text-center group">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">ختم‌های فعال</h3>
            <p className="text-gray-600 mb-4">مشاهده و مشارکت در ختم‌های در حال اجرا</p>
            <Link to="/prayers" className="btn-ghost">
              مشاهده ختم‌ها
              <ArrowRight className="w-4 h-4 mr-1" />
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="card-hover text-center group">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">محتوای مذهبی</h3>
            <p className="text-gray-600 mb-4">دسترسی به دعاها، احادیث و آداب معنوی</p>
            <Link to="/content" className="btn-ghost">
              مشاهده محتوا
              <ArrowRight className="w-4 h-4 mr-1" />
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="card-hover text-center group">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">آمار و گزارش</h3>
            <p className="text-gray-600 mb-4">پیگیری پیشرفت و آمار مشارکت‌های خود</p>
            <Link to="/profile" className="btn-ghost">
              مشاهده پروفایل
              <ArrowRight className="w-4 h-4 mr-1" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home; 