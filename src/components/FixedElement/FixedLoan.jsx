import { Loader2, X } from "lucide-react"
import { useContext } from "react"
import { AppContext } from "../context/Context"
import axios from "axios"
import { toast } from "react-toastify"

const FixedLoan = ()=> {

  const {setLoans, setIsLoan, serialNumber, setSerialNumber, borrower, setBorrower, loanDetails, setLoanDetails, paymentDetails, setPaymentDetails, handleCurrentLoan, isLoading, setIsLoading, amount, setAmount, userId, setUserId, HandleNewLoansByAdmin, currentUser} = useContext(AppContext)

  const HandleNewLoans = async (e)=> {
    e.preventDefault()
    setIsLoading(true)
    try{
      const response = await axios.post('/new-loan', {
        borrower: borrower,
        loanDetails: loanDetails,
        paymentDetails: paymentDetails,
        amount: amount,
      })
      if(response.data){
        toast.success('You have applied for new loan')
        setIsLoan(false)
        handleCurrentLoan()
      }
    }catch(err){
      console.log(err.message)
    }finally{
      setIsLoading(false)
    }
  }

  console.log(currentUser)

  return(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-100 flex items-center justify-center p-5">
      <div className="flex flex-col gap-1 bg-white w-full rounded-xl max-w-100">
        <div className="flex items-center justify-between bg-blue-600 p-3 rounded-t-xl">
          <h3 className="text-sm text-white">Create New Load Application</h3>
          <X className="text-white cursor-pointer" size={15} onClick={()=> setIsLoan(false)} />
        </div>
        <form onSubmit={currentUser && currentUser?.role === 'user' ? HandleNewLoans : HandleNewLoansByAdmin } method="POST" className="flex flex-col gap-2 text-slate-500 text-sm p-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="serial">S/N</label>
            <input type="text" id='serial' name='serial' required className="border border-slate-300 focus:outline-0 p-1 px-3 rounded text-sm" disabled/>
          </div>
          {currentUser && currentUser.role === 'admin' && 
            <div className="flex flex-col gap-1">
              <label htmlFor="borrower">User ID</label>
              <input type="text" id='userId' name='userId' placeholder="user id" required className="border border-slate-300 focus:outline-0 p-1 px-3 rounded text-sm" onChange={(e)=> setUserId(e.target.value.trim())} />
            </div>
          }
          <div className="flex flex-col gap-1">
            <label htmlFor="borrower">Borrower</label>
            <input type="text" id='borrower' name='borrower' placeholder="name of borrower" required className="border border-slate-300 focus:outline-0 p-1 px-3 rounded text-sm" onChange={(e)=> setBorrower(e.target.value.trim())} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="loan-details">Loan Details</label>
            <input type="text" id='loan-details' name='loan-details' placeholder="eg Long or Short term" required className="border border-slate-300 focus:outline-0 p-1 px-3 rounded text-sm" onChange={(e)=> setLoanDetails(e.target.value.trim())} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="payment-details">Payment Details</label>
            <input type="tel" id='payment-details' name='payment-details' placeholder="accountName bank accountNumber" required className="border border-slate-300 focus:outline-0 p-1 px-3 rounded text-sm" onChange={(e)=> setPaymentDetails(e.target.value.trim())}/>
            <p className="flex items-start flex-wrap gap-2 text-red-800 text-[9px] italic">Note: Payment Details should be in order: 
              <span className="font-bold">Account Name</span>
              <span className="font-bold">Bank</span>
              <span className="font-bold">Account Number</span>
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="loan-details">Amount</label>
            <input type="text" inputMode="numeric" pattern="[0-9]*" id='loan-details' name='loan-details' placeholder="amount" required className="border border-slate-300 focus:outline-0 p-1 px-3 rounded text-sm" onChange={(e)=> setAmount(e.target.value.trim())} />
          </div>
          <div className="flex items-center justify-end gap-2 mt-3 border-t border-t-slate-200 pt-5">
            <button className="bg-slate-400 p-1 px-3 rounded text-white hover:bg-slate-500 w-20" onClick={()=> setIsLoan(false)}>Cancel</button>
            <button type="submit" className="flex items-center justify-center bg-blue-700 p-1 px-3 rounded text-white hover:bg-blue-800 w-20">
              {isLoading ? <Loader2 size={20} className='animate-spin'/> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default FixedLoan