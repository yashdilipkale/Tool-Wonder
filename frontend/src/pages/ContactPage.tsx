import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Mail, User, MessageSquare, Send } from "lucide-react";

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "contact_messages"), {
        ...form,
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      alert("Error sending message");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 sm:py-12 px-4">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
            <Mail size={24} className="sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900 dark:text-white">Contact Us</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-lg mb-4 text-center">
            Message sent successfully!
          </div>
        )}

        <form onSubmit={submit} className="space-y-4 sm:space-y-5">
          
          {/* Name */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Name *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Email *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Subject (optional)"
              value={form.subject}
              onChange={handleChange}
              className="w-full px-4 py-2.5 sm:py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Message *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                <MessageSquare size={18} className="text-slate-400" />
              </div>
              <textarea
                name="message"
                placeholder="Write your message..."
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 sm:py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <Send size={18} />
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
