import { useContext, useState } from "react";
import { X, Loader2, AlertTriangle } from "lucide-react";
import { AppContext } from "../../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

const RejectLoanModal = () => {
  const { setShowRejectModal, selectedLoan, getAllLoans } = useContext(AppContext);
  
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleReject = async () => {
    if (!reason.trim()) return toast.warning("Please provide a reason for rejection");

    setIsLoading(true);
    try {
      const response = await axios.put('/reject-loan', {
        loanId: selectedLoan?._id,
        reason: reason,
        user: selectedLoan?.user,
      });

      if (response.data) {
        toast.error("Application Rejected");
        await getAllLoans();
        setShowRejectModal(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Internal Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(selectedLoan)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-200 flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Danger Header */}
        <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            <h3 className="font-black text-sm uppercase tracking-wider">Reject Application</h3>
          </div>
          <X className="cursor-pointer text-slate-400 hover:text-red-600" onClick={() => setShowRejectModal(false)} />
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
            You are rejecting the loan application for <b>{selectedLoan?.borrower}</b> (₦{selectedLoan?.amount?.toLocaleString()}).
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason for Rejection</label>
            <textarea 
              className="w-full border-2 border-slate-100 rounded-xl p-4 mt-2 focus:border-red-500 outline-none h-32 text-sm font-medium text-slate-700 transition-all resize-none"
              placeholder="Provide a specific reason (e.g. Credit score too low, missing ID documents...)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleReject}
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Confirm Rejection"}
            </button>
            <button 
              className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600" 
              onClick={() => setShowRejectModal(false)}
            >
              Cancel Process
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectLoanModal;