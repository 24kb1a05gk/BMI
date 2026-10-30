import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarDays,
  Bookmark,
  UserCheck,
  LogOut,
  Leaf,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Meal Suggestions', path: '/suggestions', icon: UtensilsCrossed },
    { name: 'Weekly Schedule', path: '/schedule', icon: CalendarDays },
    { name: 'Saved Meals', path: '/saved-meals', icon: Bookmark },
    { name: 'My Profile', path: '/profile', icon: UserCheck }
  ];

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-[#DCEBDD] text-[#25312A] w-64 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#DCEBDD] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#557C55] to-[#234B35] flex items-center justify-center text-white shadow-sm">
            <Leaf className="w-5 h-5 -rotate-12" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#234B35] font-heading">
              Nutri<span className="text-[#557C55]">Life</span>
            </span>
            <p className="text-[9px] uppercase tracking-wider font-semibold text-[#557C55] -mt-1">
              Member Portal
            </p>
          </div>
        </div>
      </div>

      {/* User Quick Info */}
      <div className="px-5 py-4 border-b border-gray-100 bg-[#F8F8F2]/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#557C55]/15 text-[#234B35] font-bold text-sm flex items-center justify-center border border-[#DCEBDD]">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-[#25312A] truncate">
              {user?.full_name || 'Health Seeker'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#557C55] text-white shadow-sm font-semibold'
                    : 'text-[#25312A]/80 hover:bg-[#DCEBDD]/40 hover:text-[#234B35]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-[#557C55]'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-75" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-semibold text-sm hover:bg-rose-50 hover:border-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:block h-[calc(100vh-5rem)] sticky top-20 shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl animate-slide-right"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
}
