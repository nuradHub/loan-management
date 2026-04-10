import { X } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../../context/Context";

const ApproveLoanModal = () => {

  const {setActiveDisbursement, setShowApproveModal, selectedLoan} = useContext(AppContext)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-150 flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
        <div className="bg-green-600 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold">Approve Loan & Disburse</h3>
          <X className="cursor-pointer"  onClick={()=> setShowApproveModal(false)}/>
        </div>
        <div className="p-6">
          <p className="text-xs text-slate-500 uppercase font-bold mb-2">Borrower Bank Details</p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
            <p className="text-lg font-mono font-bold text-slate-800">{selectedLoan.paymentDetails}</p>
            <p className="text-sm text-slate-500 mt-2">Amount to send: <span className="font-bold text-green-600">₦{selectedLoan.amount}</span></p>
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={()=> {setActiveDisbursement(true); setShowApproveModal(false) }}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all"
            >
              Verify Payment Sent
            </button>
            <button className="text-slate-400 text-sm" onClick={()=> setShowApproveModal(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveLoanModal