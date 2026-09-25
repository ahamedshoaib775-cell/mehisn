import { useState, useEffect } from 'react';
import type { ActiveTab, InstagramAccount, InstagramPost, Automation, AutomationEvent } from './types';
import { 
  fetchLiveAccount, 
  fetchLivePosts, 
  fetchLiveAutomations, 
  fetchLiveEvents, 
  saveLiveAutomation, 
  toggleLiveAutomationStatus, 
  deleteLiveAutomation 
} from './lib/supabase';
import { getMetaAuthUrl } from './lib/metaApi';

import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { AutomationsList } from './components/automations/AutomationsList';
import { CreateAutomationModal } from './components/automations/CreateAutomationModal';
import { PostsGrid } from './components/posts/PostsGrid';
import { ActivityLog } from './components/activity/ActivityLog';
import { DeveloperSetupGuide } from './components/setup/DeveloperSetupGuide';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [account, setAccount] = useState<InstagramAccount | null>(null);
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [events, setEvents] = useState<AutomationEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);
  const [selectedPostIdForAuto, setSelectedPostIdForAuto] = useState<string | null>(null);

  // Initial Data Load & Webhook Event Sync
  const loadLiveData = async () => {
    try {
      const [acctData, postsData, automationsData, eventsData] = await Promise.all([
        fetchLiveAccount(),
        fetchLivePosts(),
        fetchLiveAutomations(),
        fetchLiveEvents(),
      ]);

      if (acctData) setAccount(acctData);
      if (postsData) setPosts(postsData);
      if (automationsData) setAutomations(automationsData);
      if (eventsData) setEvents(eventsData);
    } catch (err) {
      console.error('Error loading live data from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLiveData();
    
    // Periodically refresh activity events (every 10 seconds)
    const interval = setInterval(async () => {
      const freshEvents = await fetchLiveEvents();
      if (freshEvents.length > 0) {
        setEvents(freshEvents);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Automation handlers
  const handleOpenCreateModal = (postId?: string) => {
    setEditingAutomation(null);
    setSelectedPostIdForAuto(postId || null);
    setIsCreateModalOpen(true);
  };

  const handleEditAutomation = (auto: Automation) => {
    setEditingAutomation(auto);
    setSelectedPostIdForAuto(auto.post_id);
    setIsCreateModalOpen(true);
  };

  const handleSaveAutomation = async (autoData: Partial<Automation>) => {
    const targetAccountId = account?.id || autoData.account_id || '00000000-0000-0000-0000-000000000000';
    const payload = {
      ...autoData,
      account_id: targetAccountId,
    };

    const saved = await saveLiveAutomation(payload);
    if (saved) {
      setAutomations((prev) => {
        const exists = prev.some((item) => item.id === saved.id);
        if (exists) {
          return prev.map((item) => (item.id === saved.id ? saved : item));
        }
        return [saved, ...prev];
      });
    } else {
      // Fallback local update if offline
      if (autoData.id) {
        setAutomations((prev) =>
          prev.map((item) => (item.id === autoData.id ? { ...item, ...autoData } as Automation : item))
        );
      } else {
        const targetPost = posts.find((p) => p.id === autoData.post_id);
        const newAuto: Automation = {
          id: `auto-${Date.now()}`,
          account_id: targetAccountId,
          post_id: autoData.post_id || '',
          post: targetPost,
          keyword: autoData.keyword || 'LOCATION',
          keywords: autoData.keywords || ['LOCATION'],
          match_type: autoData.match_type || 'exact',
          public_reply: autoData.public_reply || 'Sent it to your DMs 📩✨',
          dm_message: autoData.dm_message || 'Hey! Here is the location 📍',
          location_name: autoData.location_name || '',
          location_url: autoData.location_url || '',
          active: autoData.active !== undefined ? autoData.active : true,
          trigger_count: 0,
          dm_sent_count: 0,
          created_at: new Date().toISOString(),
        };
        setAutomations((prev) => [newAuto, ...prev]);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    const target = automations.find((a) => a.id === id);
    if (!target) return;
    const newStatus = !target.active;
    
    // Update local state immediately
    setAutomations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: newStatus } : item))
    );

    await toggleLiveAutomationStatus(id, newStatus);
  };

  const handleDeleteAutomation = async (id: string) => {
    setAutomations((prev) => prev.filter((item) => item.id !== id));
    await deleteLiveAutomation(id);
  };

  const handleConnectInstagram = () => {
    window.open(getMetaAuthUrl(), '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-rose-500 selection:text-white">
      
      {/* Top Sticky Header */}
      <Header
        account={account}
        onConnectInstagram={handleConnectInstagram}
        onOpenSettings={() => setActiveTab('setup')}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeAutomationsCount={automations.filter((a) => a.active).length}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                <span className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Connecting to Live Supabase & Meta API...
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  account={account}
                  automations={automations}
                  events={events}
                  setActiveTab={setActiveTab}
                  onNewAutomation={() => handleOpenCreateModal()}
                  onConnectInstagram={handleConnectInstagram}
                />
              )}

              {activeTab === 'automations' && (
                <AutomationsList
                  automations={automations}
                  onNewAutomation={() => handleOpenCreateModal()}
                  onEditAutomation={handleEditAutomation}
                  onToggleStatus={handleToggleStatus}
                  onDeleteAutomation={handleDeleteAutomation}
                />
              )}

              {activeTab === 'posts' && (
                <PostsGrid
                  posts={posts}
                  automations={automations}
                  onCreateAutomationForPost={(postId) => {
                    setActiveTab('automations');
                    handleOpenCreateModal(postId);
                  }}
                />
              )}

              {activeTab === 'activity' && <ActivityLog events={events} />}

              {activeTab === 'setup' && <DeveloperSetupGuide />}

              {activeTab === 'privacy' && (
                <PrivacyPolicy onBackToApp={() => setActiveTab('dashboard')} />
              )}
            </>
          )}
        </main>

      </div>

      {/* Create / Edit Automation Modal */}
      <CreateAutomationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveAutomation}
        posts={posts}
        editingAutomation={editingAutomation}
        selectedPostId={selectedPostIdForAuto}
      />

    </div>
  );
}

export default App;
