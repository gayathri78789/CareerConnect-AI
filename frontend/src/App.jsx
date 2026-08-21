import { useEffect } from 'react';
import { usePathname } from './hooks/usePathname.js';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { SidebarProvider } from './context/SidebarContext.jsx';
import { RouteGuard } from './components/Common/RouteLink.jsx';

// ── Lazy-loaded page imports ─────────────────────────────────────────────────
import { lazy, Suspense } from 'react';

const LandingPage          = lazy(() => import('./pages/Landing/LandingPage.jsx'));
const AuthPage             = lazy(() => import('./pages/Auth/AuthPage.jsx'));
const DashboardPage        = lazy(() => import('./pages/Dashboard/DashboardPage.jsx'));
const ResumePage           = lazy(() => import('./pages/Resume/ResumePage.jsx'));
const JDAnalyzerPage       = lazy(() => import('./pages/JDAnalyzer/JDAnalyzerPage.jsx'));
const CoachPage            = lazy(() => import('./pages/Coach/CoachPage.jsx'));
const RoadmapPage          = lazy(() => import('./pages/Roadmap/RoadmapPage.jsx'));
const PracticePage         = lazy(() => import('./pages/Practice/PracticePage.jsx'));
const InterviewReportPage  = lazy(() => import('./pages/Interview/InterviewReportPage.jsx'));
const NotificationsPage    = lazy(() => import('./pages/Notifications/NotificationsPage.jsx'));
const ProfilePage          = lazy(() => import('./pages/Profile/ProfilePage.jsx'));
const SettingsPage         = lazy(() => import('./pages/Settings/SettingsPage.jsx'));
const AdminPage            = lazy(() => import('./pages/Admin/AdminPage.jsx'));
const ActivityLogPage      = lazy(() => import('./pages/Activity/ActivityLogPage.jsx'));
const NotFoundPage         = lazy(() => import('./pages/NotFound/NotFoundPage.jsx'));

// ── Route table ──────────────────────────────────────────────────────────────
const routes = {
  '/':                  LandingPage,
  '/auth':              AuthPage,
  '/dashboard':         DashboardPage,
  '/dashboard/activity': ActivityLogPage,
  '/activity':          ActivityLogPage,
  '/resume':            ResumePage,
  '/jd-analyzer':       JDAnalyzerPage,
  '/coach':             CoachPage,
  '/roadmap':           RoadmapPage,
  '/practice':          PracticePage,
  '/mock-interviews':   InterviewReportPage,
  '/interview-report':  InterviewReportPage,
  '/notifications':     NotificationsPage,
  '/profile':           ProfilePage,
  '/settings':          SettingsPage,
  '/admin':             AdminPage,
};

// ── Minimal page-transition fallback ─────────────────────────────────────────
function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          border: '4px solid var(--stroke)',
          borderTop: '4px solid var(--primary)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

// ── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const pathname = usePathname();
  const Page = routes[pathname] || NotFoundPage;

  useEffect(() => {
    document.title = `CareerConnect AI${
      pathname === '/' ? '' : ` · ${pathname.replace('/', '').replace(/-/g, ' ')}`
    }`;
  }, [pathname]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <RouteGuard path={pathname}>
            <Suspense fallback={<PageLoader />}>
              <Page />
            </Suspense>
          </RouteGuard>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
