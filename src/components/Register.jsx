import {Eye, Loader2, SendHorizonal} from 'lucide-react'
import { useContext } from 'react'
import {Link} from 'react-router-dom'
import { AppContext } from './context/Context'
import { toast } from 'react-toastify'
import axios from 'axios'

const Register = ()=> {

  const {viewPassword, setViewPassword, isLoading, setIsLoading, fullname, setFullname, email, setEmail, password, setPassword} = useContext(AppContext)

  const handleRegister = async (e)=> {
    e.preventDefault()
    setIsLoading(true)

    if(!fullname || !email || !password) return;

    try{
      const response = await axios.post('/register', {
        fullname: fullname,
        email: email,
        password: password
      })
      if(response.data){
        toast.success(response.data?.message)
      }
      setFullname('')
      setEmail('')
      setPassword('')
    }catch(err){
      console.log(err)
      toast.error(err.response?.data?.message) || 'failed to create account'
    }finally{
      setIsLoading(false)
    }
  }

  return(
    <div className="flex items-center justify-center h-screen w-full bg-white">
      <div className="w-full flex flex-col max-w-300 mx-auto gap-5 md:flex-row bg-white shadow shadow-slate-300">
        <div className="flex-1 max-w-190 ">
          <img src="/img/loan-bg.jpg" alt="loan image" className="animate-pulse h-full w-full" />
        </div>
        <div className="flex-1 w-full p-1 rounded-2xl bg-white md:p-5">
          <form className="flex flex-col gap-8 p-5" onSubmit={handleRegister} method='POST'>
            <div className="text-center text-3xl font-bold uppercase"><h3>Register</h3></div>
            <input type="text" name="name" id="name" placeholder="Full name" className="border border-gray-400 p-3 py-4 focus:outline-0 rounded-3xl text-2xl focus:border-blue-300 "  required onChange={(e)=> setFullname(e.target.value.trim())} />

            <input type="email" name="email" id="email" placeholder="your@gmail.com" className="border border-gray-400 p-3 py-4 focus:outline-0 rounded-3xl text-2xl focus:border-blue-300 " required onChange={(e)=> setEmail(e.target.value.trim())} />

            <div className='flex items-center relative w-full'>
              <input type={viewPassword ? 'text' : 'password'} name="password" id="password" placeholder="*********" className="border border-gray-400 p-3 py-4 focus:outline-0 rounded-3xl text-2xl focus:border-blue-300 w-full" required minLength='5' onChange={(e)=> setPassword(e.target.value.trim())} />
              <Eye size={20} className='absolute right-5 cursor-pointer md:right-10' onClick={()=> setViewPassword(!viewPassword)}/>
            </div>

            <div className='relative flex items-center w-full transform group'>
              <button type="submit" className="flex items-center justify-center p-3 bg-blue-800 text-3xl rounded-xl text-white shadow shadow-slate-600 w-full transition-transform duration-200 group-hover:scale-101">
                {isLoading ? <Loader2 size={35} className='animate-spin'/> : 'Register'}
              </button>
              <SendHorizonal size={24} className={`absolute right-[22%] transition-all text-white group-hover:right-[20%] md:right-[33%] md:group-hover:right-[31%] ${isLoading && 'hidden'}`}/>
            </div>
            <div>
            <div className='flex items-center gap-2 text-slate-600'>
                Already have account? 
              <Link to='/' className='text-blue-900'>Login</Link>
            </div>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register