import { useContext } from "react"
import LeftSideBar from "./LeftSideBar"
import { AppContext } from "../context/Context"
import { ArrowDown, ArrowUp, Plus, Bell } from "lucide-react"
import FixedBorrower from "../FixedElement/FixedBorrower"
import FixedLoan from "../FixedElement/FixedLoan"
import FixedPayment from "../FixedElement/FixedPayment"
import FixedUsers from "../FixedElement/FixedUsers"

const AdminDashboard = () => {

  const { selectedMenu, isBorrower, setIsBorrower, isLoan, setIsLoan, isPayment, setIsPayment, isUser, setIsUser, loans, setLoans, setIsMenuOpen, currentUser } = useContext(AppContext)

  const HandleDelete = (sn) => {
    console.log(sn)
    const result = loans.filter((loan) => loan.sn !== sn)
    console.log(result)
    setLoans([...result])
  }

  return (
    <div className="flex w-full h-screen">
      {/* Fixed Components */}
      {isBorrower && <FixedBorrower />}
      {isLoan && <FixedLoan />}
      {isPayment && <FixedPayment />}
      {isUser && <FixedUsers />}
      
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
          {selectedMenu !== 'Loan Plans' && selectedMenu !== 'Loan Types' && selectedMenu !== 'Home' &&
            <div>
              <button className="flex items-center gap-2 bg-green-500 p-2 px-3 text-white rounded-xl hover:bg-green-600" onClick={() => { selectedMenu === 'Borrowers' ? setIsBorrower(true) : selectedMenu === 'Loans' ? setIsLoan(true) : selectedMenu === 'Payments' ? setIsPayment(true) : selectedMenu === 'Users' ? setIsUser(true) : '' }}>
                <Plus size={20} />
                {selectedMenu === 'Home' ? 'Home' : selectedMenu === 'Loans' ? 'Create new Loan Application' : selectedMenu === 'Payments' ? 'New Payment' : selectedMenu === 'Borrowers' ? 'Add Borrowers' : selectedMenu === 'Users' && 'Add Users'}
              </button>
            </div>
          }
          
          {selectedMenu === 'Home' ?
            <div className="flex flex-col gap-8 w-full animate-fadeIn">
              {/* 1. Header Section */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-slate-700">Dashboard Overview</h1>
                <p className="text-sm text-slate-500">Welcome back, here is what's happening today.</p>
              </div>

              {/* 2. Metric Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-600 flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Active Loans</span>
                  <span className="text-2xl font-bold text-slate-800">24</span>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-500 flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Payments Today</span>
                  <span className="text-2xl font-bold text-slate-800">$1,250</span>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-yellow-500 flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Pending Requests</span>
                  <span className="text-2xl font-bold text-slate-800">7</span>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-red-500 flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Overdue Loans</span>
                  <span className="text-2xl font-bold text-slate-800">3</span>
                </div>
              </div>

              {/* 3. Main Dashboard Content Area */}
              <div className="flex flex-col lg:flex-row gap-5">
                {/* Recent Loans Table (70% width) */}
                <div className="flex-2 bg-white shadow-sm p-5 rounded border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-slate-700">Recent Loan Applications</h2>
                    <button className="text-blue-600 text-xs hover:underline">View All</button>
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
                        <tr className="border-b last:border-0">
                          <td className="p-3 text-sm text-slate-600">{currentUser?.fullname}</td>
                          <td className="p-3 text-sm text-slate-600 font-medium">$5,000</td>
                          <td className="p-3 text-xs">
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Approved</span>
                          </td>
                        </tr>
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
                      <span className="font-bold text-slate-700">142</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full w-[70%]"></div>
                    </div>
                    <p className="text-[11px] text-slate-400">70% of targets reached for this month's collection.</p>
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
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
                    <select name="" id="" className="bg-slate-100 p-1 border-0 focus:outline-0">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    Entries
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    Search
                    <input type="text" id='search' name='search' placeholder="Search" className="border border-slate-300 p-1 rounded focus:outline-0 max-w-35" />
                  </div>
                </div>
                <div className="overflow-x-auto w-full shadow shadow-slate-100">
                  <table className="w-full border-collapse ">
                    <thead>
                      <tr className="border">
                        <th className="text-xs text-slate-500 border p-2 font-bold text-left">#</th>
                        <th className="text-xs text-slate-500 border p-2 font-bold w-60">Borrower</th>
                        <th className="text-xs text-slate-500 border p-2 font-bold w-50">Loan Detail</th>
                        <th className="text-xs text-slate-500 border p-2 font-bold w-50">
                          <div className="flex items-center justify-between">Payment Detail</div>
                        </th>
                        <th className="text-xs text-slate-500 border p-2 font-bold w-30"> Status </th>
                        <th className="text-xs text-slate-500 border p-2 font-bold w-25">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...loans].map((loan) =>
                        <tr key={loan.sn}>
                          <td className="border text-sm text-slate-400 p-2">{loan.sn}</td>
                          <td className="border text-sm text-slate-400 p-2">{loan.borrower}</td>
                          <td className="border text-sm text-slate-400 p-2">{loan.loanDetails}</td>
                          <td className="border text-sm text-slate-400 p-2">{loan.paymentDetails}</td>
                          <td className="border text-sm text-slate-400 p-2">{loan.status}</td>
                          <td className="border text-sm p-2 cursor-pointer" onClick={() => HandleDelete(loan.sn)}>
                            <span className="bg-gray-400 text-white p-1 rounded px-4 hover:bg-gray-500">Delete</span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col items-start gap-2 justify-between text-slate-400 text-sm sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">Show 1 to 1 of 1 Entries
                  </div>
                  <div className="flex items-center gap-2 border px-3 border-slate-300 rounded">
                    <button className="text-sm">Previous</button>
                    <button className="text-sm text-white bg-blue-700 px-2 py-1">1</button>
                    <button className="text-sm">Next</button>
                  </div>
                </div>
              </div>
              : selectedMenu === 'Borrowers' ?
                <div className="flex flex-col gap-5 w-full bg-white shadow shadow-black/20 p-5 rounded overflow-x-hidden">
                  <div className="flex items-center justify-between text-slate-400 overflow-x-scroll">
                    <div className="flex items-center gap-2 text-sm">Show
                      <select name="" id="" className="bg-slate-100 p-1 border-0 focus:outline-0">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      Entries
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      Search
                      <input type="text" id='search' name='search' placeholder="Search" className="border border-slate-300 p-1 rounded focus:outline-0 max-w-35" />
                    </div>
                  </div>
                  <div className="overflow-x-scroll w-full shadow shadow-slate-100">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border">
                          <th className="text-xs text-slate-500 border p-2 font-bold">Firstname</th>
                          <th className="text-xs text-slate-500 border p-2 font-bold">Middlename</th>
                          <th className="text-xs text-slate-500 border p-2 font-bold">Lastname</th>
                          <th className="text-xs text-slate-500 border p-2 font-bold">Contact No</th>
                          <th className="text-xs text-slate-500 border p-2 font-bold w-40">Address</th>
                          <th className="text-xs text-slate-500 border p-2 font-bold w-30">Email</th>
                          <th className="text-xs text-slate-500 border p-2 font-bold w-25">Tax ID</th>
                          <th className="text-xs text-slate-500 border p-2 font-bold w-25">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border text-sm text-slate-400 p-2">David</td>
                          <td className="border text-sm text-slate-400 p-2">John</td>
                          <td className="border text-sm text-slate-400 p-2">Muhammed</td>
                          <td className="border text-sm text-slate-400 p-2">08057893211</td>
                          <td className="border text-sm text-slate-400 p-2">K14 Wasa Street</td>
                          <td className="border text-sm text-slate-400 p-2">admin@gmail.com</td>
                          <td className="border text-sm text-slate-400 p-2">112</td>
                          <td className="border text-sm p-2 cursor-pointer">
                            <span className="bg-gray-400 text-white p-1 rounded px-4 hover:bg-gray-500">Delete</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col items-start gap-2 justify-between text-slate-400 text-sm sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">Show 1 to 1 of 1 Entries</div>
                    <div className="flex items-center gap-2 border px-3 border-slate-300 rounded">
                      <button className="text-sm">Previous</button>
                      <button className="text-sm text-white bg-blue-700 px-2 py-1">1</button>
                      <button className="text-sm">Next</button>
                    </div>
                  </div>
                </div>
                : selectedMenu === 'Loan Plans' ?
                  <div className="flex flex-col items-start gap-5 md:flex-row">
                    <div className="bg-white p-3 rounded shadow shadow-slate-300 max-w-80 w-full">
                      <form action="" className="flex flex-col gap-3 text-slate-400">
                        <div className="flex flex-col gap-2 w-full">
                          <label htmlFor="month" className="text-sm">Plan(Months)</label>
                          <input type="text" id='month' name='month' className="text-sm p-1 px-3 border border-slate-400 focus:outline-0 rounded w-full" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="interest" className="text-sm">Interest</label>
                          <div className="relative w-full">
                            <input type="text" id='interest' name='interest' className="text-sm p-1 px-3 pr-8 border border-slate-400 focus:outline-0 rounded w-full" />
                            <span className="absolute bg-gray-600 text-sm text-white p-1 top-0 bottom-0 right-0 px-2">%</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="penalty" className="text-sm">Monthly Overdue Penalty</label>
                          <div className="relative w-full">
                            <input type="text" id='penalty' name='penalty' className="text-sm p-1 px-3 pr-8 border border-slate-400 focus:outline-0 rounded w-full" />
                            <span className="absolute bg-gray-600 text-sm text-white p-1 top-0 bottom-0 right-0 px-2">%</span>
                          </div>
                        </div>
                        <button className="bg-blue-600 p-1 rounded text-white hover:bg-blue-700">Save</button>
                      </form>
                    </div>
                    <div className="flex flex-col gap-5 w-full bg-white shadow shadow-black/20 p-5 rounded overflow-x-hidden">
                      <div className="flex items-center justify-between text-slate-400 overflow-x-scroll">
                        <div className="flex items-center gap-2 text-sm">Show
                          <select name="" id="" className="bg-slate-100 p-1 border-0 focus:outline-0">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                          Entries
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          Search
                          <input type="text" id='search' name='search' placeholder="Search" className="border border-slate-300 p-1 rounded focus:outline-0 max-w-35" />
                        </div>
                      </div>
                      <div className="overflow-x-scroll w-full shadow shadow-slate-100">
                        <table className="w-full border-collapse ">
                          <thead>
                            <tr className="border">
                              <th className="text-xs text-slate-500 border p-2 font-bold">Plan(months)</th>
                              <th className="text-xs text-slate-500 border p-2 font-bold">Interest(%)</th>
                              <th className="text-xs text-slate-500 border p-2 font-bold">Monthly overdue penalty(%)</th>
                              <th className="text-xs text-slate-500 border p-2 font-bold">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border text-sm text-slate-400 p-2">08057893211</td>
                              <td className="border text-sm text-slate-400 p-2">K14 Wasa Street</td>
                              <td className="border text-sm text-slate-400 p-2">112</td>
                              <td className="border text-sm p-2 cursor-pointer">
                                <span className="bg-gray-400 text-white p-1 rounded px-4 hover:bg-gray-500">Delete</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  : selectedMenu === 'Loan Types' ?
                    <div className="flex flex-col items-start gap-5 md:flex-row">
                      <div className="bg-white p-3 rounded shadow shadow-slate-300 max-w-80 w-full">
                        <form action="" className="flex flex-col gap-3 text-slate-400">
                          <div className="flex flex-col gap-2 w-full">
                            <label htmlFor="loan-type" className="text-sm">Loan Type</label>
                            <input type="text" id='loan-type' name='loan-type' className="text-sm p-1 px-3 border border-slate-400 focus:outline-0 rounded w-full" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="loan-description" className="text-sm">Loan Description</label>
                            <div className="relative w-full">
                              <input type="text" id='loan-description' name='loan-description' className="text-sm p-1 px-3 pr-8 border border-slate-400 focus:outline-0 rounded w-full" />
                              <span className="absolute bg-gray-600 text-sm text-white p-1 top-0 bottom-0 right-0 px-2">%</span>
                            </div>
                          </div>
                          <button className="bg-blue-600 p-1 rounded text-white hover:bg-blue-700">Save</button>
                        </form>
                      </div>
                      <div className="flex flex-col gap-5 w-full bg-white shadow shadow-black/20 p-5 rounded overflow-x-hidden">
                        <div className="flex items-center justify-between text-slate-400 overflow-x-scroll">
                          <div className="flex items-center gap-2 text-sm">Show
                            <select name="" id="" className="bg-slate-100 p-1 border-0 focus:outline-0">
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                            Entries
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            Search
                            <input type="text" id='search' name='search' placeholder="Search" className="border border-slate-300 p-1 rounded focus:outline-0 max-w-35" />
                          </div>
                        </div>
                        <div className="overflow-x-scroll w-full shadow shadow-slate-100">
                          <table className="w-full border-collapse ">
                            <thead>
                              <tr className="border">
                                <th className="text-xs text-slate-500 border p-2 font-bold">Loan Name</th>
                                <th className="text-xs text-slate-500 border p-2 font-bold">Loan Description</th>
                                <th className="text-xs text-slate-500 border p-2 font-bold">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border text-sm text-slate-400 p-2">David</td>
                                <td className="border text-sm text-slate-400 p-2">John</td>
                                <td className="border text-sm p-2 cursor-pointer">
                                  <span className="bg-gray-400 text-white p-1 rounded px-4 hover:bg-gray-500">Delete</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    : selectedMenu === 'Payments' ?
                      <div className="flex flex-col gap-5 w-full bg-white shadow shadow-black/20 p-5 rounded overflow-x-hidden">
                        <div className="flex items-center gap-10 justify-between text-slate-400 overflow-x-scroll">
                          <div className="flex items-center gap-2 text-sm">Show
                            <select name="" id="" className="bg-slate-100 p-1 border-0 focus:outline-0">
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                            Entries
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            Search
                            <input type="text" id='search' name='search' placeholder="Search" className="border border-slate-300 p-1 rounded focus:outline-0 max-w-35" />
                          </div>
                        </div>
                        <div className="overflow-x-scroll w-full shadow shadow-slate-100">
                          <table className="w-full border-collapse ">
                            <thead>
                              <tr className="border">
                                <th className="text-xs text-slate-500 border p-2 font-bold text-left">#</th>
                                <th className="text-xs text-slate-500 border p-2 font-bold">Loan Reference No.</th>
                                <th className="text-xs text-slate-500 border p-2 font-bold">Payee</th>
                                <th className="text-xs text-slate-500 border p-2 font-bold">Amount</th>
                                <th className="text-xs text-slate-500 border p-2 font-bold">Penalty</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border text-sm text-slate-400 p-2">David</td>
                                <td className="border text-sm text-slate-400 p-2">David</td>
                                <td className="border text-sm text-slate-400 p-2">David</td>
                                <td className="border text-sm text-slate-400 p-2">David</td>
                                <td className="border text-sm text-slate-400 p-2">David</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      : selectedMenu === 'Users' &&
                      <div className="flex flex-col gap-5 w-full bg-white shadow shadow-black/20 p-5 rounded overflow-x-hidden">
                        <div className="flex items-center justify-between text-slate-400 overflow-x-scroll">
                          <div className="flex items-center gap-2 text-sm">Show
                            <select name="" id="" className="bg-slate-100 p-1 border-0 focus:outline-0">
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                            Entries
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            Search
                            <input type="text" id='search' name='search' placeholder="Search" className="border border-slate-300 p-1 rounded focus:outline-0 max-w-35" />
                          </div>
                        </div>
                        <div className='overflow-x-scroll w-full shadow shadow-slate-100'>
                          <table className="w-full border-collapse ">
                            <thead>
                              <tr className="border">
                                <th className="text-sm text-slate-500 border p-2 font-bold">Username</th>
                                <th className="text-sm text-slate-500 border p-2 font-bold">password</th>
                                <th className="text-sm text-slate-500 border p-2 font-bold">Name</th>
                                <th className="text-sm text-slate-500 border p-2 font-bold">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border text-sm text-slate-400 p-2">David</td>
                                <td className="border text-sm text-slate-400 p-2">David</td>
                                <td className="border text-sm text-slate-400 p-2">David</td>
                                <td className="border text-sm p-2 cursor-pointer">
                                  <span className="bg-gray-400 text-white p-1 rounded px-4 hover:bg-gray-500">Delete</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
          }
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard