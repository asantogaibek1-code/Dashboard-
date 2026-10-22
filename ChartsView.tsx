import { ReactNode, useState } from "react";
import { OrgData, aggregate, fmt, normPct, orgTotal, pct, tierOf, CAT } from "../data";
import { useInView } from "../hooks";
import { Donut, Ring, RingValue, DonutSegment } from "./Donut";
import { useLanguage } from "../LanguageContext";

interface Props {
  rows: OrgData[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  isMobile?: boolean;
}

function Card({
  kicker,
  title,
  right,
  children,
  className = "",
  delay = 0,
}: {
  kicker: string;
  title: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.08);
  return (
    <section
      ref={ref}
      className={`card reveal ${inView ? "in" : ""} p-5 sm:p-6 ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <header className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-mist-500">{kicker}</p>
          <h2 className="font-display font-semibold text-mist-100 text-sm sm:text-base mt-1 leading-snug">
            {title}
          </h2>
        </div>
        {right}
      </header>
      {children}
    </section>
  );
}

function FilterChip({ name, onClear }: { name: string; onClear: () => void }) {
  return (
    <button
      onClick={onClear}
      className="group inline-flex items-center gap-2 rounded-full border border-[rgba(130,160,220,0.35)] bg-[rgba(51,69,111,0.45)] px-3 py-1.5 text-xs font-bold text-mist-300 transition hover:border-[rgba(239,111,94,0.6)] hover:text-mist-100"
      title="Снять фильтр"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-plan" />
      {name}
      <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-60 group-hover:opacity-100">
        <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export default function ChartsView({ rows, selectedId, onSelect, isMobile = false }: Props) {
  const [hoverOrg, setHoverOrg] = useState<string | null>(null);
  const selected = rows.find((r) => r.id === selectedId) ?? null;
  const scope = selected ? [selected] : rows;
  const agg = aggregate(scope);
  const all = aggregate(rows);
  const { t } = useLanguage();

  const totalEvents = all.total;
  const orgSegments: DonutSegment[] = rows.map((r) => ({
    id: r.id,
    label: r.short,
    value: orgTotal(r),
    color: r.color,
  }));

  const structure: DonutSegment[] = [
    { id: "practical", label: t("practical"), value: Math.min(agg.practical, agg.planned), color: CAT.practical },
    { id: "other-plan", label: t("planned"), value: Math.max(0, agg.planned - agg.practical), color: CAT.planned },
    { id: "unplanned", label: t("unplannedEvents"), value: agg.unplanned, color: CAT.unplanned },
  ];

  /* Форматы: со спикерами + практикалы + прочие (без пересечений) */
  const speakersClamped = Math.min(agg.speakers, agg.total);
  const practiceClamped = Math.min(agg.practical, agg.total - speakersClamped);
  const formats: DonutSegment[] = [
    { id: "speakers", label: t("withSpeakers"), value: speakersClamped, color: CAT.speakers },
    { id: "practice", label: t("practical"), value: practiceClamped, color: CAT.practical },
    { id: "rest", label: t("planned"), value: Math.max(0, agg.total - speakersClamped - practiceClamped), color: CAT.muted },
  ];

  const scale = Math.max(1, ...rows.map((r) => Math.max(orgTotal(r), r.norm)));
  const overallPct = pct(all.completed, all.total);
  const overallTier = tierOf(overallPct);
  const overallNormPct = all.norm > 0 ? Math.round((all.total / all.norm) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
      {/* ── По организациям ─────────────────────────── */}
      <Card
        kicker={t("distribution")}
        title={t("eventsByOrg")}
        className="lg:col-span-5 lg:row-span-2"
        delay={0}
        right={
          <span className="mt-0.5 inline-flex items-center gap-2 rounded-full border border-[rgba(130,160,220,0.25)] px-3 py-1 text-[11px] font-bold text-mist-500">
            {t("total")}&nbsp;
            <span className="text-mist-100 tabular">{fmt(totalEvents)}</span>
          </span>
        }
      >
        <div className="flex flex-col items-center gap-6">
          <Donut
            segments={orgSegments}
            size={isMobile ? 220 : 280}
            thickness={isMobile ? 22 : 26}
            centerLabel="Мероприятий"
            centerValue={totalEvents}
            centerSub="7 организаций"
            activeId={selectedId}
            hoverId={hoverOrg}
            onSegmentClick={(id) => onSelect(selectedId === id ? null : id)}
          />
          <ul className="w-full space-y-1">
            {rows.map((r) => {
              const t = orgTotal(r);
              const share = totalEvents > 0 ? Math.round((t / totalEvents) * 100) : 0;
              const isSel = selectedId === r.id;
              return (
                <li key={r.id}>
                  <button
                    onClick={() => onSelect(isSel ? null : r.id)}
                    onPointerEnter={() => setHoverOrg(r.id)}
                    onPointerLeave={() => setHoverOrg(null)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition border ${
                      isSel
                        ? "border-[rgba(130,160,220,0.45)] bg-[rgba(51,69,111,0.4)]"
                        : "border-transparent hover:bg-[rgba(51,69,111,0.28)]"
                    } ${selectedId && !isSel ? "opacity-45" : ""}`}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-[4px]" style={{ background: r.color }} />
                    <span className="flex-1 truncate text-sm font-bold text-mist-300 group-hover:text-mist-100">
                      {r.name}
                    </span>
                    <span className="tabular text-sm font-extrabold text-mist-100">{fmt(t)}</span>
                    <span className="tabular w-10 text-right text-xs font-bold text-mist-500">{share}%</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="text-[11px] font-semibold text-mist-500 -mt-2">
            {t("clickToFilter")}
          </p>
        </div>
      </Card>

      {/* ── Структура ──────────────────────────────── */}
      <Card
        kicker={t("composition")}
        title={t("eventStructure")}
        className="lg:col-span-4"
        delay={80}
        right={selected ? <FilterChip name={selected.short} onClear={() => onSelect(null)} /> : undefined}
      >
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <Donut
            segments={structure}
            size={190}
            thickness={22}
            centerLabel="Всего"
            centerValue={agg.total}
            centerSub={selected ? selected.short : "все организации"}
          />
          <ul className="w-full space-y-2.5">
            {structure.map((s) => (
              <li key={s.id} className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-[4px]" style={{ background: s.color }} />
                <span className="flex-1 text-[13px] font-semibold text-mist-300">{s.label}</span>
                <span className="tabular text-sm font-extrabold text-mist-100">{fmt(s.value)}</span>
                <span className="tabular w-10 text-right text-xs font-bold text-mist-500">
                  {agg.total > 0 ? Math.round((s.value / agg.total) * 100) : 0}%
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-mist-500 font-semibold">
          {t("practiceNote")}
        </p>
      </Card>

      {/* ── Форматы ────────────────────────────────── */}
      <Card
        kicker={t("format")}
        title={t("speakersAndPractice")}
        className="lg:col-span-3"
        delay={140}
        right={selected ? <FilterChip name={selected.short} onClear={() => onSelect(null)} /> : undefined}
      >
        <div className="flex flex-col items-center gap-4">
          <Donut
            segments={formats}
            size={185}
            thickness={22}
            centerLabel="Со спикерами"
            centerValue={speakersClamped}
            centerSub={agg.total > 0 ? `${Math.round((speakersClamped / agg.total) * 100)}% всех` : "—"}
          />
          <ul className="w-full space-y-2.5">
            {formats.map((s) => (
              <li key={s.id} className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-[4px]" style={{ background: s.color }} />
                <span className="flex-1 text-[13px] font-semibold text-mist-300">{s.label}</span>
                <span className="tabular text-sm font-extrabold text-mist-100">{fmt(s.value)}</span>
                <span className="tabular w-10 text-right text-xs font-bold text-mist-500">
                  {agg.total > 0 ? Math.round((s.value / agg.total) * 100) : 0}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* ── Сравнение с нормативом ─────────────────── */}
      <Card
        kicker={t("comparison")}
        title={t("planVsNorm")}
        className="lg:col-span-7 relative overflow-hidden"
        delay={200}
        right={
          <span className="mt-1 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-mist-500">
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-[3px] bg-plan" />{t("plan")}</span>
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-[3px] bg-unplan" />{t("unplanned")}</span>
            <span className="flex items-center gap-1.5"><i className="h-3 w-0 border-r-2 border-dashed border-good/70" />{t("norm")}</span>
            <span className="flex items-center gap-1.5"><i className="h-3 w-0.5 rounded bg-mist-100/80" />{t("completed")}</span>
          </span>
        }
      >
        <ul className="space-y-3">
          {rows.map((r) => {
            const t = orgTotal(r);
            const barW = (t / scale) * 100;
            const trackW = (r.norm / scale) * 100;
            const planShare = t > 0 ? (r.planned / t) * 100 : 0;
            const markerLeft = (Math.min(r.completed, scale) / scale) * 100;
            const nPct = r.norm > 0 ? Math.round((t / r.norm) * 100) : 0;
            const over = t > r.norm;
            const isSel = selectedId === r.id;
            return (
              <li key={r.id}>
                <button
                  onClick={() => onSelect(isSel ? null : r.id)}
                  className={`group grid w-full grid-cols-[92px_1fr_104px] items-center gap-3 rounded-xl px-2 py-1.5 text-left transition border ${
                    isSel
                      ? "border-[rgba(130,160,220,0.45)] bg-[rgba(51,69,111,0.4)]"
                      : "border-transparent hover:bg-[rgba(51,69,111,0.28)]"
                  } ${selectedId && !isSel ? "opacity-45" : ""}`}
                >
                  <span className="flex items-center gap-2 text-[13px] font-bold text-mist-300 group-hover:text-mist-100">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: r.color }} />
                    {r.short}
                  </span>
                  <span className="relative block h-4 overflow-visible">
                    {/* дорожка = годовой норматив */}
                    <span
                      className="absolute inset-y-0 left-0 rounded-full border-r-2 border-dashed border-good/70 bg-[rgba(38,52,86,0.55)] transition-[width] duration-700 ease-out"
                      style={{ width: `${trackW}%` }}
                      title={`Норматив: ${r.norm} в год`}
                    />
                    {/* факт: план + внеплановые, может выходить за норму */}
                    <span
                      className="absolute inset-y-0 left-0 flex overflow-hidden rounded-full transition-[width] duration-700 ease-out"
                      style={{
                        width: `${barW}%`,
                        boxShadow: over ? "0 0 12px rgba(164,207,90,0.28)" : "none",
                      }}
                    >
                      <span className="h-full bg-plan transition-[width] duration-700" style={{ width: `${planShare}%` }} />
                      <span className="h-full flex-1 bg-unplan/90" />
                    </span>
                    {/* метка «выполнено» */}
                    <span
                      className="absolute -inset-y-1 w-[3px] rounded-full bg-mist-100/85 shadow-[0_0_8px_rgba(238,242,251,0.5)] transition-[left] duration-700 ease-out"
                      style={{ left: `calc(${markerLeft}% - 1px)` }}
                      title={`Выполнено: ${r.completed}`}
                    />
                  </span>
                  <span className="text-right">
                    <span className="tabular block text-sm font-extrabold text-mist-100">{fmt(t)}</span>
                    <span className="tabular block text-[11px] font-bold text-mist-500">вып. {fmt(r.completed)}</span>
                    <span className={`tabular block text-[11px] font-extrabold ${over ? "text-good" : "text-mist-500"}`}>
                      норма {fmt(r.norm)} · {r.norm > 0 ? `${nPct}%` : "—"}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-[11px] font-semibold text-mist-500">
          {t("comparisonNote")}
        </p>
      </Card>

      {/* ── Успеваемость ───────────────────────────── */}
      <Card
        kicker={t("result")}
        title={t("performanceByEvents")}
        className="lg:col-span-12 relative overflow-hidden"
        delay={260}
        right={
          <span className="mt-1 text-[11px] font-bold text-mist-500">
            {t("completed")} <span className="tabular text-mist-100">{fmt(all.completed)}</span> {t("total")}{" "}
            <span className="tabular text-mist-100">{fmt(all.total)}</span>
          </span>
        }
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex items-center gap-6 shrink-0">
            <Ring value={Math.min(overallPct, 100)} size={168} thickness={13} color={overallTier.color}>
              <RingValue value={overallPct} className="font-display font-bold text-3xl" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-mist-500 mt-1">в среднем</span>
            </Ring>
            <div className="max-w-[210px] space-y-3">
              <p
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold"
                style={{ background: `${overallTier.color}1f`, color: overallTier.color }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: overallTier.color }} />
                {overallTier.label}
              </p>
              <p
                className={`inline-flex w-full items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold ${
                  overallNormPct >= 100 ? "text-good" : "text-mist-300"
                }`}
                style={{ background: overallNormPct >= 100 ? "rgba(164,207,90,0.13)" : "rgba(51,69,111,0.4)" }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                  <path
                    d="M6 10V2M6 2 3 5M6 2l3 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                норма года: {overallNormPct}%
              </p>
              <p className="text-[12px] leading-relaxed font-semibold text-mist-500">
                {t("performanceNote")}
              </p>
            </div>
          </div>

          <div className="h-px flex-1 w-full bg-[rgba(96,126,190,0.18)] lg:hidden" />

          <ul className="grid flex-1 grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-4 w-full justify-items-center">
            {rows.map((r) => {
              const p = pct(r.completed, orgTotal(r));
              const t = tierOf(p);
              const nP = normPct(r);
              const isSel = selectedId === r.id;
              return (
                <li key={r.id} className="flex flex-col items-center gap-1.5">
                  <button
                    onClick={() => onSelect(isSel ? null : r.id)}
                    className={`rounded-full transition ${isSel ? "scale-105" : "hover:scale-105"} ${
                      selectedId && !isSel ? "opacity-45" : ""
                    }`}
                    title={r.name}
                  >
                    <Ring value={Math.min(p, 100)} size={86} thickness={8} color={t.color}>
                      <RingValue value={p} className="font-display font-bold text-sm" />
                    </Ring>
                  </button>
                  <span className="text-[11px] font-bold text-mist-500">{r.short}</span>
                  <span
                    className={`tabular rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                      r.norm > 0 && nP >= 100 ? "text-good" : "text-mist-500"
                    }`}
                    style={
                      r.norm > 0 && nP >= 100
                        ? { background: "rgba(164,207,90,0.12)" }
                        : { background: "rgba(38,52,86,0.4)" }
                    }
                  >
                    норма {r.norm > 0 ? `${nP}%` : "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>
    </div>
  );
}
