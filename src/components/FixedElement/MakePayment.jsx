import { Loader2, X, CreditCard, Copy, CheckCircle2 } from "lucide-react"
import { useContext, useState } from "react"
import { AppContext } from "../context/Context"
import { toast } from "react-toastify"

const MakePayment = () => {
  const { setIsPayment, amount, setIsLoading, isLoading } = useContext(AppContext)
  const [copied, setCopied] = useState(false)

  // Test account details
  const accountInfo = {
    bank: "Test Demo Bank PLC",
    number: "0123456789",
    name: "LOAN REPAYMENT FUND"
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(accountInfo.number)
    setCopied(true)
    toast.info("Account number copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirmPayment = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Payment notification sent for verification!")
      setIsPayment(false) 
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-5">
      <div className="flex flex-col bg-white w-full rounded-2xl max-w-md overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-900 p-3">
          <div className="flex items-center gap-2 text-white">
            <CreditCard size={20} className="text-blue-400" />
            <h3 className="text-sm font-bold uppercase tracking-wide">Repay Your Loan</h3>
          </div>
          <X className="text-slate-400 cursor-pointer hover:text-white transition-colors" size={20} onClick={() => setIsPayment(false)} />
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Summary Section */}
          <div className="text-center">
            <p className="text-slate-500 text-xs uppercase font-semibold">Total Repayment Amount</p>
            <h2 className="text-3xl font-black text-slate-800 mt-1">
              ₦{amount || "0.00"}
            </h2>
          </div>

          {/* Account Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Bank Name</p>
                <p className="text-sm font-semibold text-slate-700">{accountInfo.bank}</p>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Account Number</p>
                  <p className="text-xl font-mono font-bold text-blue-600 tracking-wider">{accountInfo.number}</p>
                </div>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                >
                  {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Account Name</p>
                <p className="text-sm font-semibold text-slate-700">{accountInfo.name}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg">
            <p className="text-[11px] text-amber-800 leading-relaxed text-center">
              Please use your <b>Serial Number</b> or <b>Name</b> as the payment description/memo to ensure fast automated processing.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleConfirmPayment}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : "I Have Made This Transfer"}
            </button>
            
            <button 
              onClick={() => setIsPayment(false)}
              className="w-full py-2 text-slate-400 text-xs font-medium hover:text-slate-600 transition-colors"
            >
              Cancel and go back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MakePayment