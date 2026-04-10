import { useContext, useEffect } from "react"
import LeftSideBar from "./LeftSideBar"
import { AppContext } from "../context/Context"
import { ArrowDown, ArrowUp, Plus, Bell, Loader2, UserCircle } from "lucide-react"
import FixedBorrower from "../FixedElement/FixedBorrower"
import FixedLoan from "../FixedElement/FixedLoan"
import FixedPayment from "../FixedElement/FixedPayment"
import FixedUsers from "../FixedElement/FixedUsers"
import axios from "axios"
import ApproveLoanModal from "./loanmodel/ApproveLoanModal"
import RejectLoanModal from "./loanmodel/RejectLoanModel"
import DisbursementBar from "./loanmodel/DisbursementBar"
import { useState } from "react"
import EditProfileModal from "../FixedElement/EditProfileModel"
import { toast } from "react-toastify"

const AdminDashboard = () => {

  const { selectedMenu, setSelectedMenu, isBorrower, setIsBorrower, isLoan, setIsLoan, isPayment, setIsPayment, isUser, setIsUser, loans, acceptedLoans, setIsMenuOpen, currentUser, showApproveModal, setShowApproveModal, showRejectModal, setShowRejectModal, setSelectedLoan, getAllLoans, activeDisbursement, HandleDeleteLoan, users, handleAllUsers, handleDeleteUser, isEditProfile, setIsEditProfile, rejectedLoans } = useContext(AppContext)

  const [isLoading, setIsLoading] = useState(false)
  const [months, setMonths] = useState(null)
  const [interest, setInterest] = useState(null)
  const [penalty, setPenalty] = useState(null)
  const [loanId, setLoanId] = useState(null)
  const [name, setName] = useState(null)
  const [description, setDescription] = useState(null)
  const [loanPlan, setLoanPlan] = useState([])
  const [loanType, setLoanType] = useState([])

  const getLoanPlan = async () => {
    try {
      const response = await axios.get('/loan-plans')
      if (response.data) {
        setLoanPlan(response.data)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  const getLoanType = async () => {
    try {
      const response = await axios.get('/loan-types')
      if (response.data) {
        setLoanType(response.data)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  const handleNewLoanPlan = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post('/loan-plans', {
        months: Number(months),
        interest: Number(interest),
        penalty: Number(penalty),
        loanId: loanId
      })
      if (response.data) {
        toast.success(response.data.message)
      }
      setLoanId('')
      setMonths('')
      setInterest('')
      setPenalty('')
      await getLoanPlan()
    } catch (err) {
      console.log(err.message)
      toast.error(err.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewLoanType = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post('/loan-types', {
        name: name,
        description: description,
        loanId: loanId
      })
      if (response.data) {
        toast.success(response.data.message)
      }
      setLoanId('')
      setName('')
      setDescription('')
      await getLoanType()
    } catch (err) {
      console.log(err.message)
      toast.error(err.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLoanPlan = async (id) => {
    if (!window.confirm("Are you sure, you want to delete this plan?")) return;

    try {
      const response = await axios.delete(`/loan-plans/${id}`, {
        data: { loanPlanId: id }
      })
      if (response.data) {
        toast.success(response.data.message)
      }
      await getLoanPlan()
    } catch (err) {
      console.log(err.message)
      toast.error(err.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLoanType = async (id) => {
    if (!window.confirm("Are you sure, you want to delete this plan?")) return;

    try {
      const response = await axios.delete(`/loan-types/${id}`, {
        data: { loanTypeId: id }
      })
      if (response.data) {
        toast.success(response.data.message)
      }
      await getLoanType()
    } catch (err) {
      console.log(err.message)
      toast.error(err.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyRepayment = async (loanId, method) => {
    const confirmMsg = method === 'Cash'
      ? "Are you sure you have received physical cash for this loan?"
      : "Confirm RRR verification?";

    if (!window.confirm(confirmMsg)) return;

    setIsLoading(true);

    try {
      const response = await axios.put('/admin/verify-repayment', {
        loanId,
        paymentMethod: method
      });

      if (response.data) {
        toast.success(`Payment confirmed via ${method}`);
        await getAllLoans();
      }
    } catch (err) {
      toast.error("Failed to verify payment");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      await getAllLoans()
      await handleAllUsers()
      await getLoanPlan()
      await getLoanType()
    }
    getProfile()
  }, [])

  const activeLoansCount = acceptedLoans.filter(loan => loan.status === 'approved').length;
  const totalBorrowers = loans?.filter(loan => loan.status === 'pending').length || 0;

  const paymentsToday = acceptedLoans.filter(loan => {
    const isToday = new Date(loan.updatedAt).toDateString() === new Date().toDateString();
    return loan.status === 'pending repayment' && isToday;
  }).length;

  const pendingRequestsCount = loans.filter(loan => loan.status === 'pending').length;

  const overdueLoansCount = loans?.filter(loan => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return loan.status === 'approved' && new Date(loan.createdAt) < oneMonthAgo;
  }).length || 0;

  const totalBorrowersCount = users?.length || 0;
  const targetBorrowers = 200;
  const progressPercentage = Math.min((totalBorrowersCount / targetBorrowers) * 100, 100);

  const handlePrint = ()=> {
    window.print()
  }

  return (
    <div className="flex w-full h-screen">
      {/* Fixed Components */}
      {isBorrower && <FixedBorrower />}
      {isLoan && <FixedLoan />}
      {isPayment && <FixedPayment />}
      {isUser && <FixedUsers />}
      {showApproveModal && <ApproveLoanModal />}
      {showRejectModal && <RejectLoanModal />}
      {activeDisbursement && <DisbursementBar />}
      {isEditProfile && <EditProfileModal />}

      {/* Left side bar */}
      <LeftSideBar />

      {/*Body contents */}
      <div className="flex-1 flex flex-col bg-slate-50 w-full overflow-x-hidden">

        {/* Header/Navbar Section with Notification and User Icon */}
        <div className="flex items-center bg-white p-5 shadow shadow-slate-200 justify-between px-4 mb-5">
          <h3 className="text-slate-400 text-2xl">
            {selectedMenu === 'Loans' ? 'Loan List' : selectedMenu === 'Payments' ? 'Payment List' : selectedMenu}
          </h3>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all">
              <Bell size={18} />
            </button>
            <div
              className="flex items-center gap-2 border-l pl-4 cursor-pointer active:scale-95 transition-all"
              onClick={() => setIsMenuOpen(true)}
            >
              <span className="text-xs font-semibold text-slate-600 hidden md:block">{currentUser?.fullname}</span>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {currentUser?.fullname.split('')[0]}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 w-full p-4 ">
          {selectedMenu !== 'Loan Plans' && selectedMenu !== 'Loan Types' && selectedMenu !== 'Home' && selectedMenu !== 'Profile' && selectedMenu !== 'Repayments' && selectedMenu !== 'Rejected' &&
            <div>
              <button className="flex items-center gap-2 bg-green-500 p-2 px-3 text-white rounded-xl hover:bg-green-600" onClick={() => { selectedMenu === 'Borrowers' ? setIsBorrower(true) : selectedMenu === 'Loans' ? setIsLoan(true) : selectedMenu === 'Payments' ? setIsPayment(true) : selectedMenu === 'Users' ? setIsUser(true) : '' }}>
                <Plus size={20} />
                {selectedMenu === 'Home' ? 'Home' : selectedMenu === 'Loans' ? 'Create new Loan Application' : selectedMenu === 'Payments' ? 'New Payment' : selectedMenu === 'Borrowers' ? 'Add Borrowers' : selectedMenu === 'Users' ? 'Add Users' : selectedMenu === 'Profile' ? 'Profile' : selectedMenu === 'Repayments' ? 'Repayments' : selectedMenu === 'Rejected' && 'Rejected Loans'}
              </button>
            </div>
          }

          {selectedMenu === 'Home' ?
            <div className="flex flex-col gap-8 w-full animate-fadeIn" id='dashboard'>
              {/* 1. Header Section */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-slate-700">Dashboard Overview</h1>
                <p className="text-sm text-slate-500">Welcome back, here is what's happening today.</p>
              </div>

              {/* 2. Metric Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-600 flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Active Loans</span>
                  <span className="text-2xl font-bold text-slate-800">{activeLoansCount && activeLoansCount}</span>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-500 flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Payments Today</span>
                  <span className="text-2xl font-bold text-slate-800">₦{paymentsToday && paymentsToday}</span>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-yellow-500 flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Pending Requests</span>
                  <span className="text-2xl font-bold text-slate-800">{pendingRequestsCount && pendingRequestsCount}</span>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-red-500 flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Overdue Loans</span>
                  <span className="text-2xl font-bold text-slate-800">{overdueLoansCount && overdueLoansCount}</span>
                </div>
              </div>

              {/* 3. Main Dashboard Content Area */}
              <div className="flex flex-col lg:flex-row gap-5">
                {/* Recent Loans Table (70% width) */}
                <div className="flex-2 bg-white shadow-sm p-5 rounded border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-slate-700">Recent Loan Applications</h2>
                    <button className="text-blue-600 text-xs hover:underline" onClick={()=> setSelectedMenu('Loans')}>View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-[10px] uppercase text-slate-400 p-2 text-left border-b">Borrower</th>
                          <th className="text-[10px] uppercase text-slate-400 p-2 text-left border-b">Amount</th>
                          <th className="text-[10px] uppercase text-slate-400 p-2 text-left border-b">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...loans]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(loan =>
                          <tr className="border-b last:border-0" key={loan._id}>
                            <td className="p-3 text-sm text-slate-600">{loan?.borrower}</td>
                            <td className="p-3 text-sm text-slate-600 font-medium">₦{loan?.amount?.toLocaleString()}</td>
                            <td className="p-3 text-xs">
                              <span className={`px-2 py-0.5 rounded-full font-medium ${loan.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : loan.status === 'approved' ? 'bg-green-100 text-green-400' : loan.status === 'completed' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-600'}`}>{loan.status}</span>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Actions or Analytics */}
                <div className="flex-1 bg-white shadow-sm p-5 rounded border border-slate-100">
                  <h2 className="font-bold text-slate-700 mb-4">System Summary</h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Total Borrowers</span>
                      <span className="font-bold text-slate-700">{totalBorrowers && totalBorrowers}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full" style={{ width: `${progressPercentage}%`}}></div>
                    </div>
                    <p className="text-[11px] text-slate-400">{progressPercentage}% of targets reached for this month's collection.</p>
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors" onClick={handlePrint}>
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
            : selectedMenu === 'Loans' ?
              <div className="flex flex-col gap-5 w-full bg-white shadow shadow-black/20 p-5 rounded overflow-x-hidden">
                <div className="flex items-center gap-10 justify-between text-slate-400 overflow-x-scroll">
                  <div className="flex items-center gap-2 text-sm">Show
                    <select className="bg-slate-100 p-1 border-0 focus:outline-0">
                      <option value="5">5</option>
                      <option value="10">10</option>
                    </select>
                    Entries
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    Search
                    <input type="text" placeholder="Search" className="border border-slate-300 p-1 rounded focus:outline-0 max-w-35" />
                  </div>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse border border-slate-200">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Ref No.</th>
                        <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Borrower</th>
                        <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Detail</th>
                        <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Payment Account</th>
                        <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Credit Score</th>
                        <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Status</th>
                        <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...loans]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((loan) =>
                        <tr key={loan._id} className="hover:bg-slate-50 transition-colors">
                          <td className="border border-slate-200 text-xs text-slate-400 p-2 font-mono">{loan.sn}</td>
                          <td className="border border-slate-200 text-xs text-slate-600 p-2 font-bold">{loan.borrower}</td>
                          <td className="border border-slate-200 text-xs text-slate-400 p-2">{loan.loanDetails}</td>
                          <td className="border border-slate-200 text-xs text-slate-400 p-2 font-mono">{loan.accountName + " " + loan.bank + " " + loan.accountNumber}</td>
                          <td className="border border-slate-200 text-xs text-slate-600 p-2 font-bold">{loan.creditScore}</td>
                          <td className="border border-slate-200 text-xs p-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${loan.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : loan.status === 'approved' ? 'bg-green-100 text-green-400' : loan.status === 'completed' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-600'}`}>
                              {loan.status}
                            </span>
                          </td>
                          <td className="border border-slate-200 text-sm p-2">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => { setSelectedLoan(loan); setShowApproveModal(true); }} className="bg-green-600 text-white p-1 rounded px-2 hover:bg-green-700 text-[10px] font-bold uppercase"> Approve </button>
                              <button onClick={() => { setSelectedLoan(loan); setShowRejectModal(true); }} className="bg-red-600 text-white p-1 rounded px-2 hover:bg-red-700 text-[10px] font-bold uppercase"> Reject </button>
                              <button onClick={() => HandleDeleteLoan(loan._id)} className="bg-gray-400 text-white p-1 rounded px-2 hover:bg-gray-500 text-[10px] font-bold uppercase disabled:opacity-50" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin mx-auto" size={10} /> : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              : selectedMenu === 'Borrowers' ?
                <div className="flex flex-col gap-5 w-full bg-white shadow shadow-black/20 p-5 rounded overflow-x-hidden">
                  <div className="flex items-center justify-between text-slate-400 overflow-x-scroll">
                    <div className="flex items-center gap-2 text-sm">Show
                      <select className="bg-slate-100 p-1 border-0 focus:outline-0">
                        <option value="10">10</option>
                      </select>
                      Entries
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      Search
                      <input type="text" placeholder="Search Borrower" className="border border-slate-300 p-1 rounded focus:outline-0 max-w-35" />
                    </div>
                  </div>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse border border-slate-200">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Fullname</th>
                          <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Contact No</th>
                          <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Address</th>
                          <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Email</th>
                          <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Tax ID</th>
                          <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...loans]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((loan) =>
                          <tr key={loan._id} className="hover:bg-slate-50 transition-colors">
                            <td className="border border-slate-200 text-xs text-slate-600 font-bold p-2">{loan?.borrower}</td>
                            <td className="border border-slate-200 text-xs text-slate-400 p-2 font-mono">{loan?.user?.tel}</td>
                            <td className="border border-slate-200 text-xs text-slate-400 p-2">{loan?.user?.address}</td>
                            <td className="border border-slate-200 text-xs text-slate-400 p-2">{loan?.user?.email}</td>
                            <td className="border border-slate-200 text-xs text-slate-400 p-2 font-mono">{loan?.user?.taxId}</td>
                            <td className="border border-slate-200 text-sm p-2 text-center">
                              <div className="flex gap-2 justify-center">
                                <button onClick={() => { setSelectedLoan(loan); setShowApproveModal(true); }} className="bg-green-600 text-white p-1 rounded px-2 hover:bg-green-700 text-[10px] font-bold uppercase"> Approve </button>
                                <button onClick={() => HandleDeleteLoan(loan._id)} className="bg-gray-400 text-white p-1 rounded px-2 hover:bg-gray-500 text-[10px] font-bold uppercase"> Delete </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                : selectedMenu === 'Loan Plans' ?
                  <div className="flex flex-col items-start gap-5 md:flex-row">
                    <div className="bg-white p-3 rounded shadow shadow-slate-300 max-w-80 w-full h-fit">
                      <form className="flex flex-col gap-3 text-slate-400" onSubmit={handleNewLoanPlan} method='POST'>
                        <div className="flex flex-col gap-2 w-full">
                          <label className="text-[10px] uppercase font-bold">Loan (ID)</label>
                          <input type="text" required value={loanId} placeholder="eg 4" className="text-sm p-2 border border-slate-200 focus:border-blue-500 focus:outline-0 rounded w-full" onChange={(e) => setLoanId(e.target.value.trim())} />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <label className="text-[10px] uppercase font-bold">Plan (Months)</label>
                          <input type="text" inputMode="numeric" pattern="[0-9]*" required value={months} placeholder="eg 4" className="text-sm p-2 border border-slate-200 focus:border-blue-500 focus:outline-0 rounded w-full" onChange={(e) => setMonths(e.target.value.trim())} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase font-bold">Interest (%)</label>
                          <div className="relative w-full">
                            <input type="text" inputMode="numeric" pattern="[0-9]*" required value={interest} placeholder="eg 2" className="text-sm p-2 pr-8 border border-slate-200 focus:border-blue-500 focus:outline-0 rounded w-full" onChange={(e) => setInterest(e.target.value.trim())} />
                            <span className="absolute bg-slate-200 text-xs text-slate-600 h-full flex items-center top-0 right-0 px-2 rounded-r">%</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <label className="text-[10px] uppercase font-bold">Penalty (%)</label>
                          <input type="text" inputMode="numeric" pattern="[0-9]*" required value={penalty} placeholder="eg 10" className="text-sm p-2 border border-slate-200 focus:border-blue-500 focus:outline-0 rounded w-full" onChange={(e) => setPenalty(e.target.value.trim())} />
                        </div>
                        <button type='submit' className="flex items-center justify-center bg-blue-600 p-2 rounded-lg text-white text-xs font-bold hover:bg-blue-700 transition-all uppercase mt-2 disabled:cursor-not-allowed" disabled={isLoading}>{isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Save Plan'}</button>
                      </form>
                    </div>
                    <div className="flex flex-col gap-5 w-full bg-white shadow shadow-black/20 p-5 rounded overflow-x-hidden">
                      <div className="overflow-x-auto w-full">
                        <table className="w-full border-collapse border border-slate-200">
                          <thead>
                            <tr className="bg-slate-50">
                              <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Loan (ID)</th>
                              <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Plan (Months)</th>
                              <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Interest (%)</th>
                              <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Overdue Penalty (%)</th>
                              <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...loanPlan]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(loan =>
                              <tr className="hover:bg-slate-50 transition-colors" key={loan._id}>
                                <td className="border border-slate-200 text-xs text-slate-600 p-2 font-bold">{loan.loanId}</td>
                                <td className="border border-slate-200 text-xs text-slate-600 p-2 font-bold">{loan.months} Months</td>
                                <td className="border border-slate-200 text-xs text-slate-600 p-2">{loan.interest}%</td>
                                <td className="border border-slate-200 text-xs text-red-600 p-2">{loan.penalty}%</td>
                                <td className="border border-slate-200 text-sm p-2 text-center">
                                  <span className="bg-red-50 text-red-600 text-[10px] p-1 px-3 rounded font-bold uppercase cursor-pointer hover:bg-red-100" onClick={() => handleDeleteLoanPlan(loan._id)}>Delete</span>
                                </td>
                              </tr>
                            )}

                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  : selectedMenu === 'Loan Types' ?
                    <div className="flex flex-col items-start gap-5 md:flex-row">
                      <div className="bg-white p-3 rounded shadow shadow-slate-300 max-w-80 w-full h-fit">
                        <form className="flex flex-col gap-3 text-slate-400" onSubmit={handleNewLoanType} method='POST'>
                          <div className="flex flex-col gap-2 w-full">
                            <label className="text-[10px] uppercase font-bold">Loan (ID)</label>
                            <input type="text" className="text-sm p-2 border border-slate-200 focus:border-blue-500 focus:outline-0 rounded w-full" placeholder='eg Business Loan' required value={loanId} onChange={(e) => setLoanId(e.target.value.trim())} />
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <label className="text-[10px] uppercase font-bold">Loan Type</label>
                            <input type="text" className="text-sm p-2 border border-slate-200 focus:border-blue-500 focus:outline-0 rounded w-full" placeholder='eg Business Loan' required value={name} onChange={(e) => setName(e.target.value)} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase font-bold">Description</label>
                            <textarea className="text-sm p-2 border border-slate-200 focus:border-blue-500 focus:outline-0 rounded w-full resize-none" rows="3" required value={description} placeholder='eg For SME development...' onChange={(e) => setDescription(e.target.value)} />
                          </div>
                          <button type='submit' className="flex items-center justify-center bg-blue-600 p-2 rounded-lg text-white text-xs font-bold hover:bg-blue-700 transition-all uppercase disabled:cursor-not-allowed" disabled={isLoading}>{isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Save Type'}</button>
                        </form>
                      </div>
                      <div className="flex-1 bg-white shadow shadow-black/20 p-5 rounded">
                        <table className="w-full border-collapse border border-slate-200">
                          <thead>
                            <tr className="bg-slate-50">
                              <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Loan ID</th>
                              <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Type</th>
                              <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Description</th>
                              <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...loanType]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(loan =>
                              <tr className="hover:bg-slate-50 transition-colors" key={loan._id}>
                                <td className="border border-slate-200 text-xs text-slate-600 p-2 font-bold">{loan.loanId}</td>
                                <td className="border border-slate-200 text-xs text-slate-600 p-2 font-bold">{loan.name}</td>
                                <td className="border border-slate-200 text-xs text-slate-400 p-2 italic text-wrap">{loan.description}</td>
                                <td className="border border-slate-200 text-sm p-2 text-center text-red-600 font-bold uppercase text-[10px] cursor-pointer hover:underline" onClick={() => handleDeleteLoanType(loan._id)}>Delete</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    : selectedMenu === 'Payments' ? (
                      <div className="flex flex-col gap-5 w-full bg-white shadow shadow-black/20 p-5 rounded overflow-x-hidden">
                        <div className="flex items-center gap-10 justify-between text-slate-400 overflow-x-scroll">
                          <div className="flex items-center gap-2 text-sm">Show
                            <select className="bg-slate-100 p-1 border-0 focus:outline-0">
                              <option value="5">5</option>
                              <option value="10">10</option>
                            </select>
                            Entries
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            Search
                            <input type="text" placeholder="Search Payee" className="border border-slate-300 p-1 rounded focus:outline-0 max-w-35" />
                          </div>
                        </div>

                        <div className="overflow-x-auto w-full">
                          <table className="w-full border-collapse border border-slate-200">
                            <thead>
                              <tr className="bg-slate-50">
                                <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Ref No.</th>
                                <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Payee</th>
                                <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Amount</th>
                                <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">RRR Number</th>
                                <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Status</th>
                                <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...acceptedLoans]?.filter(loan => loan.status !== 'completed')
                                ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map((loan) => (
                                  <tr key={loan._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="border border-slate-200 text-xs text-slate-600 p-2 font-mono">{loan.sn}</td>
                                    <td className="border border-slate-200 text-xs text-slate-600 p-2 font-bold">{loan.borrower}</td>
                                    <td className="border border-slate-200 text-xs text-slate-600 p-2">₦{Number(loan.amount).toLocaleString()}</td>
                                    <td className="border border-slate-200 text-xs text-blue-600 p-2 font-bold">
                                      {loan.rrrNumber || <span className="text-slate-300 italic font-normal text-[10px]">Awaiting User...</span>}
                                    </td>
                                    <td className="border border-slate-200 text-xs p-2">
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${loan.status === 'pending repayment' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {loan.status}
                                      </span>
                                    </td>
                                    <td className="border border-slate-200 text-sm p-2 text-center">
                                      <div className="flex flex-col gap-1 items-center">
                                        {/* If they sent an RRR, show the primary button */}
                                        {loan.status === 'pending repayment' ? (
                                          <button
                                            onClick={() => handleVerifyRepayment(loan._id, 'Online')}
                                            className="w-full bg-green-600 text-white text-[9px] px-2 py-1 rounded font-bold hover:bg-green-700 transition-all uppercase"
                                          >
                                            Verify RRR
                                          </button>
                                        ) : loan.status === 'approved' ? (
                                          /* If they are at the office with cash */
                                          <button
                                            onClick={() => handleVerifyRepayment(loan._id, 'Cash')}
                                            className="w-full bg-slate-800 text-white text-[9px] px-2 py-1 rounded font-bold hover:bg-black transition-all uppercase"
                                          >
                                            Receive Cash
                                          </button>
                                        ) : (
                                          <span className="text-green-600 font-bold text-[10px]">Settled</span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                      : selectedMenu === 'Repayments' ?
                        <div className="flex flex-col gap-5 w-full bg-white shadow shadow-black/20 p-5 rounded overflow-x-hidden">
                          <div className="flex items-center justify-between text-slate-400">
                            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Settled Loan History</h3>
                            <div className="text-xs">Total Records: {acceptedLoans.filter(l => l.status === 'completed').length}</div>
                          </div>

                          <div className="overflow-x-auto w-full">
                            <table className="w-full border-collapse border border-slate-200">
                              <thead>
                                <tr className="bg-slate-50">
                                  <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Ref No.</th>
                                  <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Payee</th>
                                  <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Amount Settled</th>
                                  <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Status</th>
                                  <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-center">Finalized Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {[...acceptedLoans]
                                  .filter(loan => loan.status === 'completed') // <--- FILTER FOR COMPLETED
                                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                                  .map((loan) => (
                                    <tr key={loan._id} className="hover:bg-green-50/30 transition-colors">
                                      <td className="border border-slate-200 text-xs text-slate-400 p-2 font-mono">{loan.sn}</td>
                                      <td className="border border-slate-200 text-xs text-slate-700 p-2 font-bold">{loan.borrower}</td>
                                      <td className="border border-slate-200 text-xs text-slate-700 p-2">₦{Number(loan.amount).toLocaleString()}</td>
                                      <td className="border border-slate-200 text-xs p-2">
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700 uppercase">
                                          {loan.status}
                                        </span>
                                      </td>
                                      <td className="border border-slate-200 text-[10px] text-slate-400 p-2 text-center">
                                        {new Date(loan.updatedAt).toLocaleDateString()}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        : selectedMenu === 'Rejected' ?
                          <div className="flex flex-col gap-5 w-full bg-white shadow shadow-black/20 p-5 rounded overflow-x-hidden">
                            <div className="flex items-center justify-between text-slate-400">
                              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Rejected Applications</h3>
                              <div className="text-xs">
                                Total Rejected: {loans.filter(l => l.status === 'rejected').length}
                              </div>
                            </div>

                            <div className="overflow-x-auto w-full">
                              <table className="w-full border-collapse border border-slate-200">
                                <thead>
                                  <tr className="bg-slate-50">
                                    <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Ref No.</th>
                                    <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Borrower</th>
                                    <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Amount Requested</th>
                                    <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Rejection Reason</th>
                                    <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Status</th>
                                    <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-center">Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[...rejectedLoans]?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((loan) => (
                                    <tr key={loan._id} className="hover:bg-red-50/30 transition-colors">
                                      <td className="border border-slate-200 text-xs text-slate-400 p-2 font-mono">{loan.sn}</td>
                                      <td className="border border-slate-200 text-xs text-slate-700 p-2 font-bold">{loan.borrower}</td>
                                      <td className="border border-slate-200 text-xs text-slate-700 p-2">₦{Number(loan.amount).toLocaleString()}</td>
                                      <td className="border border-slate-200 text-[10px] text-red-600 p-2 italic max-w-xs truncate">
                                        {loan.rejectionReason || "No reason provided"}
                                      </td>
                                      <td className="border border-slate-200 text-xs p-2">
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-700 uppercase">
                                          {loan.status}
                                        </span>
                                      </td>
                                      <td className="border border-slate-200 text-[10px] text-slate-400 p-2 text-center">
                                        {new Date(loan.updatedAt).toLocaleDateString()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          : selectedMenu === 'Users' ?
                            <div className="flex flex-col gap-5 w-full bg-white shadow shadow-black/20 p-5 rounded overflow-x-hidden">
                              <div className="flex items-center justify-between text-slate-400 overflow-x-scroll">
                                <div className="flex items-center gap-2 text-sm">Show
                                  <select className="bg-slate-100 p-1 border-0 focus:outline-0">
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                  </select>
                                  Entries
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  Search
                                  <input type="text" placeholder="Search Users" className="border border-slate-300 p-1 rounded focus:outline-0 max-w-35" />
                                </div>
                              </div>
                              <div className='overflow-x-auto w-full'>
                                <table className="w-full border-collapse border border-slate-200">
                                  <thead>
                                    <tr className="bg-slate-50">
                                      <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">User ID</th>
                                      <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Fullname</th>
                                      <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-left">Email Address</th>
                                      <th className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-200 p-2 font-bold text-center">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[...users]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(user =>
                                      <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="border border-slate-200 text-xs text-slate-400 p-2 font-mono">{user?._id}</td>
                                        <td className="border border-slate-200 text-xs text-slate-600 font-bold p-2">{user?.fullname}</td>
                                        <td className="border border-slate-200 text-xs text-slate-600 p-2">{user?.email}</td>
                                        <td className="border border-slate-200 text-sm p-2 text-center">
                                          <button onClick={() => handleDeleteUser(user?._id)} className="bg-red-50 text-red-600 p-1 px-3 rounded font-bold text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all">
                                            {isLoading ? <Loader2 className="animate-spin mx-auto" size={12} /> : 'Remove'}
                                          </button>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            : selectedMenu === 'Profile' && (
                              <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm animate-fadeIn overflow-hidden">
                                <div className="h-24 bg-slate-100 border-b relative px-8 flex items-end">
                                  <div className="h-16 w-16 bg-white p-1 rounded-xl translate-y-6 shadow-md border">
                                    <div className="h-full w-full bg-slate-800 rounded-lg flex items-center justify-center text-white">
                                      <UserCircle size={30} />
                                    </div>
                                  </div>
                                </div>

                                <div className="p-8 pt-10 flex flex-col gap-6">
                                  <div>
                                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">{currentUser?.fullname}</h2>
                                    <p className="text-xs font-medium text-slate-400">
                                      Personal Account • Joined {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-6">
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</p>
                                      <p className="text-xs font-bold text-slate-700">{currentUser?.email}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</p>
                                      <p className="text-xs font-bold text-slate-700">{currentUser?.tel || "_"}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tax ID / SSN</p>
                                      <p className="text-xs font-bold text-slate-700">{currentUser?.taxId || "_"}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl sm:col-span-2">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Residential Address</p>
                                      <p className="text-xs font-bold text-slate-700 leading-relaxed">
                                        {currentUser?.address || "_"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <button className="bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold w-fit px-8 hover:bg-black transition-all" onClick={() => setIsEditProfile(true)}>
                                      Edit Account
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )
          }
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
