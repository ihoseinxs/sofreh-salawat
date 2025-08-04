import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { contentAPI } from '../services/api';
import { 
  BookOpen,
  Heart,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Filter,
  Search,
  Calendar,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

type ContentType = 'DUA' | 'HADITH' | 'SALAWAT_TEXT' | 'SALAWAT_AUDIO' | 'ETIQUETTE';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: ContentType;
  audioUrl?: string;
  author?: string;
  source?: string;
  createdAt: string;
}

const Content = () => {
  const [selectedType, setSelectedType] = useState<ContentType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState(0.7);

  // Fetch religious content
  const { data: contentData, isLoading, error } = useQuery(
    ['religious-content', selectedType],
    () => contentAPI.getReligiousContent({ type: selectedType === 'ALL' ? undefined : selectedType }),
    { enabled: true }
  );

  const content = contentData?.data?.content || [];

  // Filter content based on search term
  const filteredContent = content.filter((item: ContentItem) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeInfo = (type: ContentType) => {
    switch (type) {
      case 'DUA':
        return { label: 'دعا', icon: Heart, color: 'text-green-600', bgColor: 'bg-green-50' };
      case 'HADITH':
        return { label: 'حدیث', icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-50' };
      case 'SALAWAT_TEXT':
        return { label: 'متن صلوات', icon: Heart, color: 'text-purple-600', bgColor: 'bg-purple-50' };
      case 'SALAWAT_AUDIO':
        return { label: 'صوت صلوات', icon: Play, color: 'text-orange-600', bgColor: 'bg-orange-50' };
      case 'ETIQUETTE':
        return { label: 'آداب', icon: BookOpen, color: 'text-indigo-600', bgColor: 'bg-indigo-50' };
      default:
        return { label: type, icon: BookOpen, color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  const handleAudioPlay = (audioUrl: string, itemId: string) => {
    if (playingAudio === itemId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(itemId);
      // Here you would implement actual audio playback
      toast.success('پخش صوتی شروع شد');
    }
  };

  const handleDownload = (item: ContentItem) => {
    // Here you would implement actual download functionality
    toast.success('دانلود شروع شد');
  };

  const handleShare = (item: ContentItem) => {
    // Here you would implement actual share functionality
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(item.content);
      toast.success('محتوا کپی شد');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری محتوا...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">خطا در بارگذاری</h3>
          <p className="text-gray-600 mb-6">
            خطا در بارگذاری محتوای مذهبی
          </p>
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
      <div>
        <h1 className="text-3xl font-bold mb-2">محتوای مذهبی</h1>
        <p className="text-gray-600">مجموعه‌ای از دعاها، احادیث و آداب معنوی</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="جستجو در محتوا..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pr-10"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ContentType | 'ALL')}
              className="input"
            >
              <option value="ALL">همه محتوا</option>
              <option value="DUA">دعاها</option>
              <option value="HADITH">احادیث</option>
              <option value="SALAWAT_TEXT">متون صلوات</option>
              <option value="SALAWAT_AUDIO">صوت صلوات</option>
              <option value="ETIQUETTE">آداب</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {filteredContent.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">محتوا یافت نشد</h3>
          <p className="text-gray-600">
            {searchTerm || selectedType !== 'ALL' 
              ? 'هیچ محتوایی با فیلترهای انتخابی یافت نشد'
              : 'هنوز محتوایی اضافه نشده است'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item: ContentItem) => {
            const typeInfo = getTypeInfo(item.type);
            const IconComponent = typeInfo.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="card-hover group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
                      <IconComponent className={`w-5 h-5 ${typeInfo.color}`} />
                    </div>
                    <span className={`text-sm font-medium ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                  <div className="flex space-x-1 space-x-reverse">
                    {item.audioUrl && (
                      <button
                        onClick={() => handleAudioPlay(item.audioUrl!, item.id)}
                        className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                        title={playingAudio === item.id ? 'توقف' : 'پخش'}
                      >
                        {playingAudio === item.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleShare(item)}
                      className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                      title="اشتراک‌گذاری"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>

                {/* Content */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed line-clamp-4">
                    {item.content}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="space-y-2 text-sm text-gray-500">
                  {item.author && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <User className="w-4 h-4" />
                      <span>{item.author}</span>
                    </div>
                  )}
                  {item.source && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <BookOpen className="w-4 h-4" />
                      <span>{item.source}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 space-x-reverse mt-4 pt-4 border-t border-gray-100">
                  {item.audioUrl && (
                    <button
                      onClick={() => handleDownload(item)}
                      className="btn-outline flex-1 flex items-center justify-center space-x-2 space-x-reverse text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>دانلود</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleShare(item)}
                    className="btn-outline flex-1 flex items-center justify-center space-x-2 space-x-reverse text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>اشتراک</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Audio Controls (if any audio is playing) */}
      {playingAudio && (
        <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => setPlayingAudio(null)}
                className="p-2 bg-primary-100 rounded-full text-primary-600 hover:bg-primary-200 transition-colors"
              >
                <Pause className="w-5 h-5" />
              </button>
              <div>
                <div className="font-medium">در حال پخش صوتی</div>
                <div className="text-sm text-gray-500">صلوات شریف</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <VolumeX className="w-4 h-4 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={audioVolume}
                  onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                  className="w-20"
                />
                <Volume2 className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content; 