import React from 'react';
import { 
  UsersIcon, 
  CubeIcon, 
  ChartBarIcon,
  HomeIcon 
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const navigation = [
    { name: 'Dashboard', href: 'dashboard', icon: HomeIcon },
    { name: 'Customers', href: 'customers', icon: UsersIcon },
    { name: 'Products', href: 'products', icon: CubeIcon },
    { name: 'Sales', href: 'sales', icon: ChartBarIcon, disabled: true },
  ];

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center w-100">
            <a href="#" className="navbar-brand">
              AC CRM
            </a>
            
            <div className="nav">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!item.disabled) onPageChange(item.href);
                  }}
                  className={`
                    nav-link
                    ${currentPage === item.href ? 'active' : ''}
                    ${item.disabled ? 'disabled' : ''}
                  `}
                  style={{ cursor: item.disabled ? 'not-allowed' : 'pointer' }}
                >
                  <item.icon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                  {item.name}
                  {item.disabled && (
                    <span className="phase-2-badge">Phase 2</span>
                  )}
                </a>
              ))}
            </div>
            
            <span className="navbar-text">
              UK Date Format • £ GBP
            </span>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container py-4">
        {children}
      </div>
    </div>
  );
};

export default Layout; 