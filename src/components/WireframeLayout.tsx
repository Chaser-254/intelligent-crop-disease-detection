import React from 'react';
import { Camera, Activity, ClipboardList, Menu } from 'lucide-react';
type Page = 'camera' | 'results' | 'treatments' | 'monitor';
interface WireframeLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  title?: string;
}
export function WireframeLayout({
  children,
  currentPage,
  onNavigate,
  title
}: WireframeLayoutProps) {
  return <div className="min-h-screen w-full bg-[#f5f5f7] text-[#1f2933] font-sans flex flex-col">
      {/* Status Bar Placeholder */}
      <div className="h-6 w-full bg-gray-200 flex justify-between items-center px-4 text-[10px] font-mono text-gray-500 border-b border-gray-300">
        <span>09:41</span>
        <div className="flex gap-2">
          <span>SIGNAL</span>
          <span>WIFI</span>
          <span>100%</span>
        </div>
      </div>

      {/* Header */}
      <header className="h-16 border-b-2 border-gray-300 flex items-center justify-between px-6 bg-[#f5f5f7] shrink-0">
        <h1 className="text-xl font-bold tracking-tight uppercase">
          {title || 'CropDoctor'}
        </h1>
        <button className="p-2 border border-dashed border-gray-400 rounded hover:bg-gray-200">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 pb-28">
        <div className="max-w-md mx-auto h-full">{children}</div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#f5f5f7] border-t-2 border-gray-300 z-50 safe-bottom">
        <div className="max-w-md mx-auto h-20 px-4 flex justify-between items-center">
          <NavButton active={currentPage === 'camera'} onClick={() => onNavigate('camera')} icon={<Camera className="w-6 h-6" />} label="Scan" />
          <NavButton active={currentPage === 'results'} onClick={() => onNavigate('results')} icon={<Activity className="w-6 h-6" />} label="Results" />
          <NavButton active={currentPage === 'treatments'} onClick={() => onNavigate('treatments')} icon={<ClipboardList className="w-6 h-6" />} label="Rx" />
          <NavButton active={currentPage === 'monitor'} onClick={() => onNavigate('monitor')} icon={<Activity className="w-6 h-6" />} label="Monitor" />
        </div>
      </nav>
    </div>;
}
function NavButton({
  active,
  onClick,
  icon,
  label
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 p-2 transition-all touch-manipulation ${active ? 'text-[#1f2933] font-bold' : 'text-[#9ca3af] hover:text-[#1f2933] active:text-[#1f2933]'}`} type="button">
      <div className={`p-1 rounded ${active ? 'bg-gray-200 border border-gray-400' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-mono uppercase tracking-wider">
        {label}
      </span>
    </button>;
}