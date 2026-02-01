export function formatTracking(data) {
  const s = data?.summary || {};
  const d = data?.detail || {};
  const h = Array.isArray(data?.history) ? data.history : [];

  let text = `📦 *CEK RESI*\n
• AWB: \`${s.awb || "-"}\`
• Kurir: *${s.courier || "-"}*
• Status: *${s.status || "-"}*
• Update: ${s.date || "-"}

📍 *Rute*
${d.origin || "-"} → ${d.destination || "-"}

🧾 *Riwayat:*`;

  h.slice(0, 7).forEach((i) => {
    text += `\n\n• ${i.date || "-"}\n  ${i.desc || "-"}\n  (${i.location || "-"})`;
  });

  return text;
}
