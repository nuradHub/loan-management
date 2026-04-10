import { Loader2, X, CreditCard, Copy, CheckCircle2, ShieldCheck } from "lucide-react";
import { useContext, useState } from "react";
import { AppContext } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

const MakePayment = () => {
  const { setIsPayment, setIsLoading, isLoading, approvedAmount, currentUser } = useContext(AppContext);
  const [copied, setCopied] = useState(false);
  
  const [showRRRModal, setShowRRRModal] = useState(false);
  const [rrrNumber, setRrrNumber] = useState("");

  const accountInfo = {
    bank: "Test Demo Bank PLC",
    number: "0123456789",
    name: "LOAN REPAYMENT FUND"
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(accountInfo.number);
    setCopied(true);
    toast.info("Account number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Final submission logic
  const handleFinalVerify = async (e) => {
    e.preventDefault();
    if (!rrrNumber) return toast.warning("Please enter your RRR number");

    setIsLoading(true);
    try {
      const response = await axios.post('/pay-loan', {
        userId: currentUser?._id,
        rrr: rrrNumber,
        amount: approvedAmount
      });
      toast.success("Payment submitted for verification!");
      setIsPayment(false);
    } catch (err) {
      toast.error("Failed to verify payment. Please try again.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-5">
      <div className="flex flex-col bg-white w-full rounded-2xl max-w-md overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-white">
            <CreditCard size={18} className="text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wide">
              {showRRRModal ? "Verify Payment" : "Repay Your Loan"}
            </h3>
          </div>
          <X 
            className="text-slate-400 cursor-pointer hover:text-white transition-colors" 
            size={20} 
            onClick={() => setIsPayment(false)} 
          />
        </div>

        <div className="p-6">
          {!showRRRModal ? (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="text-center">
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Total Repayment Amount</p>
                <h2 className="text-3xl font-black text-slate-800 mt-1">
                  ₦{(approvedAmount ?? 0).toFixed(2)}
                </h2>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Bank Name</p>
                    <p className="text-sm font-semibold text-slate-700">{accountInfo.bank}</p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Account Number</p>
                      <p className="text-xl font-mono font-bold text-blue-600 tracking-wider">{accountInfo.number}</p>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-blue-50 transition-all shadow-sm"
                    >
                      {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Account Name</p>
                    <p className="text-sm font-semibold text-slate-700">{accountInfo.name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg">
                <p className="text-[11px] text-amber-800 leading-relaxed text-center italic">
                  Transfer the exact amount and click the button below to provide your RRR verification code.
                </p>
              </div>

              <button 
                onClick={() => setShowRRRModal(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                I Have Made This Transfer
              </button>
            </div>
          ) : (
            /* --- STEP 2: RRR VERIFICATION --- */
            <form onSubmit={handleFinalVerify} className="flex flex-col gap-5 animate-in fade-in zoom-in-95">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="bg-blue-100 p-3 rounded-full">
                  <ShieldCheck size={32} className="text-blue-600" />
                </div>
                <h4 className="font-bold text-slate-800">Confirm Transaction</h4>
                <p className="text-xs text-slate-500 px-4">
                  Please enter the 12-digit <b>Remita Retrieval Reference (RRR)</b> number generated from your transaction.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">RRR Number</label>
                <input 
                  type="text" 
                  required
                  placeholder="0000 - 0000 - 0000"
                  value={rrrNumber}
                  onChange={(e) => setRrrNumber(e.target.value.replace(/\s/g, ""))}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 text-center font-mono text-lg tracking-widest text-slate-700"
                />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Verify & Complete"}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowRRRModal(false)}
                  className="w-full py-2 text-slate-400 text-xs font-medium"
                >
                  Go back to account details
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MakePayment;