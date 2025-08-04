import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface PersianCalendarProps {
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

interface PersianDate {
  year: number;
  month: number;
  day: number;
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
}

const PersianCalendar = ({ onDateSelect, selectedDate }: PersianCalendarProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarDays, setCalendarDays] = useState<PersianDate[]>([]);

  // Persian month names
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  // Persian day names
  const persianDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];

  // Convert Gregorian to Persian date
  const gregorianToPersian = (date: Date): { year: number; month: number; day: number } => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Simple conversion (for accurate conversion, use a library like moment-jalaali)
    const persianYear = year - 621;
    const persianMonth = month > 3 ? month - 3 : month + 9;
    const persianDay = day + (month > 3 ? 0 : 30);

    return {
      year: persianYear,
      month: persianMonth,
      day: persianDay
    };
  };

  // Convert Persian to Gregorian date
  const persianToGregorian = (year: number, month: number, day: number): Date => {
    // Simple conversion (for accurate conversion, use a library like moment-jalaali)
    const gregorianYear = year + 621;
    const gregorianMonth = month > 9 ? month - 9 : month + 3;
    const gregorianDay = day - (month > 9 ? 0 : 30);

    return new Date(gregorianYear, gregorianMonth - 1, gregorianDay);
  };

  // Generate calendar days
  const generateCalendarDays = (date: Date): PersianDate[] => {
    const persianDate = gregorianToPersian(date);
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const firstDayPersian = gregorianToPersian(firstDayOfMonth);
    const lastDayPersian = gregorianToPersian(lastDayOfMonth);
    
    const today = gregorianToPersian(new Date());
    const selected = selectedDate ? gregorianToPersian(new Date(selectedDate)) : null;

    const days: PersianDate[] = [];

    // Add days from previous month
    const firstDayWeekday = firstDayOfMonth.getDay();
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const prevDate = new Date(firstDayOfMonth);
      prevDate.setDate(prevDate.getDate() - i - 1);
      const prevPersian = gregorianToPersian(prevDate);
      
      days.push({
        year: prevPersian.year,
        month: prevPersian.month,
        day: prevPersian.day,
        isToday: false,
        isSelected: false,
        isCurrentMonth: false
      });
    }

    // Add days of current month
    for (let day = 1; day <= lastDayPersian.day; day++) {
      const isToday = today.year === persianDate.year && 
                     today.month === persianDate.month && 
                     today.day === day;
      
      const isSelected = selected ? 
                        (selected.year === persianDate.year && 
                         selected.month === persianDate.month && 
                         selected.day === day) : false;

      days.push({
        year: persianDate.year,
        month: persianDate.month,
        day,
        isToday,
        isSelected,
        isCurrentMonth: true
      });
    }

    // Add days from next month
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(lastDayOfMonth);
      nextDate.setDate(nextDate.getDate() + i);
      const nextPersian = gregorianToPersian(nextDate);
      
      days.push({
        year: nextPersian.year,
        month: nextPersian.month,
        day: nextPersian.day,
        isToday: false,
        isSelected: false,
        isCurrentMonth: false
      });
    }

    return days;
  };

  useEffect(() => {
    setCalendarDays(generateCalendarDays(currentDate));
  }, [currentDate, selectedDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: PersianDate) => {
    if (day.isCurrentMonth && onDateSelect) {
      const gregorianDate = persianToGregorian(day.year, day.month, day.day);
      onDateSelect(gregorianDate.toISOString().split('T')[0]);
    }
  };

  const currentPersian = gregorianToPersian(currentDate);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800">
            {persianMonths[currentPersian.month - 1]} {currentPersian.year}
          </h3>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {persianDays.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-600 py-2">
            {day.slice(0, 3)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(day)}
            disabled={!day.isCurrentMonth}
            className={`
              p-2 text-sm rounded-lg transition-colors
              ${day.isCurrentMonth ? 'hover:bg-primary-50' : 'text-gray-400'}
              ${day.isToday ? 'bg-primary-100 text-primary-700 font-bold' : ''}
              ${day.isSelected ? 'bg-primary-600 text-white' : ''}
              ${!day.isCurrentMonth ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {day.day}
          </button>
        ))}
      </div>

      {/* Today indicator */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700">
          <CalendarIcon className="w-4 h-4 mr-1" />
          امروز: {gregorianToPersian(new Date()).day} {persianMonths[gregorianToPersian(new Date()).month - 1]}
        </div>
      </div>
    </div>
  );
};

export default PersianCalendar; 