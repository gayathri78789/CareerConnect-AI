import { useAuth } from '../../context/AuthContext.jsx';
import { SidebarShell } from '../../components/Layout/Sidebar.jsx';
import { MobileTopBar } from '../../components/Layout/AppShell.jsx';
import { MobileNav } from '../../components/Layout/MobileNav.jsx';
import { ChatWindow } from '../../components/chat/ChatWindow.jsx';

export default function CoachPage() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <MobileTopBar />
      <SidebarShell />
      <main className="main-content--career-ai">
        <ChatWindow user={user} />
      </main>
      <MobileNav />
    </div>
  );
}
