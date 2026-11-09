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
  if (typeof module !== 'undefined') module.exports = {dueDate, parseDate};
  if (typeof document === 'undefined') return;
  const root = document.getElementById('maintenance');
  if (!root) return;
  const catalog = window.VolknerMaintenanceCatalog;
  function el(tag, text, parent, cls) {
    const e = document.createElement(tag); if (text) e.textContent = text;
    if (cls) e.className = cls; if (parent) parent.appendChild(e); return e;
  }
  root.className = 'maintenance-shell';
  el('small','VOLKNER UX · WARTUNG UND SERVICE',root);
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
      el('span',item.status==='pending'?'Intervall offen':'Quelle geprüft · Fahrzeugzuordnung offen',card,'maintenance-badge');
      el('h2',item.title,card); el('p',item.equipment,card);
      el('strong',item.trigger,card); el('p',item.note,card);
      if(item.source) el('p','Quelle: '+item.source,card,'maintenance-source');
      if(item.interval) {
        const label=el('label','Vorschau: Datum der letzten Durchführung ',card);
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
      }
    });
  }
  select.addEventListener('change',render); render();
})();
