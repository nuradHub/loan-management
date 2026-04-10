import { useContext, useEffect, useRef } from "react"
import UserSideBar from "./UserSideBar"
import { AppContext } from "../context/Context"
import { TrendingUp, ArrowRight, Bell, Wallet, History, MessageSquare, UserCircle, Mail, Phone, MapPin, ExternalLink, Calendar, ShieldCheck } from "lucide-react"
import FixedLoan from "../FixedElement/FixedLoan"
import MakePayment from "../FixedElement/MakePayment"
import CheckEligibility from "../FixedElement/CheckEligibility"
import EditProfileModal from "../FixedElement/EditProfileModel"

const UserDashboard = () => {
  
  const { selectedMenu, isLoan, setIsLoan, setIsPayment, loans, setIsMenuOpen, currentUser, handleCurrentLoan, setSelectedMenu, isPayment, isEligibility, setIsEligibility, handleApprovedAmount, approvedAmount, creditScore, setIsEditProfile, isEditProfile } = useContext(AppContext)

  const paymentRef = useRef(null)

  useEffect(()=> {
    const getCurrentLoan = async ()=> {
      try{
       await handleCurrentLoan()
       await handleApprovedAmount()
      }catch(err){
        console.log(err.message)
      }
    }
    getCurrentLoan()
  },[])

  const handleDownload = ()=> {
    window.print()
  }

  return (
    <div className="flex w-full min-h-screen bg-slate-50">
      <UserSideBar />
      {isLoan && <FixedLoan/>}
      {isPayment && <MakePayment/>}
      {isEligibility && <CheckEligibility/>}
      {isEditProfile && <EditProfileModal/>}
      
      <div className="flex-1 flex flex-col w-full overflow-x-hidden">
        {/* Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-lg font-bold text-slate-800">{selectedMenu === 'Home' ? 'Dashboard' : selectedMenu}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
              <Bell size={18} />
            </button>
            {/* Clickable User Icon: triggers setIsMenuOpen for mobile display */}
            <div 
              className="flex items-center gap-2 border-l pl-4 cursor-pointer active:scale-95 transition-all"
              onClick={() => setIsMenuOpen(true)}
            >
              <span className="text-xs font-semibold text-slate-600 hidden md:block">{currentUser?.fullname}</span>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-blue-200">
                {currentUser?.fullname.split('')[0]}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 max-w-6xl mx-auto w-full flex flex-col gap-6">
          
          {/* 1. HOME VIEW */}
          {selectedMenu === 'Home' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#1E293B] rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
                  <div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Balance Due</p>
                    <h2 className="text-3xl font-bold mt-1 tracking-tight">₦{approvedAmount.toLocaleString()}</h2>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <button onClick={() => setIsPayment(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2">
                      Make Payment <ArrowRight size={14} />
                    </button>
                    <button onClick={() => setIsLoan(true)} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-xl font-bold text-xs transition-all">
                      Apply New
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-center gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase">Credit Score</span>
                        <span className={`text-xs font-bold ${creditScore < 30 ? 'text-red-600' : creditScore < 70 ? 'text-yellow-600' : 'text-green-600'}  bg-green-50 px-2 py-0.5 rounded`}>
                          {creditScore < 30 ? 'Low' : creditScore < 70 ? 'Good' : 'Excellent'}
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{creditScore && creditScore} / 100</div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full w-[84%]"></div>
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Recent Loan</h3>
                  <div className="flex flex-col gap-3">
                    {[...loans]?.sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt)).map((loan) => (
                      <div key={loan._id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className='h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs italic'>$</div>
                          <div>
                            <p className="font-bold text-slate-700 text-xs">{loan?.loanDetails}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Ref: {loan?.sn}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold ${loan.status === 'pending' ? 'text-yellow-600' : loan.status === 'approved' ? 'bg-green-100 text-green-400' : loan.status === 'completed' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-600'}} `}>{loan?.status}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-center">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Account Security</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ShieldCheck size={18} /></div>
                    <p className="text-xs text-slate-500 font-medium">Your account is fully verified and protected.</p>
                  </div>
                  <button className="text-blue-600 text-xs font-bold hover:underline w-fit" onClick={()=> setSelectedMenu('Profile')}>Manage Security Settings</button>
                </section>
              </div>
            </div>
          )}

          {/* 2. MY LOANS VIEW */}
          {selectedMenu === 'My Loans' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              {loans.length === 0 ?
                <div>No Active Loan</div>
              :
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...loans]?.sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt)).map((loan) => (
                    <div key={loan._id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Wallet size={18} /></div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-600 uppercase tracking-tighter ${loan.status === 'pending' ? 'text-yellow-600' : loan.status === 'approved' ? 'bg-green-100 text-green-400' : loan.status === 'completed' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-600'}`}>{loan?.status}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{loan?.loanDetails}</h4>
                      <p className="flex flex-col gap-2 flex-wrap items-start text-[11px] text-slate-400 mb-4 md:flex-row">
                        <span>
                          Account Name: {loan?.accountName}
                        </span>
                        <span>
                          Account Number: {loan?.accountNumber}
                        </span>
                        <span>
                          Bank: {loan?.bank}
                        </span>
                      </p>
                      <div className="pt-4 border-t flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</span>
                          <span className="text-lg font-bold text-slate-800">₦{loan?.amount?.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              }
              
            </div>
          )}

          {/* 3. PAYMENTS VIEW */}
          {selectedMenu === 'My Payments' && (
            <div className="max-w-4xl mx-auto w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn" ref={paymentRef} id='payment-receipt'>
                <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-700 text-sm"><History size={16}/> Transaction Log</div>
                    <button className="text-[11px] font-bold text-blue-600 hover:underline" onClick={handleDownload}>Download PDF</button>
                </div>
                <div className="divide-y">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                            <Calendar size={14}/>
                          </div>
                          <div>
                              <p className="text-xs font-bold text-slate-700">Installment Repayment</p>
                              <p className="text-[10px] text-slate-400">Oct {i}, 2026</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-red-500">-₦150.00</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Success</p>
                        </div>
                      </div>
                    ))}
                </div>
            </div>
          )}

          {/* 4. HELP / SUPPORT VIEW */}
          {selectedMenu === 'Help' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                <div className="md:col-span-2 space-y-3">
                    {["How to verify my account", "Understanding interest rates", "Missing a due date"].map((q, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:border-blue-300 transition-all cursor-pointer flex justify-between items-center">
                            {q} <ExternalLink size={14} className="text-slate-300"/>
                        </div>
                    ))}
                </div>
                <div className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col gap-4 text-center">
                    <MessageSquare size={24} className="mx-auto"/>
                    <p className="text-xs font-bold">Agents are Online</p>
                    <button className="bg-white text-blue-600 w-full py-2 rounded-xl text-xs font-bold shadow-lg">Chat with Support</button>
                </div>
            </div>
          )}

          {/* 5. PROFILE / ACCOUNT VIEW */}
          {selectedMenu === 'Profile' && (
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
                  {/* Email */}
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</p>
                    <p className="text-xs font-bold text-slate-700">{currentUser?.email}</p>
                  </div>
          
                  {/* Phone/Tel */}
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</p>
                    <p className="text-xs font-bold text-slate-700">{currentUser?.tel || "_"}</p>
                  </div>
          
                  {/* Tax ID */}
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tax ID / SSN</p>
                    <p className="text-xs font-bold text-slate-700">{currentUser?.taxId || "_"}</p>
                  </div>
          
                  {/* Address - Full width on desktop for better readability */}
                  <div className="p-3 bg-slate-50 rounded-xl sm:col-span-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Residential Address</p>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed">
                      {currentUser?.address || "_"}
                    </p>
                  </div>
                </div>
          
                <div className="flex items-center gap-3">
                  <button className="bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold w-fit px-8 hover:bg-black transition-all" onClick={()=> setIsEditProfile(true)}>
                    Edit Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. LOAN PLANS VIEW */}
          {selectedMenu === 'Loan Plans' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              {[
                { months: 3, rate: '4.5%', tier: 'Basic' },
                { months: 6, rate: '7.2%', tier: 'Premium' },
                { months: 12, rate: '10.5%', tier: 'Corporate' }
              ].map((plan, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:border-blue-400 transition-all flex flex-col justify-between">
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full w-fit mx-auto mb-4">{plan.tier}</span>
                  <h4 className="text-2xl font-bold text-slate-800">{plan.rate}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-6">Interest/Annum</p>
                  <div className="bg-slate-50 py-2 rounded-lg mb-6 text-[11px] font-bold text-slate-700 uppercase">{plan.months} Months Duration</div>
                  <button className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-[11px] hover:bg-blue-600 transition-all" onClick={()=> setIsEligibility(true)}>Check Eligibility</button>
                </div>
              ))}
            </div>
          )}
          
        </main>
      </div>
    </div>
  )
}

export default UserDashboard