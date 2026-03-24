// CSV and PDF export utilities for admin panel

export function exportToCSV(filename: string, headers: string[], rows: string[][]) {
  const escape = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const csvContent = [
    headers.map(escape).join(","),
    ...rows.map((row) => row.map(escape).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
}

export function exportToPDF(title: string, headers: string[], rows: string[][], summary?: { label: string; value: string }[]) {
  // Build a printable HTML document and trigger print-to-PDF
  const summaryHTML = summary
    ? `<div style="display:flex;gap:24px;margin-bottom:20px;flex-wrap:wrap">${summary
        .map(
          (s) =>
            `<div style="border:1px solid #ddd;border-radius:6px;padding:10px 16px;min-width:120px"><div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px">${s.label}</div><div style="font-size:20px;font-weight:bold;font-family:monospace">${s.value}</div></div>`
        )
        .join("")}</div>`
    : "";

  const tableHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:11px">
      <thead>
        <tr>${headers.map((h) => `<th style="text-align:left;padding:8px 10px;border-bottom:2px solid #222;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#666">${h}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows.map((row, i) => `<tr style="background:${i % 2 === 0 ? "#fff" : "#f9f9f9"}">${row.map((cell) => `<td style="padding:6px 10px;border-bottom:1px solid #eee">${cell}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; padding: 40px; color: #222; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
        <img src="/logo.png" alt="CamelSim" style="width:28px;height:28px" />
        <div>
          <h1 style="margin:0;font-size:18px;font-weight:bold">${title}</h1>
          <p style="margin:2px 0 0;font-size:11px;color:#888">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
      </div>
      ${summaryHTML}
      ${tableHTML}
      <p style="margin-top:20px;font-size:9px;color:#aaa">CamelSim Admin Report · ${rows.length} records</p>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
