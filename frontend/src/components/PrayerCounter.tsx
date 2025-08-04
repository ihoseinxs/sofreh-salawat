import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import toast from 'react-hot-toast';

interface PrayerCounterProps {
  prayerId: string;
  onCountChange: (count: number) => void;
  isActive?: boolean;
}

const PrayerCounter = ({ prayerId, onCountChange, isActive = true }: PrayerCounterProps) => {
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [interval, setInterval] = useState(2000); // 2 seconds default
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Salawat audio URL (you can replace with actual audio file)
  const salawatAudio = '/audio/salawat.mp3'; // Placeholder

  useEffect(() => {
    if (autoPlay && isActive) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return () => {
      stopAutoPlay();
    };
  }, [autoPlay, isActive, interval]);

  const startAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      handleCount();
    }, interval);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleCount = () => {
    if (!isActive) return;

    setCount(prev => {
      const newCount = prev + 1;
      onCountChange(newCount);
      
      // Play audio if not muted
      if (!isMuted && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // Audio play failed, continue without audio
        });
      }

      return newCount;
    });
  };

  const handleManualCount = () => {
    handleCount();
    toast.success('صلوات شمرده شد');
  };

  const resetCount = () => {
    setCount(0);
    onCountChange(0);
    toast.success('شمارنده ریست شد');
  };

  const toggleAutoPlay = () => {
    if (autoPlay) {
      setAutoPlay(false);
      toast.success('شمارش خودکار متوقف شد');
    } else {
      setAutoPlay(true);
      toast.success('شمارش خودکار شروع شد');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.success(isMuted ? 'صوت فعال شد' : 'صوت غیرفعال شد');
  };

  const changeInterval = (newInterval: number) => {
    setInterval(newInterval);
    toast.success(`فاصله زمانی به ${newInterval / 1000} ثانیه تغییر کرد`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      {/* Audio Element */}
      <audio ref={audioRef} src={salawatAudio} preload="auto" />
      
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">شمارشگر صلوات</h3>
        <p className="text-gray-600">برای شمارش صلوات کلیک کنید یا از حالت خودکار استفاده کنید</p>
      </div>

      {/* Counter Display */}
      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-primary-600 mb-2">{count}</div>
        <div className="text-lg text-gray-600">صلوات</div>
      </div>

      {/* Manual Count Button */}
      <div className="text-center mb-6">
        <button
          onClick={handleManualCount}
          disabled={!isActive}
          className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          صلوات بفرست
        </button>
      </div>

      {/* Auto Play Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-4 space-x-reverse">
          <button
            onClick={toggleAutoPlay}
            className={`btn-outline flex items-center space-x-2 space-x-reverse ${
              autoPlay ? 'bg-primary-100 text-primary-700' : ''
            }`}
          >
            {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{autoPlay ? 'توقف خودکار' : 'شروع خودکار'}</span>
          </button>

          <button
            onClick={toggleMute}
            className="btn-outline flex items-center space-x-2 space-x-reverse"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isMuted ? 'فعال کردن صدا' : 'غیرفعال کردن صدا'}</span>
          </button>
        </div>

        {/* Interval Control */}
        {autoPlay && (
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              فاصله زمانی (ثانیه)
            </label>
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              {[1, 2, 3, 5].map((seconds) => (
                <button
                  key={seconds}
                  onClick={() => changeInterval(seconds * 1000)}
                  className={`px-3 py-1 rounded ${
                    interval === seconds * 1000
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {seconds}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetCount}
            className="btn-outline flex items-center space-x-2 space-x-reverse mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ریست شمارنده</span>
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="mt-4 text-center">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isActive ? 'bg-green-500' : 'bg-red-500'
          }`} />
          {isActive ? 'فعال' : 'غیرفعال'}
        </div>
      </div>
    </div>
  );
};

export default PrayerCounter; 