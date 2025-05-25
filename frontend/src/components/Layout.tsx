import React from 'react';
import { 
  UsersIcon, 
  CubeIcon, 
  ChartBarIcon,
  HomeIcon,
  BanknotesIcon
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
    { name: 'Sales', href: 'sales', icon: ChartBarIcon },
    { name: 'Expenses', href: 'expenses', icon: BanknotesIcon },
  ];

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center w-100">
            <a href="#" className="navbar-brand" style={{ color: 'red', fontWeight: 'bold', fontSize: '24px' }}>
              AC CRM
            </a>
            
            <div className="nav">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(item.href);
                  }}
                  className={`
                    nav-link
                    ${currentPage === item.href ? 'active' : ''}
                  `}
                  style={{ cursor: 'pointer' }}
                >
                  <item.icon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                  {item.name}
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