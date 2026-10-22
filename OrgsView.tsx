import { ReactNode } from "react";
import { OrgData, aggregate, fmt, normPct, orgTotal, pct, tierOf } from "../data";
import { useInView } from "../hooks";
import { Donut, DonutSegment } from "./Donut";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";

interface Props {
  rows: OrgData[];
  onEditOrg: (id: string) => void;
  isMobile?: boolean;
}

const EditIcon = (
  <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden>
    <path
      d="M10.2 1.9a1.3 1.3 0 0 1 1.9 0l0 0a1.3 1.3 0 0 1 0 1.9L5 10.9l-2.7.9.9-2.7 7-7.2Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path d="m8.8 3.3 1.9 1.9" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

function MiniStat({ label, value, color, note }: { label: string; value: number; color: string; note?: string }) {
  return (
    <div className="rounded-xl border border-[rgba(96,126,190,0.16)] bg-[rgba(9,14,25,0.5)] px-3 py-2.5">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-mist-500">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        {label}
      </p>
      <p className="tabular mt-1 font-display text-lg font-bold text-mist-100">{fmt(value)}</p>
      {note ? <p className="text-[10px] font-bold text-mist-500">{note}</p> : null}
    </div>
  );
}

function Row({
  label,
  value,
  total,
  color,
  note,
  delay = 0,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  note?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  const w = total > 0 ? (value / total) * 100 : 0;
  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-2 text-[12px] font-bold text-mist-300">
          <span className="h-2 w-2 rounded-[3px]" style={{ background: color }} />
          {label}
        </span>
        <span className="tabular text-sm font-extrabold text-mist-100">
          {fmt(value)}
          <span className="ml-1.5 text-[11px] font-bold text-mist-500">{total > 0 ? `${Math.round(w)}%` : "—"}</span>
        </span>
      </div>
      <div className="pbar mt-1.5">
        <div
          className="pbar-fill"
          style={{
            width: inView ? `${w}%` : "0%",
            background: color,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      {note ? <p className="mt-1 text-[10px] font-bold text-mist-500">{note}</p> : null}
    </div>
  );
}

function OrgCard({ r, index, onEdit, isMobile = false }: { r: OrgData; index: number; onEdit: () => void; isMobile?: boolean }) {
  const [ref, inView] = useInView<HTMLElement>(0.1);
  const total = orgTotal(r);
  const p = pct(r.completed, total);
  const tier = tierOf(p);
  const nP = normPct(r);
  const over = r.norm > 0 && total > r.norm;
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const segments: DonutSegment[] = [
    { id: "planned", label: t("planned"), value: r.planned, color: "#5aa7f0" },
    { id: "unplanned", label: t("unplannedEvents"), value: r.unplanned, color: "#f0a83e" },
  ];

  return (
    <article
      ref={ref}
      className={`card reveal ${inView ? "in" : ""} p-5 sm:p-6`}
      style={{ transitionDelay: `${(index % 3) * 90}ms` }}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl font-display text-[13px] font-bold"
            style={{ background: `${r.color}1a`, color: r.color, border: `1px solid ${r.color}55` }}
          >
            {r.short.slice(0, 4)}
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-mist-100 leading-tight">{r.name}</h3>
            <p className="mt-0.5 text-[11px] font-bold text-mist-500">
              {t("organization")} {String(index + 1).padStart(2, "0")} · {t("total")} {fmt(total)} {t("totalEvents")}
            </p>
          </div>
        </div>
        <span className="h-2.5 w-2.5 shrink-0 rounded-full mt-1.5" style={{ background: r.color }} />
      </header>

      <div className="mt-4 flex flex-col sm:flex-row items-center gap-5">
        <Donut
          segments={segments}
          size={isMobile ? 140 : 172}
          thickness={isMobile ? 18 : 20}
          centerLabel="Всего"
          centerValue={total}
          centerSub={`норма ${fmt(r.norm)}`}
        />
        <div className="w-full space-y-3.5">
          <Row label={t("planned")} value={r.planned} total={total} color="#5aa7f0" delay={60} />
          <Row
            label={t("practical")}
            value={Math.min(r.practical, r.planned)}
            total={total}
            color="#35c9a3"
            delay={140}
            note={t("fromPlanned")}
          />
          <Row label={t("unplannedEvents")} value={r.unplanned} total={total} color="#f0a83e" delay={220} />
          <Row label={t("withSpeakers")} value={Math.min(r.speakers, total)} total={total} color="#ef6f5e" delay={300} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <MiniStat label={t("performance")} value={Math.round(p)} color={tier.color} note={t(tier.label.toLowerCase().replace(/\s+/g, '') as any) || tier.label} />
        <MiniStat label={t("completedEvents")} value={r.completed} color="#eef2fb" note={`${t("total")} ${fmt(total)}`} />
        <MiniStat
          label={t("normativ")}
          value={r.norm > 0 ? nP : 0}
          color={over ? "#a4cf5a" : "#8b98b8"}
          note={over ? `+${fmt(total - r.norm)} ${t("overNorm")}` : t("withinNorm")}
        />
      </div>

      {isAuthenticated && (
        <button
          onClick={onEdit}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(96,126,190,0.3)] bg-[rgba(51,69,111,0.35)] px-4 py-2.5 text-[13px] font-bold text-mist-300 transition hover:border-[rgba(90,167,240,0.6)] hover:bg-[rgba(51,69,111,0.6)] hover:text-mist-100"
        >
          {EditIcon}
          {t("editInTable")}
        </button>
      )}
    </article>
  );
}

export default function OrgsView({ rows, onEditOrg, isMobile = false }: Props) {
  const all = aggregate(rows);
  const overallP = pct(all.completed, all.total);
  const overallTier = tierOf(overallP);
  const [ref, inView] = useInView<HTMLElement>(0.08);
  const { t } = useLanguage();

  const chips: { label: string; value: ReactNode }[] = [
    { label: "Норматив", value: fmt(all.norm) },
    { label: "Плановые", value: fmt(all.planned) },
    { label: "Практикалы", value: fmt(all.practical) },
    { label: "Внеплановые", value: fmt(all.unplanned) },
    { label: "Со спикерами", value: fmt(all.speakers) },
    { label: "Выполнено", value: fmt(all.completed) },
    { label: "Успеваемость", value: `${Math.round(overallP)}%` },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-mist-500">{t("orgBreakdown")}</p>
          <h2 className="font-display mt-1 text-xl sm:text-2xl font-bold text-mist-100">
            {t("separateOrgs")}
          </h2>
          <p className="mt-1.5 text-sm font-semibold text-mist-500">
            {t("orgsNote")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {rows.map((r, i) => (
          <OrgCard key={r.id} r={r} index={i} onEdit={() => onEditOrg(r.id)} isMobile={isMobile} />
        ))}

        {/* сводная карточка */}
        <article
          ref={ref}
          className={`card reveal ${inView ? "in" : ""} p-5 sm:p-6 md:col-span-2 xl:col-span-3`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-mist-500">{t("summary")}</p>
              <h3 className="font-display mt-1 text-base font-bold text-mist-100">{t("allOrgs")}</h3>
            </div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold"
              style={{ background: `${overallTier.color}1f`, color: overallTier.color }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: overallTier.color }} />
              {overallTier.label} · {Math.round(overallP)}%
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {chips.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(96,126,190,0.25)] bg-[rgba(9,14,25,0.5)] px-3.5 py-2 text-xs font-bold text-mist-500"
              >
                {c.label}
                <span className="tabular font-display text-[13px] font-bold text-mist-100">{c.value}</span>
              </span>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
