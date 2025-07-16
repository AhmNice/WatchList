import React from 'react'

const ThemeSettings = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Theme Settings</h2>
    <div className="grid grid-cols-3 gap-4">
      {['Light', 'Dark', 'System'].map((theme) => (
        <button
          key={theme}
          className="p-4 bg-[#262626] rounded-lg border border-[#333] hover:border-[#E50000] transition"
        >
          <div className="flex flex-col items-center">
            <Moon size={24} className="mb-2" />
            <span>{theme} Theme</span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default ThemeSettings