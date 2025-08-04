import { useState } from 'react';
import { Share2, Copy, Link, MessageCircle, Twitter, Facebook, Instagram, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

interface SharePrayerProps {
  prayerId: string;
  prayerTitle: string;
  prayerIntention: string;
  currentCount: number;
  targetCount: number;
}

const SharePrayer = ({ prayerId, prayerTitle, prayerIntention, currentCount, targetCount }: SharePrayerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/prayers/${prayerId}`;
  const shareText = `ختم صلوات: ${prayerTitle}\nنیت: ${prayerIntention}\nپیشرفت: ${currentCount}/${targetCount} صلوات\n\nمشارکت کنید: ${shareUrl}`;

  const shareOptions = [
    {
      name: 'واتساپ',
      icon: MessageSquare,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
        toast.success('واتساپ باز شد');
      }
    },
    {
      name: 'تلگرام',
      icon: MessageCircle,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(telegramUrl, '_blank');
        toast.success('تلگرام باز شد');
      }
    },
    {
      name: 'توییتر',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(twitterUrl, '_blank');
        toast.success('توییتر باز شد');
      }
    },
    {
      name: 'فیسبوک',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(facebookUrl, '_blank');
        toast.success('فیسبوک باز شد');
      }
    },
    {
      name: 'اینستاگرام',
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      action: () => {
        // Instagram doesn't support direct sharing via URL, so we copy the text
        navigator.clipboard.writeText(shareText);
        toast.success('متن کپی شد - در اینستاگرام پیست کنید');
      }
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('لینک کپی شد');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('خطا در کپی کردن لینک');
    }
  };

  const copyTextToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('متن کپی شد');
    } catch (error) {
      toast.error('خطا در کپی کردن متن');
    }
  };

  return (
    <div className="relative">
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-outline flex items-center space-x-2 space-x-reverse"
      >
        <Share2 className="w-4 h-4" />
        <span>اشتراک‌گذاری</span>
      </button>

      {/* Share Modal */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">اشتراک‌گذاری ختم</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Prayer Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-1">{prayerTitle}</h4>
            <p className="text-sm text-gray-600 mb-2">{prayerIntention}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">پیشرفت:</span>
              <span className="font-medium text-primary-600">
                {currentCount} / {targetCount} صلوات
              </span>
            </div>
          </div>

          {/* Social Media Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.action}
                className={`flex items-center justify-center space-x-2 space-x-reverse p-3 rounded-lg text-white transition-colors ${option.color}`}
              >
                <option.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{option.name}</span>
              </button>
            ))}
          </div>

          {/* Copy Options */}
          <div className="space-y-2">
            <button
              onClick={copyToClipboard}
              className="w-full btn-outline flex items-center justify-center space-x-2 space-x-reverse"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'کپی شد!' : 'کپی لینک'}</span>
            </button>
            
            <button
              onClick={copyTextToClipboard}
              className="w-full btn-outline flex items-center justify-center space-x-2 space-x-reverse"
            >
              <Link className="w-4 h-4" />
              <span>کپی متن کامل</span>
            </button>
          </div>

          {/* QR Code Placeholder */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Link className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">QR Code (در نسخه بعدی)</p>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SharePrayer; 