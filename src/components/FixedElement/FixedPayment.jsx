import { X } from "lucide-react"
import { useContext } from "react"
import { AppContext } from "../context/Context"


const FixedPayment = ()=> {

  const {setIsPayment} = useContext(AppContext)

  return(
    <div className="fixed inset-0 bg-black/50 z-100  backdrop-blur-xs flex items-center justify-center p-5">
      <div className="flex flex-col gap-1 bg-white w-full rounded-xl max-w-100">
        <div className="flex items-center justify-between bg-blue-600 p-3 rounded-t-xl">
          <h3 className="text-sm text-white">Payment Form</h3>
          <X className="text-white cursor-pointer" size={15} onClick={()=> setIsPayment(false)} />
        </div>
        <form action="" className="flex flex-col gap-2 text-slate-500 text-sm p-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="serial">Reference No</label>
            <select name="options" id="options" className="border border-slate-300 focus:outline-0 p-1 px-3 rounded text-sm" defaultValue=''>
              <option value="" disabled>Select an option</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          
          <div className="flex items-center justify-end gap-2 mt-3 border-t border-t-slate-200 pt-5">
            <button className="bg-slate-400 p-1 px-3 rounded text-white hover:bg-slate-500 w-20" onClick={()=> setIsPayment(false)}>Cancel</button>
            <button className="bg-blue-700 p-1 px-3 rounded text-white hover:bg-blue-800 w-20">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default FixedPayment