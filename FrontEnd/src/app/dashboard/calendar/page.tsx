"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Video, FileText } from "lucide-react";

// Mock events for demonstration purposes
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Intro to UI Design Live Session",
    dateOffset: 2, // days from today
    time: "10:00 AM - 11:30 AM",
    type: "live",
  },
  {
    id: 2,
    title: "Assignment Due: Module 1",
    dateOffset: 0, // today
    time: "11:59 PM",
    type: "assignment",
  },
  {
    id: 3,
    title: "Q&A with Instructor",
    dateOffset: -3, // past
    time: "2:00 PM - 3:00 PM",
    type: "live",
  },
  {
    id: 4,
    title: "React Fundamentals Workshop",
    dateOffset: 5,
    time: "1:00 PM - 4:00 PM",
    type: "live",
  }
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate a mock map of events mapped to actual date strings
  const eventMap = useMemo(() => {
    const map = new Map<string, typeof MOCK_EVENTS>();
    const today = new Date();

    MOCK_EVENTS.forEach(event => {
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + event.dateOffset);
      const dateString = eventDate.toDateString();

      if (!map.has(dateString)) {
        map.set(dateString, []);
      }
      map.get(dateString)?.push(event);
    });

    return map;
  }, []);

  // Calendar logic helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  };

  const isSelected = (day: number) => {
    return selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
  };

  const getEventsForDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return eventMap.get(date.toDateString()) || [];
  };

  const selectedDateEvents = eventMap.get(selectedDate.toDateString()) || [];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Generate calendar grid
  const days = [];
  // Empty slots for previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 sm:h-32 border-b border-r border-slate-100 bg-slate-50/50"></div>);
  }
  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day);
    days.push(
      <div
        key={day}
        onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
        className={`h-24 sm:h-32 p-2 border-b border-r border-slate-100 transition-colors cursor-pointer flex flex-col relative
          ${isSelected(day) ? 'bg-blue-200' : 'hover:bg-slate-200'}
        `}
      >
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
          ${isToday(day) ? 'bg-blue-600 text-white' : isSelected(day) ? 'text-blue-700 font-bold' : 'text-slate-700'}
        `}>
          {day}

        </span>{isToday(day) && <span className="absolute top-2 right-2 text-[10px] uppercase tracking-wider font-bold text-blue-600">Today</span>}

        <div className="mt-1 flex flex-col gap-1 overflow-hidden">
          {dayEvents.slice(0, 2).map((event, i) => (
            <div
              key={i}
              className={`text-xs px-2 py-1 rounded truncate font-medium
                ${event.type === 'live' ? 'bg-teal-100 text-teal-800' : 'bg-orange-100 text-orange-800'}
              `}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div className="text-xs text-slate-500 font-medium pl-1">
              +{dayEvents.length - 2} more
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-12">

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">

              Calendar
            </h1>
            <p className="text-slate-500 mt-1">Track your classes, courses, and events.</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Today
            </button>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 cursor-pointer">
              <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-md text-slate-600">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="w-32 text-center font-semibold text-slate-800">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-md text-slate-600">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {daysOfWeek.map(day => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          {/* Days Grid */}
          <div className="grid grid-cols-7 border-l-0 border-t-0 border-slate-200">
            {days}
          </div>
        </div>
      </div>

      {/* Side Pane - Selected Day Schedule */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-28">
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {selectedDateEvents.length === 0 ? "No events scheduled" : `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? 's' : ''} scheduled`}
          </p>

          <div className="flex flex-col gap-4">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-md border border-slate-100 bg-slate-50 hover:border-slate-200 transition-colors">
                  <div className={`mt-0.5 p-2 rounded-md h-fit ${event.type === 'live' ? 'bg-teal-600 text-white' : 'bg-orange-600 text-white'}`}>
                    {event.type === 'live' ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-sm">{event.title}</span>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {event.time}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <CalendarIcon className="h-5 w-5 text-slate-600" />
                </div>
                <p className="text-slate-500 text-sm">Take a break! You have a free day today.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
