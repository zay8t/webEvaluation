import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, ChevronDown, LogOut, User, ShoppingBag, Star, LayoutDashboard } from 'lucide-react';
import { LogoIcon } from './Logo';
import { useAuth } from './AuthContext';
import { getTheme, toggleTheme as toggleThemeFn, type Theme } from '../theme';

interface HeaderProps {
  onNavigate: (page: string) => void;
  scrolled: boolean;
  currentPage: string;
}

// ============================================================================
// Nav link definitions per auth state
// ============================================================================

interface NavLink {
  label: string;
  page: string;
  icon?: React.ReactNode;
}

const PUBLIC_LINKS: NavLink[] = [
  { label: 'Home', page: 'home' },
  { label: 'Products', page: 'eyeglasses' },
  { label: 'Portfolio', page: 'portfolio' },
  { label: 'Pricing', page: 'membership' },
  { label: 'About Us', page: 'about' },
  { label: 'Contact Us', page: 'contact' },
];

const CUSTOMER_LINKS: NavLink[] = [
  { label: 'Orders', page: 'orders', icon: <ShoppingBag size={16} /> },
  { label: 'Reviews', page: 'reviews', icon: <Star size={16} /> },
];

const ADMIN_LINK: NavLink = {
  label: 'Admin Dashboard',
  page: 'admin',
  icon: <LayoutDashboard size={16} />,
};

// ============================================================================
// Header Component
// ============================================================================

