"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Video, FileText, Plus, X, MoreVertical, Trash2, Edit2 } from "lucide-react";
import { api, getApiError } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventType, setNewEventType] = useState("live");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", getApiError(error));
      toast.error("Failed to load events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Generate a map of events mapped to actual date strings
  const eventMap = useMemo(() => {
    const map = new Map<string, Event[]>();

    events.forEach(event => {
      // Create date at noon to avoid timezone shift issues
      const [year, month, day] = event.date.split('-');
      if (!year || !month || !day) return;
      const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0);
      const dateString = eventDate.toDateString();

      if (!map.has(dateString)) {
        map.set(dateString, []);
      }
      map.get(dateString)?.push(event);
    });

    return map;
  }, [events]);

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
    const date = new Date(currentYear, currentMonth, day, 12, 0, 0);
    return eventMap.get(date.toDateString()) || [];
  };

  const selectedDateEvents = eventMap.get(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 12, 0, 0).toDateString()) || [];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const openNewEventModal = () => {
    setEditingEventId(null);
    setNewEventTitle("");
    setNewEventDate("");
    setNewEventTime("");
    setNewEventType("live");
    setIsModalOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setEditingEventId(event.id);
    setNewEventTitle(event.title);
    setNewEventDate(event.date);
    setNewEventTime(event.time);
    setNewEventType(event.type);
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: newEventTitle,
        date: newEventDate,
        time: newEventTime,
        type: newEventType,
      };

      if (editingEventId) {
        await api.patch(`/events/${editingEventId}`, payload);
        toast.success("Event updated successfully!");
      } else {
        await api.post('/events', payload);
        toast.success("Event created successfully!");
      }

      await fetchEvents();
      setIsModalOpen(false);
      setEditingEventId(null);
      setNewEventTitle("");
      setNewEventDate("");
      setNewEventTime("");
      setNewEventType("live");
    } catch (error) {
      console.error("Failed to save event:", getApiError(error));
      toast.error(editingEventId ? "Failed to update event." : "Failed to add event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    // Close the 3-dots dropdown menu immediately
    setOpenMenuId(null);

    // Show confirmation toast
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-slate-900">Are you sure you want to delete this event?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/events/${id}`);
                toast.success("Event deleted successfully!");
                await fetchEvents();
              } catch (error) {
                console.error("Failed to delete event:", getApiError(error));
                toast.error("Failed to delete event.");
              }
            }}
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 9999999 }); // Huge duration so it won't disappear on its own
  };

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
        </span>
        {isToday(day) && <span className="absolute top-2 right-2 text-[10px] uppercase tracking-wider font-bold text-blue-600">Today</span>}

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
    <div className="flex flex-col lg:flex-row gap-8 pb-12 relative">

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
              onClick={openNewEventModal}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
              <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={goToToday}
                title="Return to Today"
                className="px-4 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 rounded-md transition-colors min-w-[160px] text-center"
              >
                {currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()
                  ? `Today: ${new Date().getDate()} ${monthNames[new Date().getMonth()]}, ${new Date().getFullYear()}`
                  : `${monthNames[currentMonth]} ${currentYear}`}
              </button>

              <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors">
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
                <div key={idx} className="flex gap-4 p-4 rounded-md border border-slate-100 bg-slate-50 hover:border-slate-200 transition-colors relative">
                  <div className={`mt-0.5 p-2 rounded-md h-fit ${event.type === 'live' ? 'bg-teal-600 text-white' : 'bg-orange-600 text-white'}`}>
                    {event.type === 'live' ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-slate-900 text-sm">{event.title}</span>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {event.time}
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === event.id ? null : event.id)}
                      className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {openMenuId === event.id && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-10">
                        <button
                          onClick={() => handleEditClick(event)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
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

      {/* Add/Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingEventId ? "Edit Event" : "Add New Event"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="p-4 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. React Fundamentals"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={e => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={newEventTime}
                    onChange={e => setNewEventTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 10:00 AM - 11:30 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
                <select
                  value={newEventType}
                  onChange={e => setNewEventType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="live">Live Session</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : (editingEventId ? "Save Changes" : "Save Event")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
