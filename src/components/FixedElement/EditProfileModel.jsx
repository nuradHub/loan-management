import { X, Loader2, Save, User, Phone, Hash, MapPin } from "lucide-react";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/Context";
import { useEffect } from "react";

const EditProfileModal = ({ onClose }) => {

  const {currentUser, handleCurrentUser, setIsEditProfile, setEmail, email, setAddress, address, setTel, tel, setTaxId, taxId } = useContext(AppContext);

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || "");
      setTel(currentUser.tel || "");
      setTaxId(currentUser.taxId || "");
      setAddress(currentUser.address || "");
    }
  }, [currentUser, setEmail, setTel, setTaxId, setAddress]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await axios.put("/update-profile", {
        email: email,
        address: address,
        tel: tel,
        taxId: taxId
      });
      if (response.data) {
        toast.success(response.data.message);
      }
      await handleCurrentUser()
      setIsEditProfile(false)
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-250 flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <User size={18} />
            </div>
            <h3 className="font-bold text-slate-800">Edit Account Details</h3>
          </div>
          <X className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setIsEditProfile(false)} />
        </div>

        <form onSubmit={handleUpdate} className="p-6 flex flex-col gap-5">

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-slate-100 rounded-xl p-3 pl-10 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-slate-700"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">@</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <input
                  name="tel"
                  type="tel"
                  required
                  value={tel}
                  onChange={(e) => setTel(e.target.value.trim())}
                  className="w-full border-2 border-slate-100 rounded-xl p-3 pl-10 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-slate-700"
                />
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Tax ID Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tax ID / SSN</label>
              <div className="relative">
                <input
                  name="taxId"
                  type="text"
                  required
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value.trim())}
                  className="w-full border-2 border-slate-100 rounded-xl p-3 pl-10 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-slate-700"
                />
                <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Address Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Residential Address</label>
            <div className="relative">
              <textarea
                name="address"
                rows="3"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value.trim())}
                className="w-full border-2 border-slate-100 rounded-xl p-3 pl-10 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-slate-700 resize-none"
              />
              <MapPin size={16} className="absolute left-3 top-4 text-slate-400" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-2 bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-50"
            >
              {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isUpdating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;