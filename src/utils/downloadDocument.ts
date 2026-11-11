import type { Document } from '../types'

// ============================================================
// CSV download
// ============================================================
export function downloadCsv(doc: Document) {
  const { kichwa, safu, jumla } = doc.snapshot
  const rows: string[][] = []
  rows.push(kichwa)

  for (const r of safu) {
    rows.push(r.map((x: string | number) => String(x ?? '')))
  }

  if (jumla) {
    rows.push([])
    rows.push(['JUMLA'])
    for (const [k, v] of Object.entries(jumla)) {
      rows.push([k, String(v)])
    }
  }

  const csv = rows
    .map((r) => r.map((c: string) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, `${slug(doc.jina)}.csv`)
}

// ============================================================
// Excel download (HTML table → .xls)
// ============================================================
export function downloadExcel(doc: Document) {
  const { kichwa, safu, jumla } = doc.snapshot

  const html = `
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head><meta charset="UTF-8" /></head>
      <body>
        <table border="1">
          <thead><tr>${kichwa.map((h: string) => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${safu
              .map(
                (r) =>
                  `<tr>${r
                    .map((c: string | number) => `<td>${String(c ?? '')}</td>`)
                    .join('')}</tr>`
              )
              .join('')}
          </tbody>
        </table>
        ${
          jumla
            ? `<table border="1" style="margin-top:20px;">
                <tr><th colspan="2">JUMLA</th></tr>
                ${Object.entries(jumla)
                  .map(
                    ([k, v]) =>
                      `<tr><td>${k.replace(/_/g, ' ')}</td><td>${v}</td></tr>`
                  )
                  .join('')}
              </table>`
            : ''
        }
      </body>
    </html>
  `
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  triggerDownload(blob, `${slug(doc.jina)}.xls`)
}

// ============================================================
// PDF download (print dialog)
// ============================================================
export function downloadPdf(doc: Document) {
  const { kichwa, safu, jumla, metadata } = doc.snapshot

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${doc.jina}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; padding: 32px; color: #1e293b; }
          h1 { font-size: 20px; margin: 0 0 4px; }
          .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; }
          .meta strong { color: #0f172a; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 12px; }
          th { background: #f1f5f9; text-align: left; padding: 8px; font-weight: 600; border-bottom: 2px solid #cbd5e1; }
          td { padding: 7px 8px; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) td { background: #f8fafc; }
          .jumla { margin-top: 20px; font-size: 11px; background: #f8fafc; padding: 12px; border-radius: 6px; }
          .jumla strong { display: inline-block; min-width: 140px; }
          .metadata { margin-top: 20px; font-size: 11px; color: #64748b; }
          .metadata strong { color: #0f172a; }
          .footer { margin-top: 24px; font-size: 10px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <h1>SMART HARDWARE</h1>
        <div class="meta">
          <strong>${doc.jina}</strong><br/>
          Duka: ${doc.dukaJina} | Kipindi: ${doc.kipindi} | Tarehe: ${doc.tarehe} ${doc.muda}<br/>
          Aliyezalisha: ${doc.aliyezalisha} | ID: ${doc.id}
        </div>
        <table>
          <thead><tr>${kichwa.map((h: string) => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${safu
              .map(
                (r) =>
                  `<tr>${r
                    .map((c: string | number) => `<td>${String(c ?? '')}</td>`)
                    .join('')}</tr>`
              )
              .join('')}
          </tbody>
        </table>
        ${
          jumla
            ? `<div class="jumla">
                <div style="font-weight:600;margin-bottom:6px;">JUMLA</div>
                ${Object.entries(jumla)
                  .map(([k, v]) => `<div><strong>${k.replace(/_/g, ' ')}:</strong> ${v}</div>`)
                  .join('')}
              </div>`
            : ''
        }
        ${
          metadata
            ? `<div class="metadata">
                ${Object.entries(metadata)
                  .map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`)
                  .join('')}
              </div>`
            : ''
        }
        <div class="footer">Imezalishwa kiotomatiki kutoka Smart Hardware POS</div>
      </body>
    </html>
  `

  const w = window.open('', '_blank')
  if (!w) {
    console.error('Pop-up imezuiwa. Ruhusu pop-ups kupakua PDF.')
    return
  }
  w.document.write(html)
  w.document.close()
  setTimeout(() => {
    w.print()
    setTimeout(() => w.close(), 1000)
  }, 300)
}

// ============================================================
// Trigger download
// ============================================================
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

// ============================================================
// Pakua kulingana na format
// ============================================================
export function pakuaDocument(doc: Document) {
  if (!doc.snapshot) {
    console.error('Document haina snapshot — tafadhali itengeneze upya.')
    return
  }
  if (doc.format === 'csv') return downloadCsv(doc)
  if (doc.format === 'excel') return downloadExcel(doc)
  return downloadPdf(doc)
}