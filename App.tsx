import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_DATA, MetricKey, OrgData, aggregate, fmt, loadData, saveData } from "./data";
import ChartsView from "./components/ChartsView";
import OrgsView from "./components/OrgsView";
import TablesView from "./components/TablesView";
import { PandaMascot, PandaMini } from "./components/PandaIcon";
import { PandaBackground } from "./components/PandaBackground";
import { AuthProvider, useAuth } from "./AuthContext";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import { ThemeProvider } from "./ThemeContext";
import LoginModal from "./components/LoginModal";
import LanguageSwitcher from "./components/LanguageSwitcher";
import ThemeSwitcher from "./components/ThemeSwitcher";

type View = "charts" | "orgs" | "tables";

const today = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(
  new Date()
);

/** Хук для определения мобильного устройства */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

const PieIcon = (
  <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
    <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
    <path d="M8 1.6V8l4.6 4.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const OrgIcon = (
  <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
    <rect x="1.5" y="1.5" width="5.6" height="5.6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <rect x="8.9" y="1.5" width="5.6" height="5.6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <rect x="1.5" y="8.9" width="5.6" height="5.6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <rect x="8.9" y="8.9" width="5.6" height="5.6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const TableIcon = (
  <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
    <rect x="1.6" y="2.4" width="12.8" height="11.2" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
    <path d="M1.6 6.2h12.8M6 6.2v7.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

function AppContent() {
  const [rows, setRows] = useState<OrgData[]>(() => loadData());
  const [view, setView] = useState<View>("charts");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const isMobile = useIsMobile();
  const { isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  useEffect(() => saveData(rows), [rows]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const totals = useMemo(() => aggregate(rows), [rows]);

  const updateCell = useCallback((id: string, key: MetricKey, value: number) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }, []);

  const resetData = useCallback(() => {
    setRows(DEFAULT_DATA.map((d) => ({ ...d })));
    setSelectedId(null);
    setToast("dataRestored");
  }, []);

  const goToTableFor = useCallback((orgId: string) => {
    setHighlightId(`${orgId}#${Date.now()}`);
    setView("tables");
  }, []);

  const normPct = totals.norm > 0 ? Math.round((totals.total / totals.norm) * 100) : 0;

  return (
    <>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <div className="relative min-h-screen overflow-x-clip">
      {/* ── фоновые слои (упрощены на мобильных) ── */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_-10%,#14203a_0%,#0a0f1a_58%)]" />
        <div className="bg-grid absolute inset-0" />
        {/* Силуэтные панды на фоне */}
        <PandaBackground />
        {/* Glow-эффекты отключены на мобильных для производительности */}
        {!isMobile && (
          <>
            <div className="glow anim-drift-a h-[420px] w-[560px] -left-40 -top-32 opacity-[0.16] bg-[radial-gradient(circle,#35c9a3_0%,transparent_65%)]" />
            <div className="glow anim-drift-b h-[380px] w-[520px] -right-36 top-16 opacity-[0.13] bg-[radial-gradient(circle,#5aa7f0_0%,transparent_65%)]" />
            <div className="glow anim-drift-a h-[340px] w-[460px] left-1/3 bottom-[-180px] opacity-[0.1] bg-[radial-gradient(circle,#f0a83e_0%,transparent_65%)]" />
          </>
        )}
        <div className="bg-noise absolute inset-0" />
      </div>

      {/* ── цветовая полоса организаций ── */}
      <div className="flex h-1">
        {rows.map((r) => (
          <span
            key={r.id}
            className="flex-1 transition-all duration-500"
            style={{ background: r.color, opacity: selectedId && selectedId !== r.id ? 0.25 : 0.9 }}
          />
        ))}
      </div>

      {/* ── шапка ── */}
      <header className="sticky top-0 z-40 border-b border-[rgba(96,126,190,0.16)] bg-[rgba(10,15,26,0.92)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2.5 sm:px-4 sm:py-3 md:gap-x-6 md:px-6 md:py-3.5">
          {/* Логотип с пандой */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(51,69,111,0.35)] sm:h-10 sm:w-10 overflow-hidden">
              <PandaMascot size={32} className="sm:hidden" />
              <PandaMascot size={36} className="hidden sm:block" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display truncate text-[13px] font-bold leading-tight text-mist-100 sm:text-[15px] md:text-base">
                {t("siteTitle")}
              </h1>
              <p className="truncate text-[10px] font-bold text-mist-500 sm:mt-0.5 sm:text-[11px]">
                {t("organizations")}
              </p>
            </div>
          </div>

          {/* Навигация */}
          <nav className="order-3 w-full sm:order-none sm:w-auto sm:mx-auto">
            <div className="flex w-full items-center justify-center gap-0.5 rounded-full border border-[rgba(96,126,190,0.22)] bg-[rgba(19,28,48,0.8)] p-0.5 sm:w-fit sm:gap-1 sm:p-1">
              <button
                className={`tab-btn flex-1 justify-center sm:flex-none sm:px-4 ${view === "charts" ? "active" : ""}`}
                onClick={() => setView("charts")}
              >
                {PieIcon}
                <span className="hidden xs:inline sm:inline">{t("charts")}</span>
                <span className="xs:hidden sm:hidden">{t("chartsShort")}</span>
              </button>
              <button
                className={`tab-btn flex-1 justify-center sm:flex-none sm:px-4 ${view === "orgs" ? "active" : ""}`}
                onClick={() => setView("orgs")}
              >
                {OrgIcon}
                <span className="hidden xs:inline sm:inline">{t("orgs")}</span>
                <span className="xs:hidden sm:hidden">{t("orgsShort")}</span>
              </button>
              <button
                className={`tab-btn flex-1 justify-center sm:flex-none sm:px-4 ${view === "tables" ? "active" : ""}`}
                onClick={() => setView("tables")}
              >
                {TableIcon}
                <span className="hidden xs:inline sm:inline">{t("tablesShort")}</span>
                <span className="xs:hidden sm:hidden">{t("tablesShort")}</span>
              </button>
            </div>
          </nav>

          {/* Правая часть шапки */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3 md:gap-4">
            <span className="relative flex items-center gap-1.5 text-[10px] font-bold text-mist-500 sm:text-[11px]">
              <span className="live-dot relative h-1.5 w-1.5 rounded-full bg-good text-good sm:h-2 sm:w-2" />
              <span className="hidden sm:inline">{t("autosave")}</span>
              <span className="sm:hidden">{t("autosaveShort")}</span>
            </span>
            <span className="hidden md:block rounded-full border border-[rgba(96,126,190,0.25)] px-3 py-1.5 text-[11px] font-bold text-mist-500">
              {today}
            </span>
            <ThemeSwitcher />
            <LanguageSwitcher />
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="rounded-full border border-[rgba(239,111,94,0.4)] bg-[rgba(239,111,94,0.1)] px-3 py-1.5 text-[11px] font-bold text-speak transition hover:border-[rgba(239,111,94,0.6)] hover:bg-[rgba(239,111,94,0.2)]"
              >
                {t("logout")}
              </button>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="rounded-full border border-[rgba(90,167,240,0.4)] bg-[rgba(90,167,240,0.1)] px-3 py-1.5 text-[11px] font-bold text-plan transition hover:border-[rgba(90,167,240,0.6)] hover:bg-[rgba(90,167,240,0.2)]"
              >
                {t("login")}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── контент ── */}
      <main key={view} className="view-enter mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        {view === "charts" && (
          <ChartsView rows={rows} selectedId={selectedId} onSelect={setSelectedId} isMobile={isMobile} />
        )}
        {view === "orgs" && <OrgsView rows={rows} onEditOrg={goToTableFor} isMobile={isMobile} />}
        {view === "tables" && (
          <TablesView
            rows={rows}
            onUpdate={updateCell}
            onReset={resetData}
            highlightId={highlightId}
            isMobile={isMobile}
          />
        )}

        {/* ── сводная строка с пандой ── */}
        <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(96,126,190,0.14)] pt-4 pb-6 sm:mt-8 sm:gap-3 sm:pt-5 sm:pb-8 md:pb-10">
          <p className="flex items-center gap-2 text-[11px] font-semibold text-mist-500 sm:text-[12px]">
            <PandaMini className="text-mist-600 hidden sm:block" />
            <span>
              {t("total")}: <span className="tabular text-mist-300">{fmt(totals.total)}</span>
              <span className="hidden sm:inline"> {t("normativ")} </span>
              <span className="sm:hidden"> / {t("normativ")} </span>
              <span className="tabular text-mist-300">{fmt(totals.norm)}</span>
              {" "}
              <span className={`tabular ${totals.total > totals.norm ? "text-good" : "text-mist-300"}`}>
                ({normPct}%)
              </span>
            </span>
          </p>
          <p className="text-[11px] font-semibold text-mist-500 sm:text-[12px]">
            {t("footerNote")}
          </p>
        </footer>
      </main>

      {/* ── тост ── */}
      {toast && (
        <div className="toast-in fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-xl border border-[rgba(164,207,90,0.4)] bg-[rgba(19,28,48,0.96)] px-3 py-2.5 shadow-2xl sm:bottom-6 sm:right-6 sm:gap-3 sm:px-4 sm:py-3">
          <PandaMini className="text-good" />
          <span className="text-[12px] font-bold text-mist-100 sm:text-sm">{t(toast as any)}</span>
        </div>
      )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
