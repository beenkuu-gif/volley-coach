export function printTraining(training, { teamName, drillFull, totalBlockMin }) {
  const team = teamName(training.teamId ?? training.team_id);
  const date = training.date?.slice(0, 10) ?? '';
  const total = totalBlockMin(training.blocks ?? []);

  const blocksHtml = (training.blocks ?? []).map((block, i) => {
    const ids = block.drillIds ?? [];
    const drillsHtml = ids.map((id) => {
      const drill = drillFull(id);
      return `
        <div class="drill-row">
          <div class="drill-name">${drill ? drill.name : id}</div>
          ${drill?.description ? `<div class="drill-desc">${drill.description}</div>` : ''}
          ${drill?.tips ? `<div class="drill-tips"><strong>Wskazówki:</strong> ${drill.tips}</div>` : ''}
        </div>`;
    }).join('');

    return `
      <div class="block">
        <div class="block-header">
          <span class="block-name">${block.name || `Blok ${i + 1}`}</span>
          <span class="block-time">${block.durationMin} min</span>
        </div>
        ${drillsHtml || '<div class="no-drills">Brak ćwiczeń</div>'}
      </div>`;
  }).join('');

  const html = `<!DOCTYPE html><html lang="pl"><head>
<meta charset="UTF-8"><title>Plan treningu – ${team} – ${date}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, Arial, sans-serif; font-size: 13px; color: #111; padding: 28px 32px; }
  h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
  .meta { color: #555; font-size: 13px; margin-bottom: 24px; }
  .block { border: 1px solid #ddd; border-radius: 8px; margin-bottom: 14px; overflow: hidden; page-break-inside: avoid; }
  .block-header { display: flex; justify-content: space-between; align-items: center; background: #f3f4f6; padding: 10px 14px; }
  .block-name { font-weight: 700; font-size: 14px; }
  .block-time { font-size: 12px; color: #666; font-weight: 600; }
  .drill-row { padding: 9px 14px; border-top: 1px solid #eee; }
  .drill-name { font-weight: 600; font-size: 13px; margin-bottom: 2px; }
  .drill-desc { font-size: 12px; color: #444; margin-top: 3px; line-height: 1.45; }
  .drill-tips { font-size: 11px; color: #666; margin-top: 3px; font-style: italic; }
  .no-drills { padding: 8px 14px; color: #999; font-size: 12px; border-top: 1px solid #eee; }
  .footer { margin-top: 20px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
  @media print { body { padding: 16px 20px; } }
</style></head><body>
<h1>${team}</h1>
<div class="meta">${date}${training.venue ? ` &nbsp;·&nbsp; ${training.venue}` : ''} &nbsp;·&nbsp; łącznie <strong>${total} min</strong></div>
${blocksHtml}
<div class="footer">Wydrukowano z Volley Coach &nbsp;·&nbsp; ${new Date().toLocaleDateString('pl-PL')}</div>
</body></html>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
}
