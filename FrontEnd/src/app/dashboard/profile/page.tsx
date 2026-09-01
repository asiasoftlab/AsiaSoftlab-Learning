"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { User, Mail, Shield, Bell, Save, Camera, MapPin, Building, Smartphone, Calendar, GraduationCap, Map, Home } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("personal");
  
  // Dummy state for form (in a real app, this would be initialized from the user object and saved to the backend)
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    dob: "",
    gender: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    address: "",
    education: "",
    course: "",
    yearOfPassout: "",
    role: user?.role || "Student"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "personal") {
      if (!formData.displayName || formData.displayName.trim().length < 3) {
        return toast.error("Full Name must be at least 3 characters long.");
      }
      if (!formData.dob) {
        return toast.error("Date of Birth is required.");
      }
      if (!formData.gender) {
        return toast.error("Please select a gender.");
      }
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!formData.phone || !phoneRegex.test(formData.phone)) {
        return toast.error("Please enter a valid phone number (min 10 digits).");
      }
      if (!formData.education) {
        return toast.error("Education Qualification is required.");
      }
      if (!formData.course) {
        return toast.error("Course/Degree is required.");
      }
      const year = parseInt(formData.yearOfPassout);
      if (!formData.yearOfPassout || isNaN(year) || year < 1950 || year > 2100) {
        return toast.error("Please enter a valid Year of Pass Out.");
      }
      if (!formData.country.trim()) {
        return toast.error("Country is required.");
      }
      if (!formData.state.trim()) {
        return toast.error("State is required.");
      }
      if (!formData.city.trim()) {
        return toast.error("City is required.");
      }
      if (!formData.address.trim()) {
        return toast.error("Address is required.");
      }
    }

    // Simulate API call
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: 'Saving profile...',
        success: 'Profile updated successfully!',
        error: 'Failed to update profile.',
      }
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Map of education qualifications to their specific courses/degrees
  const courseOptions: Record<string, string[]> = {
    "8th": ["General"],
    "10th": ["General"],
    "12th": ["Science", "Commerce", "Arts"],
    "Degree(Bachelors)": ["BSc", "BA", "BCom", "BCA", "BBA", "Other"],
    "Diploma": ["Computer Engineering", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Other"],
    "Polytechnic": ["Computer Engineering", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Other"],
    "BTech": ["AI Engineering","Artificial Intelligence","Computer Science", "Mechanical", "Civil", "Electrical", "Electronics & Communication", "Information Technology", "Other"],
    "Post Graduation(Masters)": ["MTech", "MSc", "MA", "MBA", "MCA", "Other"],
    "Doctorate": ["PhD", "MPhil", "Other"]
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          My Profile
        </h1>
        <p className="text-slate-500">Manage your profile and settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Sidebar & Profile Card */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
          {/* Profile Card */}
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-brand-500 to-brand-700"></div>
            
            <div className="relative mt-8 mb-4 group cursor-pointer">
              <div className="w-28 h-28 bg-white p-1 rounded-full shadow-lg">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-brand-600 border-2 border-dashed border-slate-300 group-hover:border-brand-400 transition-colors">
                  {getInitials(formData.displayName)}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 bg-brand-600 text-white p-2 rounded-full shadow-md group-hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900">{formData.displayName}</h2>
            <div className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider">
              {formData.role}
            </div>
            
            <p className="text-slate-500 mt-4 text-sm flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              {formData.email}
            </p>
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-2">
            <button onClick={() => setActiveTab("personal")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "personal" ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 cursor-pointer"}`}>
              <User className="w-4 h-4" /> Personal Details
            </button>
            <button onClick={() => setActiveTab("security")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "security" ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 cursor-pointer"}`}>
              <Shield className="w-4 h-4" /> Security & Password
            </button>
            <button onClick={() => setActiveTab("notifications")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "notifications" ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 cursor-pointer"}`}>
              <Bell className="w-4 h-4" /> Notifications
            </button>
          </div>
        </div>

        {/* Right Column: Content Area */}
        <div className="w-full lg:w-2/3">
          
          {activeTab === "personal" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="mb-6 pb-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Personal Details</h2>
                <p className="text-sm text-slate-500 mt-1">Update your basic profile information.</p>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" /> Full Name
                    </label>
                    <input 
                      type="text" 
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-700"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" /> Email Address
                    </label>
                    <input 
                      type="email" 
                      disabled
                      value={formData.email}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" /> Date of Birth
                    </label>
                    <input 
                      type="date" 
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-700"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" /> Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-700 appearance-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-slate-400" /> Phone Number
                    </label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="e.g. +911234567890"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-700"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Map className="w-4 h-4 text-slate-400" /> Country
                    </label>
                    <input 
                      type="text" 
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      placeholder="e.g. India"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-700"
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" /> State
                    </label>
                    <input 
                      type="text" 
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      placeholder="e.g. Tamil Nadu or Kerala"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-700"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-400" /> City
                    </label>
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="e.g. Chennai or Coimbatore"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-700"
                    />
                  </div>
                  {/* Education Qualification */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-slate-400" /> Education Qualification
                    </label>
                    <select
                      value={formData.education}
                      onChange={(e) => setFormData({
                        ...formData, 
                        education: e.target.value,
                        course: "" // Reset course when education changes
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-700 appearance-none"
                    >
                      <option value="" disabled>Select Qualification</option>
                      <option value="8th">8th</option>
                      <option value="10th">10th</option>
                      <option value="12th">12th</option>
                      <option value="Degree(Bachelors)">Degree(Bachelors)</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Polytechnic">Polytechnic</option>
                      <option value="BTech">BTech</option>
                      <option value="Post Graduation(Masters)">Post Graduation(Masters)</option>
                      <option value="Doctorate">Doctorate</option>
                    </select>
                  </div>
                  {/*Course/Degree*/}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-slate-400" /> Course/Degree
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({...formData, course: e.target.value})}
                      
                      disabled={!formData.education}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-700 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>Select Course/Degree</option>
                      {formData.education && courseOptions[formData.education]?.map((courseName, idx) => (
                        <option key={idx} value={courseName}>{courseName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year of Pass Out */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" /> Year of Pass Out
                    </label>
                    <input 
                      type="number" 
                      value={formData.yearOfPassout}
                      onChange={(e) => setFormData({...formData, yearOfPassout: e.target.value})}
                      placeholder="e.g. 2024"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-700"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Home className="w-4 h-4 text-slate-400" /> Address
                    </label>
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none text-slate-700 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button 
                    type="submit"
                    className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="mb-6 pb-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                 Change Password
                </h2>
                <p className="text-sm text-slate-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
              </div>

              <form onSubmit={handleSave} className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Current Password</label>
                  <input 
                    type="password" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">New Password</label>
                  <input 
                    type="password" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="bg-slate-900 text-white px-5 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="mb-6 pb-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Notification Preferences
                </h2>
                <p className="text-sm text-slate-500 mt-1">Choose what updates you want to receive.</p>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: "Course Updates", desc: "Get notified when new lessons are added to your enrolled courses." },
                  { title: "Messages", desc: "Receive email alerts when you get a new direct message." },
                  { title: "Marketing & Promos", desc: "Hear about new features, sales, and platform news." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-100 hover:border-brand-200 bg-slate-50/50 transition-colors">
                    <div>
                      <h3 className="font-semibold text-slate-800">{item.title}</h3>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1 shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i !== 2} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                  </div>
                ))}
                
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => {
                      toast.success('Preferences saved successfully!');
                    }}
                    className="bg-slate-900 text-white px-5 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
