import { useState } from 'react';
import { Toaster } from "@/components/ui/sonner";
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Integrations from '@/components/Integrations';
import ChatInterface from '@/components/ChatInterface';
import AdminPanel from '@/components/AdminPanel';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'chat' | 'admin'>('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {currentPage === 'home' && (
        <>
          <Hero onStartChat={() => setCurrentPage('chat')} />
          <Features />
          <Integrations />
        </>
      )}
      
      {currentPage === 'chat' && <ChatInterface />}
      {currentPage === 'admin' && <AdminPanel />}
      
      <Toaster />
    </div>
  );
};

export default Index;