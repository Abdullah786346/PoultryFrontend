import React from 'react';
import { NavLink } from 'react-router-dom';

const NavbarItems = ({ isMobile = false, onClickItem, isDashboardRoute = false }) => {
  const items = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Membership', path: '/membership' },
    { name: 'Events', path: '/events' },
    { name: 'Resources', path: '/resources' },
    { name: 'Contact', path: '/contact' }
  ];

  if (isMobile) {
    return (
      <>
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            onClick={onClickItem}
            className={({ isActive }) =>
              `block py-2.5 px-4 rounded-lg font-medium text-base transition ${
                isActive
                  ? 'text-[#de0f3f] bg-red-50 font-semibold'
                  : 'text-gray-600 hover:text-[#de0f3f] hover:bg-red-50/50'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </>
    );
  }

  return (
    <div className="flex items-center justify-center flex-grow space-x-1 xl:space-x-2 px-2">
      {items.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `py-2 px-3 rounded-md font-semibold transition text-sm tracking-wide whitespace-nowrap ${
              isDashboardRoute
                ? isActive
                  ? 'text-white bg-slate-800'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                : isActive
                  ? 'text-[#de0f3f] bg-red-50'
                  : 'text-gray-600 hover:text-[#de0f3f] hover:bg-red-50/50'
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  );
};

export default NavbarItems;