export const Header: React.FC<HeaderProps> = ({ onNavigate, scrolled, currentPage }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setThemeState] = useState<Theme>(() => getTheme());

  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
      setCartCount(count);
    } catch (e) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cart-updated', updateCartCount);
    window.addEventListener('storage', updateCartCount);
    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  // Listen for theme changes (including from other components)
  useEffect(() => {
    const handler = (e: Event) => {
      setThemeState((e as CustomEvent).detail as Theme);
    };
    window.addEventListener('themechange', handler);
    return () => window.removeEventListener('themechange', handler);
  }, []);

  const handleToggleTheme = () => {
    const next = toggleThemeFn();
    setThemeState(next);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [currentPage]);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const handleClick = () => setProfileOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [profileOpen]);

  // Build nav links
  const navLinks: NavLink[] = [...PUBLIC_LINKS];
  if (isAuthenticated) {
    navLinks.push(...CUSTOMER_LINKS);
  }
  if (isAdmin) {
    navLinks.push(ADMIN_LINK);
  }

  const isActive = (page: string) => {
    if (page === 'home') return currentPage === 'home' || currentPage === '';
    return currentPage === page;
  };

  // ============================================================================
  // Desktop nav link
  // ============================================================================
  const renderNavLink = (link: NavLink) => (
    <button
      key={link.page}
      onClick={() => onNavigate(link.page)}
      className={`relative text-sm font-medium transition-colors duration-200 py-1 group flex items-center gap-1.5 ${
        isActive(link.page)
          ? 'text-spectra-orange font-semibold'
          : 'text-gray-600 dark:text-spectra-dark-muted hover:text-spectra-orange dark:hover:text-spectra-orange'
      }`}
    >
      {link.icon && <span className="opacity-70">{link.icon}</span>}
      {link.label}
      {/* Animated underline */}
      <span
        className={`absolute -bottom-0.5 left-0 h-0.5 bg-spectra-orange rounded-full transition-all duration-300 ${
          isActive(link.page) ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </button>
  );

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-spectra-dark-surface/90 backdrop-blur-xl border-b border-gray-100 dark:border-spectra-dark-border py-2 md:py-3 shadow-sm'
            : 'bg-white dark:bg-spectra-dark-bg py-4 md:py-5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-12">

            {/* ── Logo ── */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onNavigate('home')}
            >
              <LogoIcon className="h-10 w-auto" />
              <span className="text-sm font-bold">
                <span className="text-black dark:text-white">MY</span>
                <span className="text-spectra-orange ml-1">EYES</span>
              </span>
            </div>

            {/* ── Desktop Navigation ── */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map(renderNavLink)}
            </nav>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-3">

              {/* Theme Toggle */}
              <button
                id="theme-toggle"
                onClick={handleToggleTheme}
                className="relative w-9 h-9 rounded-xl bg-gray-100 dark:bg-spectra-dark-card border border-gray-200 dark:border-spectra-dark-border flex items-center justify-center text-gray-600 dark:text-spectra-dark-text hover:bg-gray-200 dark:hover:bg-spectra-dark-border transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun size={18} className="text-spectra-amber" />
                ) : (
                  <Moon size={18} />
                )}
              </button>

              {/* Cart Badge */}
              <a
                href="checkout.html"
                className="relative w-9 h-9 rounded-xl bg-gray-100 dark:bg-spectra-dark-card border border-gray-200 dark:border-spectra-dark-border flex items-center justify-center text-gray-600 dark:text-spectra-dark-text hover:bg-gray-200 dark:hover:bg-spectra-dark-border transition-all duration-300"
                aria-label="View shopping cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-spectra-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-spectra-dark-surface animate-in zoom-in-50 duration-200">
                    {cartCount}
                  </span>
                )}
              </a>

              {/* Auth Area */}
              {isAuthenticated ? (
                /* Profile Dropdown */
                <div className="relative hidden md:block">
                  <button
                    id="profile-dropdown-trigger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileOpen(!profileOpen);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-spectra-dark-card border border-gray-200 dark:border-spectra-dark-border hover:bg-gray-100 dark:hover:bg-spectra-dark-border transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-spectra-amber to-spectra-orange flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-spectra-navy dark:text-spectra-dark-text max-w-[100px] truncate">
                      {user?.full_name?.split(' ')[0] || 'Profile'}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-spectra-dark-card border border-gray-100 dark:border-spectra-dark-border rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-50 dark:border-spectra-dark-border">
                        <p className="text-sm font-semibold text-spectra-navy dark:text-white truncate">
                          {user?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-spectra-dark-muted truncate">
                          {user?.email || ''}
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => onNavigate('profile')}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-spectra-dark-text hover:bg-gray-50 dark:hover:bg-spectra-dark-border transition-colors"
                        >
                          <User size={16} />
                          My Profile
                        </button>
                        <button
                          onClick={() => onNavigate('orders')}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-spectra-dark-text hover:bg-gray-50 dark:hover:bg-spectra-dark-border transition-colors"
                        >
                          <ShoppingBag size={16} />
                          My Orders
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => onNavigate('admin')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-spectra-orange hover:bg-orange-50 dark:hover:bg-spectra-dark-border transition-colors"
                          >
                            <LayoutDashboard size={16} />
                            Admin Dashboard
                          </button>
                        )}
                      </div>
                      <div className="border-t border-gray-50 dark:border-spectra-dark-border py-1">
                        <button
                          id="logout-button"
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Login / Register */
                <div className="hidden md:flex items-center gap-2 ml-2 pl-3 border-l border-gray-200 dark:border-spectra-dark-border">
                  <a
                    href="login.html"
                    className="text-sm font-medium text-gray-600 dark:text-spectra-dark-muted hover:text-spectra-orange transition-colors px-3 py-2"
                  >
                    Log In
                  </a>
                  <a
                    href="signup.html"
                    className="text-sm font-medium text-white bg-gradient-to-r from-spectra-orange to-spectra-amber hover:from-spectra-amber hover:to-spectra-orange px-5 py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Register
                  </a>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 rounded-xl bg-gray-100 dark:bg-spectra-dark-card border border-gray-200 dark:border-spectra-dark-border flex items-center justify-center text-gray-600 dark:text-spectra-dark-text hover:bg-gray-200 dark:hover:bg-spectra-dark-border transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Slide-in Drawer ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-spectra-dark-surface z-50 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-spectra-dark-border">
            <span className="text-sm font-bold">
              <span className="text-black dark:text-white">MY</span>
              <span className="text-spectra-orange ml-1">EYES</span>
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-spectra-dark-card flex items-center justify-center text-gray-500 dark:text-spectra-dark-text"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-4">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  onNavigate(link.page);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 mb-1 ${
                  isActive(link.page)
                    ? 'bg-spectra-orange/10 text-spectra-orange'
                    : 'text-gray-600 dark:text-spectra-dark-text hover:bg-gray-50 dark:hover:bg-spectra-dark-card'
                }`}
              >
                {link.icon && <span className="opacity-70">{link.icon}</span>}
                {link.label}
                {isActive(link.page) && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-spectra-orange" />
                )}
              </button>
            ))}
          </nav>

          {/* Drawer Footer */}
          <div className="px-6 py-5 border-t border-gray-100 dark:border-spectra-dark-border space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-spectra-amber to-spectra-orange flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-spectra-navy dark:text-white truncate">
                      {user?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-spectra-dark-muted truncate">
                      {user?.email || ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="login.html"
                  className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-spectra-dark-text bg-gray-50 dark:bg-spectra-dark-card hover:bg-gray-100 dark:hover:bg-spectra-dark-border transition-colors"
                >
                  Log In
                </a>
                <a
                  href="signup.html"
                  className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-spectra-orange to-spectra-amber hover:from-spectra-amber hover:to-spectra-orange transition-all duration-300 shadow-sm"
                >
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};