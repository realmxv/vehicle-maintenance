(function () {
  'use strict';
  function parseDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
    const d = new Date(value + 'T12:00:00Z');
    return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value ? d : null;
  }
  function dueDate(value, interval) {
    const d = parseDate(value);
    if (!d || !interval) return null;
    if (Number.isInteger(interval.days) && interval.days > 0) d.setUTCDate(d.getUTCDate() + interval.days);
    else if (Number.isInteger(interval.months) && interval.months > 0) {
      const day = d.getUTCDate();
      d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + interval.months);
      const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth()+1, 0)).getUTCDate();
      d.setUTCDate(Math.min(day, last));
    } else return null;
    return d.toISOString().slice(0, 10);
  }
  function assetUrl(value) {
    if (typeof value !== 'string') return null;
    if (/^assets\/[A-Za-z0-9_./-]+$/.test(value) && !value.split('/').includes('..')) return value;
    try {const u=new URL(value); return u.protocol==='https:' && !u.username && !u.password ? u.href : null;} catch {return null;}
  }
  function intervalText(interval) {
    if (!interval) return 'Intervall noch nicht freigegeben';
    if (interval.days) return 'Alle '+interval.days+' Tage';
    if (interval.months) return 'Alle '+interval.months+' Kalendermonate';
    if (interval.operatingHours) return 'Alle '+interval.operatingHours+' Betriebsstunden';
    if (interval.distanceKm) return 'Alle '+interval.distanceKm+' km';
    return interval.event || 'Intervall unbekannt';
  }
  if (typeof module !== 'undefined') module.exports = {dueDate, parseDate, assetUrl, intervalText};
  if (typeof document === 'undefined') return;
  const root = document.getElementById('maintenance');
  if (!root) return;
  const catalog = window.VehicleMaintenanceCatalog;
  function el(tag, text, parent, cls) {
    const e = document.createElement(tag); if (text) e.textContent = text;
    if (cls) e.className = cls; if (parent) parent.appendChild(e); return e;
  }
  root.className = 'maintenance-shell';
  el('small','FAHRZEUG UX · WARTUNG UND SERVICE',root);
  el('h1','Alles im Blick. Auch die Wartung.',root);
  el('p','Katalogvorschau · Noch kein Fahrzeug zugeordnet. Wartungsnachweise und Gerätebestand sind nicht angebunden.',root,'maintenance-notice');
  if (!catalog || !Array.isArray(catalog.items)) {el('p','Wartungskatalog nicht verfügbar. Kein Wartungsstatus bestimmbar.',root); return;}
  el('p','Katalog '+catalog.version+' · Quellenstand '+catalog.updated,root);
  const label=el('label','Bereich ',root), select=el('select',null,label);
  select.setAttribute('aria-label','Wartungsbereich');
  const all=el('option','Alle Bereiche',select); all.value='';
  catalog.categories.forEach(c=>{const o=el('option',c.title,select);o.value=c.id;});
  const list=el('div',null,root,'maintenance-grid');
  function render() {
    list.replaceChildren();
    catalog.items.filter(i=>!select.value || i.category===select.value).forEach(item=>{
      const card=el('article',null,list,'maintenance-card');
      el('span',item.status==='pending'?'Intervall offen':item.status==='policy_approved'?'Servicevorgabe · Fahrzeugzuordnung offen':'Quelle geprüft · Fahrzeugzuordnung offen',card,'maintenance-badge');
      el('h2',item.title,card); el('p',item.equipment,card);
      el('strong',intervalText(item.interval),card); el('p',item.trigger,card);
      if (item.updatedAt) el('p','Eintrag aktualisiert: '+item.updatedAt,card,'maintenance-source');
      const instructions=item.instructions || {summary:item.note};
      el('p',instructions.summary,card);
      if(instructions.steps && instructions.steps.length) {const ol=el('ol',null,card);instructions.steps.forEach(step=>el('li',step,ol));}
      if(instructions.warnings && instructions.warnings.length) {const warnings=el('div',null,card,'maintenance-notice');instructions.warnings.forEach(w=>el('p',w,warnings));}
      (item.documents || []).forEach(doc=>{
        const p=el('p',null,card,'maintenance-document'); const url=assetUrl(doc.url);
        if (url) {const a=el('a',doc.title,p);a.href=url;a.target='_blank';a.rel='noopener noreferrer';}
        else el('span',doc.title+' · Datei noch nicht verknüpft',p);
        const refs=[doc.documentNumber,doc.issueDate?'Ausgabe '+doc.issueDate:null,doc.page?'Seite '+doc.page:null].filter(Boolean);
        if(refs.length) el('small',' · '+refs.join(' · '),p);
      });
      (item.images || []).forEach(pic=>{
        const url=assetUrl(pic.url);if(!url)return;
        const fig=el('figure',null,card),img=el('img',null,fig);img.alt=pic.alt||pic.caption||'';img.loading='lazy';img.style.maxWidth='100%';img.src=url;
        el('figcaption',pic.caption+(pic.date?' · '+pic.date:''),fig);
        img.addEventListener('error',()=>{img.hidden=true;el('p','Bild nicht verfügbar: '+(pic.caption||''),fig);});
      });
      if(item.source) el('p','Quelle: '+item.source,card,'maintenance-source');
      if(item.interval && (item.interval.days || item.interval.months)) {
        const label=el('label',item.type==='replacement'?'Vorschau: Einbau bzw. letzter vollständiger Austausch ':'Vorschau: Datum der letzten Durchführung ',card);
        const input=el('input',null,label); input.type='date';
        input.setAttribute('aria-label','Letzte Durchführung: '+item.title);
        const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin'}).format(new Date());
        input.max=today;
        const out=el('p','Kein Ausgangsdatum – Fälligkeit unbekannt.',card);
        out.setAttribute('role','status');
        input.addEventListener('input',()=>{
          const due=dueDate(input.value,item.interval);
          if (!due || input.value>today) {out.textContent='Gültiges Datum bis heute erforderlich – Fälligkeit unbekannt.';return;}
          const state=due<today?'überfällig':due===today?'heute fällig':'noch nicht fällig';
          out.textContent='Rechnerisch '+state+' · '+due.split('-').reverse().join('.')+' · Vorschau, nicht gespeichert.';
        });
      } else if(item.interval) el('p','Fälligkeit noch unbekannt – Ereignis oder Zählerstand erforderlich.',card);
    });
  }
  select.addEventListener('change',render); render();
})();
