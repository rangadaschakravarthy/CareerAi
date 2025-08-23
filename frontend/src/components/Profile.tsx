import React, { useEffect, useState } from "react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Save, X, Camera, Palette } from "lucide-react";

const DEFAULT_AVATAR = "/avatar.png";

const Profile: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-r from-primary to-secondary relative">
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
              <div className="relative group">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={user?.avatar?.trim() ? user.avatar : DEFAULT_AVATAR}
                  alt="User Avatar"
                  onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 rounded-full border-4 border-base-100 shadow-lg object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/50 rounded-full p-3">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    <motion.input
                      whileFocus={{ scale: 1.005 }}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-base-100 border border-base-content/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      placeholder="Your name"
                    />
                    <motion.input
                      whileFocus={{ scale: 1.005 }}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-base-100 border border-base-content/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEditToggle}
                      className="inline-flex items-center px-4 py-2 border border-base-content/20 rounded-lg hover:bg-base-200 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="display"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <h2 className="text-2xl font-bold text-base-content">
                    {user?.name}
                  </h2>
                  <p className="text-base-content/70 mt-1">{user?.email}</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEditToggle}
                    className="inline-flex items-center px-4 py-2 mt-4 border border-base-content/20 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Theme Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-base-100 rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Theme Preferences</h2>
          </div>
          <p className="text-base-content/70 mb-6">
            Personalize your experience by choosing a theme that suits your
            style
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {THEMES.map((t) => (
              <motion.button
                key={t}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`group flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                  theme === t ? "bg-base-200 shadow-md" : "hover:bg-base-200/50"
                }`}
                onClick={() => setTheme(t)}
              >
                <div
                  className="relative h-12 w-full rounded-lg overflow-hidden shadow-sm"
                  data-theme={t}
                >
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-sm font-medium truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
