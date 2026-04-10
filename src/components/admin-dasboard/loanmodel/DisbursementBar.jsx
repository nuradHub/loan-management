import { X, Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/Context";
import axios from "axios";

const DisbursementBar = () => {
  const [copied, setCopied] = useState(false);
  const { selectedLoan, setActiveDisbursement, isLoading, setIsLoading, getAllLoans } = useContext(AppContext);

  if (!selectedLoan) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedLoan.accountNumber);
    setCopied(true);
    toast.success(`${selectedLoan.accountNumber}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyPayment = async(id)=> {
    setIsLoading(true)
    try{
      const response = await axios.put('/update-payment', {
        loanId: id,
        amount: selectedLoan.amount
      })
      if(response.data){
        toast.success(response.data.message)
      }
      getAllLoans()
    }catch(err){
      console.log(err.message)
      toast.error(err.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-slate-900 text-white z-999 shadow-2xl border-b-2 border-green-500 animate-in slide-in-from-top duration-500">
      <div className="max-w-7xl mx-auto p-3 md:p-4">
        {/* Responsive Grid/Flex container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left Side: Borrower Info */}
          <div className="flex items-center gap-3 w-full lg:w-auto border-b lg:border-0 border-slate-700 pb-3 lg:pb-0">
            <div className="bg-green-600 p-2 rounded-full hidden sm:block">
              <ExternalLink size={18} className="animate-pulse" />
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] uppercase font-bold text-green-500 tracking-widest">Active Disbursement</p>
              <h2 className="text-sm font-bold truncate max-w-62.5 md:max-w-md">
                {selectedLoan.borrower} <span className="text-slate-500 mx-1">|</span> 
                <span className="text-blue-400 font-mono">{selectedLoan.paymentDetails}</span>
              </h2>
            </div>
          </div>

          {/* Right Side: Actions and Amount */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 w-full lg:w-auto">
            
            {/* Amount Section */}
            <div className="flex flex-col items-start md:items-end bg-slate-800/50 p-2 px-4 rounded-lg">
              <p className="text-[9px] uppercase font-bold text-slate-400">Total to Send</p>
              <p className="text-xl font-black text-green-400 font-mono">₦{selectedLoan.amount}</p>
            </div>

            {/* Buttons Group */}
            <div className="flex items-center gap-2 grow sm:grow-0">
              <button 
                onClick={handleCopy}
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-3 md:py-2 rounded-xl text-xs font-bold transition-all border border-slate-600 active:scale-95"
              >
                {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Number"}</span>
                <span className="sm:hidden">{selectedLoan.accountNumber}</span>
              </button>

              <button 
                className="flex-2 sm:flex-none bg-green-600 hover:bg-green-700 px-5 py-3 md:py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-green-900/40 active:scale-95 whitespace-nowrap disabled:cursor-not-allowed" onClick={()=> {setActiveDisbursement(false); handleVerifyPayment(selectedLoan._id)}} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" size={15}/> : 'Done'}
              </button>

              <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full" onClick={()=> setActiveDisbursement(false)} >
                <X size={20} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DisbursementBar;