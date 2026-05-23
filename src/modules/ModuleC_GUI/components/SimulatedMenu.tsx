import { useState } from 'react';

interface MenuItem {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface SimulatedMenuProps {
  items: { [key: string]: MenuItem[] };
  activeStep?: number; // Для подсветки нужного пункта по сценарию
}

export const SimulatedMenu: React.FC<SimulatedMenuProps> = ({ items, activeStep }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="bg-white border-b border-gray-100 px-3 py-1 flex gap-4 text-sm relative z-50">
      {Object.keys(items).map((menuName) => (
        <div key={menuName} className="relative">
          <button
            className={`px-3 py-1 rounded transition-colors ${
              openMenu === menuName ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'
            }`}
            onClick={() => setOpenMenu(openMenu === menuName ? null : menuName)}
          >
            {menuName}
          </button>

          {openMenu === menuName && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-xl border border-gray-100 rounded-lg py-2 animate-in fade-in zoom-in duration-150">
              {items[menuName].map((item, idx) => (
                <button
                  key={idx}
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.();
                    setOpenMenu(null);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    item.disabled 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};