import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram,
  Youtube,
  BookOpen,
  Users,
  Target
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'خانه', href: '/' },
    { name: 'ختم‌های صلوات', href: '/prayers' },
    { name: 'محتوای مذهبی', href: '/content' },
    { name: 'ثبت‌نام', href: '/register' },
    { name: 'ورود', href: '/login' },
  ];

  const features = [
    { name: 'ختم‌های معنوی', icon: Heart, description: 'ایجاد و مشارکت در ختم‌های صلوات' },
    { name: 'محتوای مذهبی', icon: BookOpen, description: 'دعاها، احادیث و آداب معنوی' },
    { name: 'مشارکت جمعی', icon: Users, description: 'همکاری در اعمال خیر مذهبی' },
    { name: 'آمار و گزارش', icon: Target, description: 'پیگیری پیشرفت و آمار مشارکت' },
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Youtube', href: '#', icon: Youtube },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">سفره صلوات</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              پلتفرم معنوی برای اجرای ختم‌های صلوات و نذرهای مذهبی. 
              به جمع معنوی ما بپیوندید و در اعمال خیر مشارکت کنید.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:text-primary-400 hover:bg-gray-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ویژگی‌ها</h3>
            <ul className="space-y-3">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <li key={feature.name} className="flex items-start space-x-3 space-x-reverse">
                    <IconComponent className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-200">{feature.name}</div>
                      <div className="text-sm text-gray-400">{feature.description}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ارتباط با ما</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">info@sofrehsalawat.ir</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">۰۲۱-۱۲۳۴۵۶۷۸</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">تهران، ایران</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} سفره صلوات. تمامی حقوق محفوظ است.
            </div>
            <div className="flex space-x-6 space-x-reverse text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                حریم خصوصی
              </Link>
              <Link to="/terms" className="hover:text-primary-400 transition-colors">
                شرایط استفاده
              </Link>
              <Link to="/about" className="hover:text-primary-400 transition-colors">
                درباره ما
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 