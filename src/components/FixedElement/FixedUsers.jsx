import { X, Loader2 } from "lucide-react"
import { useContext } from "react"
import { AppContext } from "../context/Context"
import { toast } from "react-toastify"

const FixedUsers = () => {

  const { setIsUser, handleRegister, isLoading, setFullname, fullname, email, password, setEmail, setPassword, setIsLoading } = useContext(AppContext)

  const handleNewUser = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!fullname || !email || !password) return;

    try {
      const response = await handleRegister()
      if (response.data) {
        toast.success(response.data.message)
      }
    } catch (err) {
      console.log(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-100 flex items-center justify-center p-5">
      <div className="flex flex-col gap-1 bg-white w-full rounded-xl max-w-100">
        <div className="flex items-center justify-between bg-blue-600 p-3 rounded-t-xl">
          <h3 className="text-sm text-white">Add User</h3>
          <X className="text-white cursor-pointer" size={15} onClick={() => setIsUser(false)} />
        </div>
        <form className="flex flex-col gap-2 text-slate-500 text-sm p-3" onSubmit={handleNewUser} method="POST">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Fullname</label>
            <input type="text" id='name' name='name' placeholder="fullname" className="border border-slate-300 focus:outline-0 p-1 px-3 rounded text-sm" onChange={(e) => setFullname(e.target.value.trim())} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input type="email" id='email' name='email' placeholder="example@gmail.com" className="border border-slate-300 focus:outline-0 p-1 px-3 rounded text-sm" onChange={(e) => setEmail(e.target.value.trim())} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input type="password" id='password' name='password' placeholder="password" className="border border-slate-300 focus:outline-0 p-1 px-3 rounded text-sm" onChange={(e) => setPassword(e.target.value.trim())} />
          </div>
          <div className="flex items-center justify-end gap-2 mt-3 border-t border-t-slate-200 pt-5">
            <button className="bg-slate-400 p-1 px-3 rounded text-white hover:bg-slate-500 w-20" onClick={() => setIsUser(false)}>Cancel</button>
            <button type='submit' className="flex items-center justify-center bg-blue-700 p-1 px-3 rounded text-white hover:bg-blue-800 w-20 disabled:cursor-not-allowed" disabled={isLoading}>
              {isLoading ? <Loader2 size={20} className='animate-spin' /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default FixedUsers