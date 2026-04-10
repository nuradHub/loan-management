import './index.css'
import Login from './components/Login'
import { Route, Routes } from 'react-router-dom'
import Register from './components/Register'
import AdminDashboard from './components/admin-dasboard/AdminDashboard'
import UserDashboard from './components/user-dashboard/UserDashboard'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useEffect } from 'react'
import { AppContext } from './components/context/Context'
import ProtectedRoute from './components/protected/ProtectedRoute'
import NoteFound from './components/NotFound'
import AdminProtectedRoute from './components/protected/AdminProtectedRoute'

function App() {

  const {handleCurrentUser, currentUser, setSelectedMenu} = useContext(AppContext)

  useEffect(() => {
    const getCurrentUser = async () => {
      
      const user = await handleCurrentUser(); 
  
      if (user && (!user.address || !user.tel || !user.taxId)) {
        setSelectedMenu('Profile');
      }
    };
    getCurrentUser();
  }, []);

  useEffect(()=> {
   const ActiveSession = ()=> {

    const currentSession = localStorage.getItem('current_session')
    const mySession = sessionStorage.getItem('my_session')

    if(currentSession && mySession && currentSession !== mySession){
      window.location.href = '/'
    }
   }
   window.addEventListener('storage', ActiveSession)
   window.addEventListener('focus', ActiveSession)

   return ()=> {
    window.removeEventListener('storage', ActiveSession)
    window.removeEventListener('focus', ActiveSession)
   }
  },[])

  return (
    <div className='flex flex-col h-screen w-full'>
    <ToastContainer autoClose='2000'/>
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<Register />} />
      <Route path='/admin' element={<AdminProtectedRoute/>}>
        <Route path='dashboard' element={<AdminDashboard />} />
      </Route>
      <Route element={<ProtectedRoute/>}>
        <Route path='/dashboard' element={<UserDashboard />} />
      </Route>
      <Route path='*' element={<NoteFound/>}/>
    </Routes>
    </div>
  )
}

export default App
