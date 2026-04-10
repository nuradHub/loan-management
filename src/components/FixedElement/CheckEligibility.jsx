import { useContext, useState } from "react"
import { AppContext } from "../context/Context"
import { X, CheckCircle2, Wallet, Clock, Zap } from "lucide-react"

const CheckEligibility = () => {
  const { setIsEligibility, creditScore, setCreditScore, setLoanDetails, setIsLoan } = useContext(AppContext)

  const [hasChecked, setHasChecked] = useState(false)

  const getEligibilityData = (score) => {
    const numScore = Number(score)
    
    if (numScore < 30) {
      return {
        plan: "Short term",
        limit: "₦50,000",
        desc: "You are eligible for a quick Short term loan to cover immediate expenses.",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: <Zap size={24} />
      }
    } else if (numScore < 70) {
      return {
        plan: "Mid term",
        limit: "₦250,000",
        desc: "Your score qualifies you for a Mid term loan with a flexible repayment schedule.",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        icon: <Clock size={24} />
      }
    } else {
      return {
        plan: "Long term",
        limit: "₦1,000,000",
        desc: "Excellent credit! You are eligible for our Long term loan plan with maximum funding.",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        icon: <Wallet size={24} />
      }
    }
  }

  const result = getEligibilityData(creditScore)

  const handleProceed = () => {
    // 1. Set the loan details automatically based on eligibility
    setLoanDetails(result.plan)
    // 2. Close this modal
    setIsEligibility(false)
    // 3. Open the application form (FixedLoan component)
    if(setIsLoan) setIsLoan(true) 
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-xl animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Check Loan Eligibility</h3>
          <X className="cursor-pointer text-slate-400 hover:text-slate-600" size={18} onClick={() => setIsEligibility(false)} />
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Input Section */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase">Your Current Credit Score</label>
            <div className="relative">
              <input 
                type="number" 
                max="100"
                min="0"
                value={creditScore}
                onChange={(e) => {
                  setCreditScore(e.target.value)
                  setHasChecked(false)
                }}
                placeholder="0 - 100"
                className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-all text-xl font-bold text-slate-700"
              />
              <button 
                onClick={() => setHasChecked(true)}
                className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors uppercase"
              >
                Verify
              </button>
            </div>
          </div>

          {/* Results Section */}
          {hasChecked && creditScore !== "" && (
            <div className={`p-5 rounded-xl border-2 animate-in slide-in-from-bottom-2 duration-300 ${result.bg} ${result.border}`}>
              <div className="flex items-start gap-4">
                <div className={`${result.color} p-2 bg-white rounded-lg shadow-sm`}>
                  {result.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Eligible Plan:</span>
                    <h4 className={`font-black text-sm uppercase tracking-wide ${result.color}`}>{result.plan}</h4>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed mt-1">
                    {result.desc}
                  </p>
                  <div className="mt-4 bg-white/50 p-2 rounded-md border border-white">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Maximum Amount</span>
                    <span className="text-xl font-black text-slate-800">{result.limit}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleProceed}
                className="w-full mt-5 bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <CheckCircle2 size={16} className="text-green-400" />
                Apply for {result.plan}
              </button>
            </div>
          )}

          {!hasChecked && (
             <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                <p className="text-slate-400 text-xs font-medium">Please enter your score to view available plans</p>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckEligibility