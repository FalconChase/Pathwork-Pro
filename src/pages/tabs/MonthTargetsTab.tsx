import { useEffect, useState } from "react";
import { getDb } from "@/db/client";
import { listPayItems } from "@/db/payItems";
import {
  listMonthTargets,
  setMonthTargetWeight,
  deriveMonthColumns,
  sumWeightForItem,
} from "@/db/monthTargets";
import type { Project, PayItemWithAmount, MonthTarget, MonthColumn } from "@/types";

type Mode = "pct" | "amt";

export default function MonthTargetsTab({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [items, setItems] = useState<PayItemWithAmount[]>([]);
  const [targets, setTargets] = useState<MonthTarget[]>([]);
  const [months, setMonths] = useState<MonthColumn[]>([]);
  const [mode, setMode] = useState<Mode>("pct");
  const [tolerance, setTolerance] = useState(2);

  async function refresh() {
    const db = getDb();
    const projRows = await db.select<Project[]>("SELECT * FROM projects WHERE id = $1", [projectId]);
    const proj = projRows[0];
    setProject(proj);
    if (proj) setMonths(deriveMonthColumns(proj));

    setItems(await listPayItems(projectId));
    setTargets(await listMonthTargets(projectId));

    const settings = await db.select<{ weight_tolerance_pct: number }[]>(
      "SELECT weight_tolerance_pct FROM project_settings WHERE project_id = $1",
      [projectId]
    );
    if (settings[0]) setTolerance(settings[0].weight_tolerance_pct);
  }

  useEffect(() => {
    refresh();
  }, [projectId]);

  function weightFor(payItemId: string, monthIndex: number): number {
    return targets.find((t) => t.pay_item_id === payItemId && t.month_index === monthIndex)?.weight_pct ?? 0;
  }

  async function handleCellChange(item: PayItemWithAmount, monthIndex: number, raw: string) {
    const num = Number(raw);
    if (Number.isNaN(num)) return;
    const weightPct = mode === "pct" ? num : item.amount > 0 ? (num / item.amount) * 100 : 0;
    await setMonthTargetWeight(projectId, item.id, monthIndex, weightPct);
    refresh();
  }

  if (!project) return null;

  const monthlyTotals = months.map((m) =>
    items.reduce((sum, item) => sum + (item.amount * weightFor(item.id, m.index)) / 100, 0)
  );

  return (
    <div>
      <div className="flex justify-end items-center gap-2 mb-2">
        <label className="text-sm" style={{ color: "var(--text-secondary)" }}>Show as</label>
        <select
          className="text-sm border rounded-md px-2 py-1"
          style={{ borderColor: "var(--border)" }}
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
        >
          <option value="pct">Weight %</option>
          <option value="amt">Amount</option>
        </select>
      </div>

      <div className="rounded-xl border overflow-x-auto" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
        <table className="text-sm" style={{ minWidth: "100%" }}>
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              <th className="px-2 py-2 text-left font-medium sticky left-0" style={{ color: "var(--text-secondary)", background: "var(--surface-2)" }}>
                Pay item
              </th>
              {months.map((m) => (
                <th key={m.index} className="px-2 py-2 text-right font-medium whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const sum = sumWeightForItem(targets, item.id);
              const offTolerance = Math.abs(sum - 100) > tolerance;
              return (
                <tr key={item.id} className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="px-2 py-1.5 sticky left-0" style={{ background: "var(--surface-2)" }}>
                    <span>{item.pay_item_id || item.description}</span>
                    {offTolerance && (
                      <span className="ml-1 text-xs" style={{ color: "var(--text-warning)" }} title={`Sums to ${sum.toFixed(0)}%`}>
                        ⚠
                      </span>
                    )}
                  </td>
                  {months.map((m) => {
                    const w = weightFor(item.id, m.index);
                    const display = mode === "pct" ? w : (item.amount * w) / 100;
                    return (
                      <td key={m.index} className="px-1">
                        <input
                          className="w-20 text-right text-sm bg-transparent px-1 py-1"
                          type="number"
                          defaultValue={Math.round(display * 100) / 100}
                          onBlur={(e) => handleCellChange(item, m.index, e.target.value)}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t" style={{ borderColor: "var(--border-strong)" }}>
              <td className="px-2 py-2 font-medium sticky left-0" style={{ background: "var(--surface-2)" }}>
                Monthly target
              </td>
              {monthlyTotals.map((t, i) => (
                <td key={i} className="px-2 py-2 text-right font-medium whitespace-nowrap">
                  ₱{Math.round(t).toLocaleString()}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
        Monthly target always shows as an amount — it feeds the cash flow / S-curve regardless of the toggle above.
        Rows marked ⚠ don't sum to 100% within the {tolerance}% tolerance set in Settings.
      </p>
    </div>
  );
}
