(() => {
  'use strict';
  const panels = [...document.querySelectorAll('[data-progress]')];
  if (!panels.length) return;
  const endpoint = 'https://api.github.com/repos/AKKSYkardes/AKKSYkardes.github.io/issues/1';
  let snapshot, live = false, lastCheck, busy = false, checked = false;
  const english = () => document.documentElement.lang !== 'tr';
  const t = (tr, en) => english() ? en : tr;
  function parseIssue(issue) {
    if (issue.pull_request || typeof issue.body !== 'string') throw Error('Invalid issue');
    const match = issue.body.match(/<!-- jarvis-progress:start -->([\s\S]*?)<!-- jarvis-progress:end -->/);
    if (!match) throw Error('Missing checklist');
    const milestones = match[1].split('\n').filter(line => line.trim()).map(line => {
      const row = line.match(/^- \[([ xX])\] (.+?) \| (.+?)(?:\s*<!-- (active) -->)?\s*$/);
      if (!row) throw Error('Invalid milestone');
      return {tr: row[2], en: row[3], status: row[1] !== ' ' ? 'done' : row[4] ? 'active' : 'planned'};
    });
    return validate({updatedAt: issue.updated_at, milestones});
  }
  function validate(data) {
    if (!data || !Number.isFinite(Date.parse(data.updatedAt)) || !Array.isArray(data.milestones) || !data.milestones.length || data.milestones.length > 100) throw Error('Invalid data');
    if (data.milestones.some(m => !m || typeof m.tr !== 'string' || !m.tr.trim() || typeof m.en !== 'string' || !m.en.trim() || !['done','active','planned'].includes(m.status)) || data.milestones.filter(m => m.status === 'active').length > 1) throw Error('Invalid milestones');
    return data;
  }
  function element(tag, text, className) {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function render() {
    const locale = document.documentElement.lang;
    const format = date => new Date(date).toLocaleString(locale, {timeZone:'Europe/Istanbul',dateStyle:'medium',timeStyle:'short'});
    panels.forEach(panel => {
      const health = panel.querySelector('[data-progress-health]');
      if (!snapshot) {
        health.textContent = checked ? t('İlerleme verisi alınamadı. Güncel kayıt için GitHub bağlantısını aç.','Progress unavailable. Open the GitHub record for the current status.') : t('Güncel kayıt kontrol ediliyor…','Checking the current record…');
        return;
      }
      const {milestones} = snapshot;
      const done = milestones.filter(m => m.status === 'done').length;
      const current = milestones.find(m => m.status === 'active');
      const summary = element('div', undefined, 'progress-summary');
      summary.append(element('strong', `${done} ${t('aşama uygulandı','milestones implemented')}`),element('span',`${milestones.filter(m=>m.status==='active').length} ${t('aktif','active')}`),element('span',`${milestones.filter(m=>m.status==='planned').length} ${t('sonraki hedef','future goals')}`));
      const bar = element('div',undefined,'milestone-map');
      bar.setAttribute('role','img');
      bar.setAttribute('aria-label',t('Numaralı aşama haritası. Ayrıntılar aşağıdaki listede.','Numbered milestone map. Details are listed below.'));
      milestones.forEach((m,i) => {const segment=element('span',String(i+1).padStart(2,'0'),m.status); segment.setAttribute('aria-hidden','true');bar.append(segment);});
      const active = element('p',current ? t('Şimdi: ','Now: ')+current[english()?'en':'tr'] : t('Aktif aşama belirtilmedi.','No active milestone specified.'),'progress-active');
      const legend = element('p',t('Mavi: uygulandı · Sarı: aktif çalışma · Gri: sonraki hedef','Blue: implemented · Yellow: active work · Grey: future goal'),'progress-legend');
      const list = element('ol',undefined,'progress-list');
      milestones.forEach(m => {
        const li = element('li'); li.dataset.state=m.status;
        li.append(element('span',m[english()?'en':'tr']),element('small',m.status==='done'?t('Uygulandı','Implemented'):m.status==='active'?t('Aktif','Active'):t('Hedef','Goal')));
        list.append(li);
      });
      panel.querySelector('[data-progress-content]').replaceChildren(active,summary,bar,legend,list);
      health.textContent = (!checked ? t('Güncel kayıt kontrol ediliyor… ','Checking the current record… ') : live ? t('GitHub ile eşitlendi. ','Synced with GitHub. ') : t('Canlı kaynağa erişilemiyor; son kayıt gösteriliyor. ','Live source unavailable; showing the last snapshot. ')) + t('Kayıt güncellemesi: ','Record updated: ')+format(snapshot.updatedAt)+' (İstanbul)'+(live && lastCheck ? ' · '+t('Son kontrol: ','Last checked: ')+format(lastCheck):'');
    });
  }
  async function json(url) {
    const response = await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(10000),headers:{Accept:'application/json'}});
    if (!response.ok) throw Error('Fetch failed');
    return response.json();
  }
  async function refresh() {
    if (busy || document.hidden) return;
    busy=true;
    try {
      snapshot=parseIssue(await json(endpoint)); live=true; lastCheck=new Date().toISOString();
      try {localStorage.setItem('jarvis-public-progress-v1',JSON.stringify(snapshot));} catch (_) {}
    } catch (_) {live=false;}
    finally {busy=false;checked=true;render();}
  }
  document.addEventListener('localechange',render);
  document.addEventListener('visibilitychange',() => {if (!document.hidden) refresh();});
  (async () => {
    let cached;
    try {cached=validate(JSON.parse(localStorage.getItem('jarvis-public-progress-v1')));} catch (_) {}
    try {
      const bundled=validate(await json('progress.json'));
      snapshot=cached && Date.parse(cached.updatedAt)>Date.parse(bundled.updatedAt)?cached:bundled;
    } catch (_) {snapshot=cached;}
    render();
    await refresh();
    setInterval(refresh,60000);
  })();
})();
