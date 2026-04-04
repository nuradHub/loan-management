import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

const ContextProvider = ({ children }) => {

  const [selectedMenu, setSelectedMenu] = useState('Home')
  const [isBorrower, setIsBorrower] = useState(false)
  const [isLoan, setIsLoan] = useState(false)
  const [isPayment, setIsPayment] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEligibility, setIsEligibility] = useState(false);
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [borrower, setBorrower] = useState('')
  const [loanDetails, setLoanDetails] = useState('')
  const [paymentDetails, setPaymentDetails] = useState('')
  const [status, setStatus] = useState('')
  const [amount, setAmount] = useState('')
  const [creditScore, setCreditScore] = useState(0)
  const [approvedAmount, setApprovedAmount] = useState(0)
  const [currentUser, setCurrentUser] = useState(null)

  const [loans, setLoans] = useState([])

  const handleCurrentUser = async () => {
    try {
      const response = await axios.get('/current/user')
      if (response.data) {
        setCurrentUser(response.data)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.response?.data?.message)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    setCurrentUser(null)
    window.location.href = '/'
  }

  const handleCurrentLoan = async () => {
    try {
      const response = await axios.get('/new-loan')
      if (response.data) {
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
    serialNumber, setSerialNumber,
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
    handleApprovedAmount
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default ContextProvider