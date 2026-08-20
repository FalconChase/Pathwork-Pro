import { useEffect, useState } from "react";
import { listPayItems, createPayItem, updatePayItem, deletePayItem } from "@/db/payItems";
import type { PayItemWithAmount } from "@/types";

export default function PayItemsTab({ projectId }: { projectId: string }) {
  const [items, setItems] = useState<PayItemWithAmount[]>([]);

  async function refresh() {
    setItems(await listPayItems(projectId));
  }

  useEffect(() => {
    refresh();
  }, [projectId]);

  async function handleAddRow() {
    await createPayItem(
      projectId,
      { pay_item_id: "", description: "", quantity: 0, unit: "", unit_price: 0 },
      items.length
    );
    refresh();
  }

  async function handleEdit(id: string, field: string, value: string) {
    const numeric = field === "quantity" || field === "unit_price";
    await updatePayItem(id, { [field]: numeric ? Number(value) : value });
    refresh();
  }

  const total = items.reduce((s, i) => s + i.amount, 0);
  const cellClass = "px-2 py-1.5 text-sm bg-transparent w-full";

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button
          onClick={handleAddRow}
          className="text-sm border rounded-md px-3 py-1.5"
          style={{ borderColor: "var(--border-accent)", color: "var(--text-accent)" }}
        >
          + Add pay item
        </button>
      </div>

      <div className="rounded-xl border overflow-x-auto" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
              <th className="px-2 py-2 font-medium" style={{ color: "var(--text-secondary)" }}>Pay item ID</th>
              <th className="px-2 py-2 font-medium" style={{ color: "var(--text-secondary)" }}>Description</th>
              <th className="px-2 py-2 font-medium text-right" style={{ color: "var(--text-secondary)" }}>Qty</th>
              <th className="px-2 py-2 font-medium" style={{ color: "var(--text-secondary)" }}>Unit</th>
              <th className="px-2 py-2 font-medium text-right" style={{ color: "var(--text-secondary)" }}>Unit price</th>
              <th className="px-2 py-2 font-medium text-right" style={{ color: "var(--text-secondary)" }}>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b" style={{ borderColor: "var(--border)" }}>
                <td>
                  <input
                    className={cellClass}
                    defaultValue={item.pay_item_id}
                    onBlur={(e) => handleEdit(item.id, "pay_item_id", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className={cellClass}
                    defaultValue={item.description}
                    onBlur={(e) => handleEdit(item.id, "description", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className={cellClass + " text-right"}
                    type="number"
                    defaultValue={item.quantity}
                    onBlur={(e) => handleEdit(item.id, "quantity", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className={cellClass}
                    defaultValue={item.unit}
                    onBlur={(e) => handleEdit(item.id, "unit", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className={cellClass + " text-right"}
                    type="number"
                    defaultValue={item.unit_price}
                    onBlur={(e) => handleEdit(item.id, "unit_price", e.target.value)}
                  />
                </td>
                <td className="px-2 py-1.5 text-right font-medium">
                  ₱{item.amount.toLocaleString()}
                </td>
                <td className="px-2">
                  <button
                    onClick={async () => { await deletePayItem(item.id); refresh(); }}
                    style={{ color: "var(--text-danger, #a32d2d)" }}
                    className="text-xs"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} className="px-2 py-2 text-right font-medium">Total</td>
              <td className="px-2 py-2 text-right font-medium">₱{total.toLocaleString()}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
