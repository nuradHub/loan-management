import { LayoutDashboard, WalletCards, ReceiptText, CalendarCheck, UserCircle, HelpCircle, LogOut, X } from "lucide-react"
import { useContext } from "react"
import { AppContext } from "../context/Context"

const UserSideBar = () => {
  const { selectedMenu, setSelectedMenu, isMenuOpen, setIsMenuOpen, handleLogout } = useContext(AppContext)

  const menuItems = [
    { id: 'Home', label: 'Overview', icon: LayoutDashboard },
    { id: 'My Loans', label: 'My Loans', icon: WalletCards },
    { id: 'My Payments', label: 'Payments', icon: ReceiptText },
    { id: 'Loan Plans', label: 'Loan Plans', icon: CalendarCheck },
    { id: 'Profile', label: 'Account', icon: UserCircle },
    { id: 'Help', label: 'Support', icon: HelpCircle },
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
        fixed md:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-100 p-6 shadow-sm transition-transform duration-300 flex flex-col
        w-64 
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Branding & Close Button for Mobile */}
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">
              L
            </div>
            <h3 className="font-black text-xl tracking-tight text-slate-800 uppercase">LOAN<span className="text-blue-600">APP</span></h3>
          </div>
          <button className="md:hidden text-slate-400" onClick={() => setIsMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Menu Sections */}
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-2">Main Menu</p>
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedMenu(item.id);
                setIsMenuOpen(false); // Close on selection for mobile
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 group ${
                selectedMenu === item.id 
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

export default UserSideBar