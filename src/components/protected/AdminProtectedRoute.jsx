import { Navigate, Outlet } from "react-router-dom"
import {jwtDecode} from 'jwt-decode'

const AdminProtectedRoute = ()=> {

  const token = localStorage.getItem('token')
  const currentSession = localStorage.getItem('current_session')
  const mySession = sessionStorage.getItem('my_session')

  if(!token || currentSession !== mySession) return <Navigate to='/'/>

  try{
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000

    if(currentTime > decoded.exp){
      localStorage.removeItem('token')
      window.location.href = '/'
    }

    if(token && decoded.role === 'admin'){
      return <Outlet/>
    }else{
      return <Navigate to='/dashboard'/>
    }
  }catch(err){
    console.log(err.message)
    localStorage.removeItem('token')
    window.location.href = '/'
  }
}

export default AdminProtectedRoute