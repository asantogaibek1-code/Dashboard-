import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_DATA,
  METRIC_META,
  MetricKey,
  OrgData,
  aggregate,
  fmt,
  normPct,
  orgTotal,
  pct,
  tierOf,
} from "../data";
import { useInView } from "../hooks";
import { RingValue } from "./Donut";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";

interface Props {
  rows: OrgData[];
  onUpdate: (id: string, key: MetricKey, value: number) => void;
  onReset: () => void;
  highlightId?: string | null;
  isMobile?: boolean;
}

function TableCard({
  kicker,
  title,
  hint,
  right,
  children,
  delay = 0,
  className = "",
}: {
  kicker: string;
  title: string;
  hint?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.06);
  return (
    <section
      ref={ref}
      className={`card reveal ${inView ? "in" : ""} p-5 sm:p-6 ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-mist-500">{kicker}</p>
          <h2 className="font-display mt-1 text-sm font-semibold text-mist-100 sm:text-base">{title}</h2>
          {hint ? <p className="mt-1 text-[12px] font-semibold text-mist-500">{hint}</p> : null}
        </div>
        {right}
      </header>
      {children}
    </section>
  );
}

function MetricInput({
  row,
  k,
  invalid,
  onInvalid,
  onChange,
}: {
  row: OrgData;
  k: MetricKey;
  invalid: boolean;
  onInvalid: (v: boolean) => void;
  onChange: (v: number) => void;
}) {
  const meta = METRIC_META.find((m) => m.key === k);
  return (
    <div className="relative">
      <input
        type="number"
        min={0}
        step={1}
        inputMode="numeric"
        value={row[k]}
        title={`${meta?.label ?? ""} — ${meta?.hint ?? ""}`}
        onChange={(e) => {
          const raw = e.target.value;
          const n = raw === "" ? 0 : Math.floor(Number(raw));
          onInvalid(raw !== "" && (!Number.isFinite(n) || n < 0));
          onChange(Number.isFinite(n) && n >= 0 ? n : 0);
        }}
        className={`cell-input ${invalid ? "invalid" : ""}`}
      />
      {invalid ? (
        <span className="pointer-events-none absolute -top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-speak shadow-[0_0_8px_rgba(239,111,94,0.7)]" />
      ) : null}
    </div>
  );
}

export default function TablesView({ rows, onUpdate, onReset, highlightId, isMobile = false }: Props) {
  const totals = aggregate(rows);
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [flashId, setFlashId] = useState<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const hasInvalid = Object.values(invalid).some(Boolean);
  const practiceOverflow = rows.some((r) => r.practical > r.planned);

  useEffect(() => {
    if (!highlightId) return;
    const orgId = highlightId.split("#")[0];
    setFlashId(orgId);
    const scroll = setTimeout(() => {
      rowRefs.current[orgId]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    const clear = setTimeout(() => setFlashId(null), 2400);
    return () => {
      clearTimeout(scroll);
      clearTimeout(clear);
    };
  }, [highlightId]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-mist-500">{t("exactNumbers")}</p>
          <h2 className="font-display mt-1 text-xl font-bold text-mist-100 sm:text-2xl">
            {t("eventsByOrgs")}
          </h2>
          <p className="mt-1.5 text-sm font-semibold text-mist-500">
            {t("editNote")}
          </p>
        </div>
        {isAuthenticated && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(96,126,190,0.3)] px-4 py-2 text-xs font-bold text-mist-300 transition hover:border-[rgba(239,111,94,0.55)] hover:text-mist-100"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M2.2 7a4.8 4.8 0 1 0 1.4-3.4M3.6 1.2v2.6h2.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("restoreDefaults")}
          </button>
        )}
      </div>

      {(hasInvalid || practiceOverflow) && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-[rgba(239,111,94,0.4)] bg-[rgba(239,111,94,0.08)] px-4 py-3 text-[12px] font-bold text-[#f3b1a7]">
          {hasInvalid ? <span>· Значения не могут быть отрицательными — такие ячейки отмечены.</span> : null}
          {practiceOverflow ? (
            <span>· Практикалы учитываются в пределах плановых: лишние не попадают в диаграмму структуры.</span>
          ) : null}
        </div>
      )}

      {/* ── Таблица точных цифр ── */}
      <TableCard
        kicker={t("eventsByOrgs")}
        title={t("eventsByOrgs")}
        hint={t("editNote")}
        delay={0}
        right={
          isAuthenticated ? (
            <span className="rounded-full border border-[rgba(164,207,90,0.3)] bg-[rgba(164,207,90,0.1)] px-3 py-1 text-[11px] font-bold text-good">
              {t("editMode")}
            </span>
          ) : (
            <span className="rounded-full border border-[rgba(130,160,220,0.25)] px-3 py-1 text-[11px] font-bold text-mist-500">
              {t("viewOnly")}
            </span>
          )
        }
      >
        <div className="overflow-x-auto -mx-1 px-1">
          <table className="data-table w-full min-w-[720px] sm:min-w-[820px] border-collapse">
            <thead>
              <tr>
                <th>Организация</th>
                {METRIC_META.map((m) => (
                  <th key={m.key} title={m.hint}>
                    {m.label}
                  </th>
                ))}
                <th className="hidden sm:table-cell">Всего</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  ref={(el) => {
                    rowRefs.current[r.id] = el;
                  }}
                  className={flashId === r.id ? "row-flash" : ""}
                >
                  <td className="text-left">
                    <span className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-[4px]" style={{ background: r.color }} />
                      <span className="text-sm font-bold text-mist-100">{r.name}</span>
                    </span>
                  </td>
                  {METRIC_META.map((m) => (
                    <td key={m.key} className="w-[104px]">
                      {isAuthenticated ? (
                        <MetricInput
                          row={r}
                          k={m.key}
                          invalid={!!invalid[`${r.id}:${m.key}`]}
                          onInvalid={(v) => setInvalid((p) => ({ ...p, [`${r.id}:${m.key}`]: v }))}
                          onChange={(v) => onUpdate(r.id, m.key, v)}
                        />
                      ) : (
                        <span className="tabular text-sm font-bold text-mist-300">
                          {fmt(r[m.key])}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="text-right hidden sm:table-cell">
                    <span className="tabular inline-block rounded-lg bg-[rgba(51,69,111,0.45)] px-3 py-1.5 text-sm font-extrabold text-mist-100">
                      {fmt(orgTotal(r))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[rgba(130,160,220,0.3)] bg-[rgba(51,69,111,0.25)]">
                <td className="text-left text-sm font-extrabold uppercase tracking-wider text-mist-300">Итого</td>
                {METRIC_META.map((m) => (
                  <td key={m.key} className="text-right text-sm font-extrabold text-mist-100">
                    {fmt(totals[m.key])}
                  </td>
                ))}
                <td className="text-right hidden sm:table-cell">
                  <span className="tabular inline-block rounded-lg bg-plan/20 px-3 py-1.5 text-sm font-extrabold text-plan">
                    {fmt(totals.total)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </TableCard>

      {/* ── Общая таблица успеваемости ── */}
      <TableCard
        kicker={t("performance")}
        title={t("performanceTable")}
        hint={t("performanceTableNote")}
        delay={80}
      >
        <div className="overflow-x-auto -mx-1 px-1">
          <table className="data-table w-full min-w-[640px] sm:min-w-[760px] border-collapse">
            <thead>
              <tr>
                <th>Организация</th>
                <th>Всего</th>
                <th className="hidden sm:table-cell">Выполнено</th>
                <th className="hidden sm:table-cell">Остаток</th>
                <th>Успеваемость</th>
                <th>Статус</th>
                <th className="hidden sm:table-cell">Норматив</th>
                <th>Норма, %</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const t = orgTotal(r);
                const p = pct(r.completed, t);
                const tier = tierOf(p);
                const nP = normPct(r);
                const over = r.norm > 0 && nP >= 100;
                return (
                  <tr
                    key={r.id}
                    ref={(el) => {
                      rowRefs.current[r.id] = el;
                    }}
                    className={flashId === r.id ? "row-flash" : ""}
                  >
                    <td className="text-left">
                      <span className="flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 rounded-[4px]" style={{ background: r.color }} />
                        <span className="text-sm font-bold text-mist-100">{r.name}</span>
                      </span>
                    </td>
                    <td className="text-right font-bold text-mist-300">{fmt(t)}</td>
                    <td className="text-right font-bold text-mist-300 hidden sm:table-cell">{fmt(r.completed)}</td>
                    <td className="text-right hidden sm:table-cell">
                      <span className={`font-bold ${t > r.completed ? "text-unplan" : "text-good"}`}>
                        {t > r.completed ? fmt(t - r.completed) : "0"}
                      </span>
                    </td>
                    <td className="w-[190px]">
                      <span className="flex items-center gap-3">
                        <span className="pbar flex-1">
                          <span
                            className="pbar-fill"
                            style={{ width: `${Math.min(p, 100)}%`, background: tier.color }}
                          />
                        </span>
                        <span className="tabular w-14 text-right text-sm font-extrabold" style={{ color: tier.color }}>
                          <RingValue value={p} suffix="%" />
                        </span>
                      </span>
                    </td>
                    <td className="text-right">
                      <span
                        className="inline-block rounded-full px-2.5 py-1 text-[11px] font-extrabold"
                        style={{ background: `${tier.color}1c`, color: tier.color }}
                      >
                        {tier.label}
                      </span>
                    </td>
                    <td className="text-right font-bold text-mist-300 hidden sm:table-cell">{fmt(r.norm)}</td>
                    <td className="text-right">
                      <span className={`tabular text-sm font-extrabold ${over ? "text-good" : "text-mist-300"}`}>
                        {r.norm > 0 ? `${nP}%` : "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[rgba(130,160,220,0.3)] bg-[rgba(51,69,111,0.25)]">
                <td className="text-left text-sm font-extrabold uppercase tracking-wider text-mist-300">Итого</td>
                <td className="text-right text-sm font-extrabold text-mist-100">{fmt(totals.total)}</td>
                <td className="text-right text-sm font-extrabold text-mist-100 hidden sm:table-cell">{fmt(totals.completed)}</td>
                <td className="text-right text-sm font-extrabold text-mist-100 hidden sm:table-cell">
                  {totals.total > totals.completed ? fmt(totals.total - totals.completed) : "0"}
                </td>
                <td className="text-right">
                  <span className="tabular text-sm font-extrabold text-mist-100">
                    {totals.total > 0 ? `${pct(totals.completed, totals.total)}%` : "—"}
                  </span>
                </td>
                <td className="text-right">
                  <span
                    className="inline-block rounded-full px-2.5 py-1 text-[11px] font-extrabold"
                    style={{ background: `${tierOf(pct(totals.completed, totals.total)).color}1c`, color: tierOf(pct(totals.completed, totals.total)).color }}
                  >
                    {tierOf(pct(totals.completed, totals.total)).label}
                  </span>
                </td>
                <td className="text-right text-sm font-extrabold text-mist-100 hidden sm:table-cell">{fmt(totals.norm)}</td>
                <td className="text-right">
                  <span className="tabular text-sm font-extrabold text-good">
                    {totals.norm > 0 ? `${Math.round((totals.total / totals.norm) * 100)}%` : "—"}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-bold text-mist-500">
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-good" />≥ 85% — отлично</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-plan" />65–84% — хорошо</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-unplan" />45–64% — средне</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-speak" />&lt; 45% — требует внимания</span>
        </div>

        <p className="mt-3 text-[11px] font-semibold text-mist-500">
          Исходные значения для сравнения: {DEFAULT_DATA.map((d) => `${d.short} ${d.planned}+${d.unplanned}`).join(" · ")}
        </p>
      </TableCard>
    </div>
  );
}
