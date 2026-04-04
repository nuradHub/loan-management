import { Calendar1, CoinsIcon, CreditCardIcon, File, Grid, HomeIcon, User2Icon, LogOut, X } from "lucide-react"
import { useContext } from "react"
import { AppContext } from "../context/Context"

const LeftSideBar = () => {
  // Logic: Using the same mobile state management as the user side
  const { selectedMenu, setSelectedMenu, isMenuOpen, setIsMenuOpen, handleLogout } = useContext(AppContext)

  const adminMenuItems = [
    { id: 'Home', label: 'Home', icon: HomeIcon },
    { id: 'Loans', label: 'Loans', icon: CreditCardIcon },
    { id: 'Payments', label: 'Payments', icon: CoinsIcon },
    { id: 'Borrowers', label: 'Borrowers', icon: File },
    { id: 'Loan Plans', label: 'Loan Plans', icon: Calendar1 },
    { id: 'Loan Types', label: 'Loan Types', icon: Grid },
    { id: 'Users', label: 'Users', icon: User2Icon },
  ]

  return (
    <>
      {/* Dark Overlay for Mobile when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className={`
        fixed md:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-100 p-3 shadow-sm transition-transform duration-300 flex flex-col
        w-64 
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-10 px-1">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">
              A
            </div>
            <h3 className="font-black text-xl tracking-tight text-slate-800 uppercase">Admin<span className="text-blue-600">Panel</span></h3>
          </div>
          <button className="md:hidden text-slate-400" onClick={() => setIsMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Menu Sections */}
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-2">Management</p>
          {adminMenuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedMenu(item.id);
                setIsMenuOpen(false); // Close on selection for mobile
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 group ${selectedMenu === item.id
                  ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-50'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
              <item.icon size={20} className={`${selectedMenu === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="font-bold text-sm">{item.label}</span>
              {selectedMenu === item.id && <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl cursor-pointer transition-all">
            <LogOut size={20} />
            <span className="font-bold text-sm" onClick={handleLogout}>Logout</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default LeftSideBar