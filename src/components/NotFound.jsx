import { useNavigate } from "react-router-dom"

const NoteFound = ()=> {
  const navigate = useNavigate()

  const navigateToHome = ()=> {
    const token = localStorage.getItem('token')
    if(!token){
      window.location.href = '/'
    }else{
      navigate('/loan-management/dashboard')
    }
  }

  return(
    <div className="flex flex-col w-full h-full items-center justify-center bg-linear-to-b from-blue-700 from-50% to-white to-50%">
      <div className="flex flex-col w-full mx-auto">
        <h3 className=" text-6xl font-bold tracking-widest text-white font-montserrat text-center">404</h3>
        <img src="/img/404.gif" className="w-100 mx-auto lg:w-130" alt="" />
        <div className="flex flex-col gap-3 items-center">
          <h3 className="text-xl font-bold">Looks like you're lost</h3>
          <p className="text-sm text-gray-500">The page you are looking for is not available</p>
          <button onClick={navigateToHome} className="btn">Go to Home</button>
        </div>
      </div>
    </div>
  )
}

export default NoteFound