import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Palette,
  Globe,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Mail,
  Shield,
  Moon
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProfileSettings from '../components/ProfileSettings';
import EmailSettings from '../components/EmailSettings';
import SecuritySettings from '../components/SecuritySettings';
import ThemeSettings from '../components/ThemeSettings';
import { useEffect } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [expandedSections, setExpandedSections] = useState({
    account: true,
    privacy: false,
    notifications: false,
    appearance: false
  });
  useEffect(()=>{
    document.title = 'Settings - WatchList'
  },[])
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const settingsSections = [
    {
      id: 'account',
      icon: <User size={18} />,
      title: 'Account',
      tabs: [
        { id: 'profile', label: 'Profile' },
        { id: 'email', label: 'Email' },
        { id: 'security', label: 'Security' }
      ]
    },
    {
      id: 'privacy',
      icon: <Lock size={18} />,
      title: 'Privacy',
      tabs: [
        { id: 'data', label: 'Data & Permissions' },
        { id: 'visibility', label: 'Profile Visibility' }
      ]
    },
    {
      id: 'notifications',
      icon: <Bell size={18} />,
      title: 'Notifications',
      tabs: [
        { id: 'email-notifications', label: 'Email' },
        { id: 'push-notifications', label: 'Push' }
      ]
    },
    {
      id: 'appearance',
      icon: <Palette size={18} />,
      title: 'Appearance',
      tabs: [
        { id: 'theme', label: 'Theme' },
        { id: 'language', label: 'Language' }
      ]
    }
  ];

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'email':
        return <EmailSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'theme':
        return <ThemeSettings />;
      default:
        return <DefaultSettings />;
    }
  };

  return (
    <section className="w-full h-screen flex bg-[#141414] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6 text-white">
          <div className="max-w-6xl mx-auto flex gap-8">
            {/* Settings Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-[#1A1A1A] rounded-lg p-4">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <SettingsIcon className="text-[#E50000]" />
                  Settings
                </h2>

                <nav className="space-y-2">
                  {settingsSections.map((section) => (
                    <div key={section.id} className="mb-2">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-3 hover:bg-[#262626] rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {section.icon}
                          <span>{section.title}</span>
                        </div>
                        {expandedSections[section.id] ?
                          <ChevronDown size={16} /> :
                          <ChevronRight size={16} />
                        }
                      </button>

                      {expandedSections[section.id] && (
                        <div className="ml-8 mt-1 space-y-1">
                          {section.tabs.map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`w-full text-left p-2 px-3 rounded-md text-sm ${activeTab === tab.id ? 'bg-[#E50000]/20 text-[#E50000]' : 'hover:bg-[#262626]'}`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-4 mt-4 border-t border-[#262626]">
                    <button className="flex items-center gap-3 p-3 w-full hover:bg-[#262626] rounded-lg">
                      <HelpCircle size={18} />
                      <span>Help & Support</span>
                    </button>
                  </div>
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 bg-[#1A1A1A] rounded-lg p-6">
              {renderActiveTab()}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

// Settings Components








const DefaultSettings = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <SettingsIcon size={48} className="text-gray-500 mb-4" />
    <h3 className="text-xl font-medium text-gray-400">Select a setting to configure</h3>
    <p className="text-gray-500 mt-2">Choose from the sidebar to view and edit settings</p>
  </div>
);

export default Settings;