import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { contentAPI } from '../services/api';
import { ReligiousContent } from '../types';
import { 
  BookOpen, 
  Play, 
  Download, 
  Search,
  Heart,
  Calendar
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
  const [content, setContent] = useState<ReligiousContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch religious content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const response = await contentAPI.getReligiousContent({ 
          type: selectedType === 'ALL' ? undefined : selectedType 
        });
        if (response.success && response.data) {
          setContent(response.data.content);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        toast.error('خطا در بارگذاری محتوا');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [selectedType]);

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

  const handleAudioPlay = (itemId: string) => {
    if (playingAudio === itemId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(itemId);
      toast.success('پخش صوتی شروع شد');
    }
  };

  const handleDownload = () => {
    toast.success('دانلود شروع شد');
  };

  const handleShare = (item: ContentItem) => {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">در حال بارگذاری...</h3>
          <p className="text-gray-600">لطفاً صبر کنید</p>
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
                  
                  <div className="flex items-center space-x-1 space-x-reverse">
                    {item.audioUrl && (
                      <button
                        onClick={() => handleAudioPlay(item.id)}
                        className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                        title={playingAudio === item.id ? 'توقف' : 'پخش'}
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleShare(item)}
                      className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                      title="اشتراک‌گذاری"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.content.length > 150 
                      ? item.content.substring(0, 150) + '...'
                      : item.content
                    }
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  
                  {item.author && (
                    <span className="text-xs text-gray-500">
                      {item.author}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => handleDownload()}
                    className="btn-outline flex-1 flex items-center justify-center space-x-2 space-x-reverse text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>دانلود</span>
                  </button>
                  
                  <button
                    onClick={() => handleShare(item)}
                    className="btn-outline flex-1 flex items-center justify-center space-x-2 space-x-reverse text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>اشتراک</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Content; 