import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

const ContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedMenu, setSelectedMenu] = useState('Home')
  const [isBorrower, setIsBorrower] = useState(false)
  const [isLoan, setIsLoan] = useState(false)
  const [isPayment, setIsPayment] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEligibility, setIsEligibility] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [activeDisbursement, setActiveDisbursement] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [password, setPassword] = useState('')
  const [borrower, setBorrower] = useState('')
  const [loanDetails, setLoanDetails] = useState('')
  const [paymentDetails, setPaymentDetails] = useState('')
  const [status, setStatus] = useState('')
  const [amount, setAmount] = useState('')
  const [tel, setTel] = useState(currentUser?.tel || '')
  const [address, setAddress] = useState(currentUser?.address || '')
  const [taxId, setTaxId] = useState(currentUser?.taxId || '')
  const [creditScore, setCreditScore] = useState(0)
  const [approvedAmount, setApprovedAmount] = useState(0)
  const [userId, setUserId] = useState('')
  const [users, setUsers] = useState([])
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loans, setLoans] = useState([])
  const [acceptedLoans, setAcceptedLoans] = useState([])
  const [rejectedLoans, setRejectedLoans] = useState([])
  const [loanIds, setLoanIds] = useState([])


  const handleCurrentUser = async () => {
    try {
      const response = await axios.get('/current/user')
      if (response.data) {
        setCurrentUser(response.data)
      }
      return response.data
    } catch (err) {
      console.log(err)
      //toast.error(err.response?.data?.message)
    }
  }

  const handleAllUsers = async () => {
    try {
      const response = await axios.get('/users')
      if (response.data) {
        setUsers(response.data)
      }
    } catch (err) {
      console.log(err)
      //toast.error(err.response?.data?.message)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    setCurrentUser(null)
    window.location.href = '/'
  }

  const handleCurrentLoan = async () => {
    try {
      const response = await axios.get('/loan/me')
      if(response.data){
        setLoans(response.data)
      }
    } catch (err) {
      console.log(err.message)
      toast.error(err.response?.data?.message)
    }
  }

  const handleApprovedAmount = async () => {
    try {
      const response = await axios.get('/approved-amount')
      if (response.data) {
        setApprovedAmount(response.data.approvedAmount)
        setCreditScore(response.data.creditScore)
      }
    } catch (err) {
      console.log(err.message)
      toast.error(err.response?.data?.message)
    }
  }

  const getAllLoans = async () => {
    try {
      const response = await axios.get('/loans/all')
      if (response.data) {
        const pending = response.data.filter((loan) => loan.status === 'pending')
        const approved = response.data.filter((loan) => {
          return loan.status === 'approved' || loan.status === 'pending repayment' || loan.status === 'completed'
        })
        const rejected = response.data.filter((loan) => loan.status === 'rejected' )
        const ids = response.data.map((loan) => {
          return {
            loanId: loan._id,
          }
        })
        setLoans(pending)
        setAcceptedLoans(approved)
        setRejectedLoans(rejected)
        setLoanIds(ids)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  const HandleDeleteLoan = async (id) => {

    if(!window.confirm("Are you sure, you want to delete this loan?")) return;
    
    setIsLoading(true)
    try {
      const response = await axios.delete('/delete/one', {
        data: { loanId: id }
      })
      if (response.data) {
        toast.success(response.data.message)
      }
      await getAllLoans()
    } catch (err) {
      console.log(err.message)
      toast.error(err.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (id) => {
    console.log(`Id: ${id}`)
    setIsLoading(true)
    try {
      const response = await axios.delete('/delete/user', {
        data: { userId: id }
      })
      if (response.data) {
        toast.success(response.data.message)
      }
      await handleAllUsers()
      await getAllLoans()
    } catch (err) {
      console.log(err.message)
      toast.error(err.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async () => {
    try {
      const response = await axios.post('/register', {
        fullname: fullname,
        email: email,
        password: password
      })
      setIsUser(false)
      handleAllUsers()
      return response.data
    } catch (err) {
      console.log(err)
      toast.error(err.response?.data?.message) || 'failed to create account'
    }
  }

  const HandleNewLoansByAdmin = async (e)=> {
    e.preventDefault()
    setIsLoading(true)
    try{
      const response = await axios.post('/new-loan/admin', {
        userId: userId,
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
      getAllLoans()
    }catch(err){
      console.log(err.message)
    }finally{
      setIsLoading(false)
    }
  }


  const value = {
    fullname, setFullname,
    email, setEmail,
    password, setPassword,
    selectedMenu, setSelectedMenu,
    isBorrower, setIsBorrower,
    isLoan, setIsLoan,
    isPayment, setIsPayment,
    isUser, setIsUser,
    loans, setLoans,
    borrower, setBorrower,
    loanDetails, setLoanDetails,
    paymentDetails, setPaymentDetails,
    status, setStatus,
    isMenuOpen, setIsMenuOpen,
    viewPassword, setViewPassword,
    isLoading, setIsLoading,
    handleCurrentUser,
    setCurrentUser, currentUser,
    handleLogout,
    handleCurrentLoan,
    amount, setAmount,
    isEligibility, setIsEligibility,
    creditScore, setCreditScore,
    approvedAmount, setApprovedAmount,
    handleApprovedAmount,
    showApproveModal, setShowApproveModal,
    showRejectModal, setShowRejectModal,
    selectedLoan, setSelectedLoan,
    getAllLoans,
    activeDisbursement, setActiveDisbursement,
    HandleDeleteLoan,
    acceptedLoans, setAcceptedLoans,
    setLoanIds, loanIds,
    handleAllUsers,
    users,
    handleRegister,
    setSelectedUser, selectedUser,
    setUserId, userId,
    HandleNewLoansByAdmin,
    handleDeleteUser,
    tel, setTel,
    address, setAddress,
    taxId, setTaxId,
    setIsEditProfile, isEditProfile,
    rejectedLoans
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default ContextProvider