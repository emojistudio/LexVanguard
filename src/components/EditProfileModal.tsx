import React, { useState } from "react";
import { X, Camera, Save, Sparkles, Check, User, Briefcase, Phone, Mail, FileText } from "lucide-react";
import { saveProfile, type AttorneyProfile, loadProfile } from "../lib/profile-store";
import { useAuth } from "../lib/auth-context";

interface EditProfileModalProps {
  onClose: () => void;
  onSaved?: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose, onSaved }) => {
  const { firmUser, firebaseUser } = useAuth();
  
  const currentName = firmUser?.name || firebaseUser?.displayName || "Firm Member";
  const initialProfile = loadProfile(currentName, {
    title: firmUser?.title,
    practice: firmUser?.practice,
    email: firmUser?.email || firebaseUser?.email || undefined
  });

  const [name, setName] = useState(initialProfile.name);
  const [title, setTitle] = useState(initialProfile.title);
  const [practice, setPractice] = useState(initialProfile.practice);
  const [bio, setBio] = useState(initialProfile.bio);
  const [phone, setPhone] = useState(initialProfile.phone);
  const [email, setEmail] = useState(initialProfile.email);
  const [education, setEducation] = useState(initialProfile.education);
  const [achievements, setAchievements] = useState(initialProfile.achievements);
  const [image, setImage] = useState(initialProfile.image);
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      if (result) {
        setImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedProfile: AttorneyProfile = {
        name: name.trim() || currentName,
        title: title.trim() || "Counsel",
        practice: practice.trim() || "Legal Advisory",
        bio: bio.trim(),
        phone: phone.trim(),
        email: email.trim(),
        education: education.trim(),
        achievements: achievements.trim(),
        image: image,
        profilePhoto: image
      };

      saveProfile(updatedProfile);
      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => {
        if (onSaved) onSaved();
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#18181b] border border-zinc-700/80 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden text-white animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-[#121215]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">Edit Profile & Portfolio</h2>
              <p className="text-xs text-zinc-400">Update your attorney details across the firm portal</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {successMessage && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center justify-center space-y-3 pb-2 border-b border-zinc-800">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-500 to-amber-300 shadow-lg shrink-0 overflow-hidden">
                <img 
                  src={image} 
                  alt="Profile Avatar" 
                  className="w-full h-full rounded-full object-cover bg-zinc-900 border-2 border-zinc-900"
                />
              </div>
              <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold">
                <Camera className="w-6 h-6 mb-1 text-amber-400" />
                Change Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
              </label>
            </div>
            <div className="w-full">
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Image URL (Optional Direct Link)
              </label>
              <input 
                type="text" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
                placeholder="https://i.ibb.co/..."
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  required
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Title / Position
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  required
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Primary Practice Area
              </label>
              <input 
                type="text" 
                value={practice} 
                onChange={(e) => setPractice(e.target.value)}
                placeholder="e.g. Corporate Law & Tech Litigation"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 700 000 000"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Official Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Professional Biography
            </label>
            <textarea 
              rows={3} 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your legal background, key areas of practice, and accomplishments..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-black" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
