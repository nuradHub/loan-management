import { X } from "lucide-react"
import { useContext } from "react"
import { AppContext } from "../context/Context"

const FixedUsers = ()=> {

  const {setIsUser} = useContext(AppContext)

  return(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-100 flex items-center justify-center p-5">
      <div className="flex flex-col gap-1 bg-white w-full rounded-xl max-w-100">
        <div className="flex items-center justify-between bg-blue-600 p-3 rounded-t-xl">
          <h3 className="text-sm text-white">Add User</h3>
          <X className="text-white cursor-pointer" size={15} onClick={()=> setIsUser(false)} />
        </div>
        <form action="" className="flex flex-col gap-2 text-slate-500 text-sm p-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <input type="text" id='username' name='username' className="border border-slate-300 focus:outline-0 p-1 px-3 rounded text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input type="password" id='password' name='password' className="border border-slate-300 focus:outline-0 p-1 px-3 rounded text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name</label>
            <input type="text" id='name' name='name' className="border border-slate-300 focus:outline-0 p-1 px-3 rounded text-sm" />
          </div>
          <div className="flex items-center justify-end gap-2 mt-3 border-t border-t-slate-200 pt-5">
            <button className="bg-slate-400 p-1 px-3 rounded text-white hover:bg-slate-500 w-20" onClick={()=> setIsUser(false)}>Cancel</button>
            <button className="bg-blue-700 p-1 px-3 rounded text-white hover:bg-blue-800 w-20">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default FixedUsers