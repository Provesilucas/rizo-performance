/* ==========================================================================
   RIZO Performance — interatividade do handoff (JS puro, sem dependências)
   Replica as funcionalidades do app: tema, Evolução da Meta (filtro/navegação/
   comparação), metas editáveis, comparativo de receita e filtros de tabela.
   Dados injetados por página em window.GOAL / window.REVENUE.
========================================================================== */
(function () {
  'use strict';

  // ---------------------------------------------------------------- helpers
  var BRL = new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
  });
  function money(v) { return BRL.format(v); }
  function compact(v) {
    var a = Math.abs(v);
    if (a >= 1e6) return 'R$ ' + (v / 1e6).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' mi';
    if (a >= 1e3) return 'R$ ' + Math.round(v / 1e3).toLocaleString('pt-BR') + ' mil';
    return BRL.format(v);
  }
  function axis(v) {
    var a = Math.abs(v);
    if (a >= 1e6) return (v / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mi';
    if (a >= 1e3) return Math.round(v / 1e3).toLocaleString('pt-BR') + ' mil';
    return String(Math.round(v));
  }
  function pct(v) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%'; }
  function el(id) { return document.getElementById(id); }
  function cssv(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  // ---------------------------------------------------------------- tema
  function initTheme() {
    var saved = localStorage.getItem('rizoTheme');
    if (saved === 'dark') document.documentElement.classList.add('dark');
    var btn = el('theme-toggle');
    if (!btn) return;
    function sync() { btn.textContent = document.documentElement.classList.contains('dark') ? '☀' : '☾'; }
    sync();
    btn.addEventListener('click', function () {
      var on = document.documentElement.classList.toggle('dark');
      localStorage.setItem('rizoTheme', on ? 'dark' : 'light');
      sync();
      if (window.__redraw) window.__redraw();
    });
  }

  // ---------------------------------------------------------------- SVG util
  function svgLine(pts, stroke, w, dash) {
    if (!pts.length) return '';
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    return '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="' + w + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
  }

  // ---------------------------------------------------------------- Evolução da Meta
  var goal = { range: 'month', idx: {}, compare: false, perYear: { month: 12, quarter: 4, semester: 2, year: 1 } };

  function goalCurrentIdx(list) {
    for (var i = 0; i < list.length; i++) if (list[i].isCurrent) return i;
    return list.length - 1;
  }

  function drawGoalChart(inst, cmp) {
    var W = 960, H = 300, L = 56, R = 14, T = 16, B = 30;
    var s = inst.series, n = s.length;
    var max = 0;
    s.forEach(function (p) { max = Math.max(max, p.t || 0, p.r || 0, p.p || 0); });
    if (cmp) cmp.series.forEach(function (p) { max = Math.max(max, p.r || 0); });
    max = max * 1.08 || 1;
    var pw = W - L - R, ph = H - T - B;
    function X(i) { return L + (n === 1 ? 0 : (i / (n - 1)) * pw); }
    function Y(v) { return T + (1 - v / max) * ph; }

    var grid = '', ylab = '';
    for (var g = 0; g <= 4; g++) {
      var yy = T + (g / 4) * ph, val = max * (1 - g / 4);
      grid += '<line x1="' + L + '" y1="' + yy.toFixed(0) + '" x2="' + (W - R) + '" y2="' + yy.toFixed(0) + '" stroke="var(--border)" stroke-dasharray="3 3"/>';
      ylab += '<text x="' + (L - 8) + '" y="' + (yy + 4).toFixed(0) + '" text-anchor="end" fill="var(--muted-fg)" font-size="12">' + axis(val) + '</text>';
    }

    var targetPts = s.map(function (p, i) { return [X(i), Y(p.t)]; });
    var realPts = [], projPts = [], cmpPts = [];
    s.forEach(function (p, i) {
      if (p.r != null) realPts.push([X(i), Y(p.r)]);
      if (p.p != null) projPts.push([X(i), Y(p.p)]);
    });
    if (cmp) cmp.series.forEach(function (p, i) { if (p.r != null && i < n) cmpPts.push([X(i), Y(p.r)]); });

    // área sob realizado
    var area = '';
    if (realPts.length > 1) {
      var d = 'M' + realPts[0][0].toFixed(1) + ' ' + realPts[0][1].toFixed(1);
      realPts.forEach(function (p, i) { if (i) d += ' L' + p[0].toFixed(1) + ' ' + p[1].toFixed(1); });
      d += ' L' + realPts[realPts.length - 1][0].toFixed(1) + ' ' + Y(0).toFixed(1) + ' L' + realPts[0][0].toFixed(1) + ' ' + Y(0).toFixed(1) + ' Z';
      area = '<path d="' + d + '" fill="var(--chart-1)" opacity="0.12"/>';
    }

    // linha "hoje"
    var today = '';
    var lastReal = -1;
    s.forEach(function (p, i) { if (p.r != null) lastReal = i; });
    if (lastReal >= 0 && lastReal < n - 1) {
      var tx = X(lastReal);
      today = '<line x1="' + tx.toFixed(0) + '" y1="' + T + '" x2="' + tx.toFixed(0) + '" y2="' + (T + ph) + '" stroke="var(--muted-fg)" stroke-dasharray="4 4" opacity="0.5"/>';
    }

    // rótulos X
    var xlab = '', every = n > 15 ? Math.ceil(n / 7) : 1;
    s.forEach(function (p, i) {
      if (i % every === 0 || i === n - 1) xlab += '<text x="' + X(i).toFixed(0) + '" y="' + (H - 8) + '" text-anchor="middle" fill="var(--muted-fg)" font-size="12">' + p.x + '</text>';
    });

    var c1 = cssv('--chart-1'), c2 = cssv('--chart-2'), c5 = cssv('--chart-5');
    return grid + ylab + today + area
      + svgLine(targetPts, c5, 2, '6 5')
      + (cmp ? svgLine(cmpPts, cssv('--warning'), 2, '') : '')
      + svgLine(realPts, c1, 2.5, '')
      + svgLine(projPts, c2, 2, '2 5')
      + xlab;
  }

  function renderGoal() {
    if (!window.GOAL) return;
    var list = window.GOAL[goal.range];
    if (goal.idx[goal.range] == null) goal.idx[goal.range] = goalCurrentIdx(list);
    var i = goal.idx[goal.range], inst = list[i];
    var per = goal.perYear[goal.range];
    var cmpInst = (i - per >= 0) ? list[i - per] : null;
    var showCmp = goal.compare && cmpInst;
    var sum = inst.sum;

    el('goal-chart').innerHTML = drawGoalChart(inst, showCmp ? cmpInst : null);
    el('goal-label').textContent = inst.label;
    el('goal-status').textContent = sum.status === 'above' ? 'Acima do esperado' : sum.status === 'below' ? 'Abaixo do esperado' : 'Dentro do esperado';
    el('goal-status').className = 'badge ' + (sum.status === 'above' ? 'success' : sum.status === 'below' ? 'danger' : 'warn');
    el('goal-state').textContent = inst.isCurrent ? 'Em andamento' : (sum.expectedPct >= 100 ? 'Encerrado' : 'Futuro');
    el('goal-msg').textContent = sum.message;
    el('gs-target-label').textContent = inst.targetLabel;
    el('gs-target').textContent = compact(sum.target);
    el('gs-real').textContent = compact(sum.realized);
    el('gs-proj').textContent = compact(sum.projection);
    el('gs-pace').textContent = (sum.pace > 0 ? '+' : '') + pct(sum.pace);
    el('gs-realpct').textContent = 'Realizado ' + pct(sum.realizedPct);
    el('gs-exppct').textContent = 'Ritmo esperado ' + pct(sum.expectedPct);
    var bar = el('gs-bar');
    bar.style.width = Math.min(sum.realizedPct, 100) + '%';
    bar.className = 'bar-fill' + (sum.status === 'above' ? ' ok' : sum.status === 'below' ? ' danger' : '');
    el('gs-marker').style.left = Math.min(sum.expectedPct, 100) + '%';

    // navegação
    el('goal-prev').disabled = i === 0;
    el('goal-next').disabled = i === list.length - 1;
    // comparar
    var cb = el('goal-compare');
    if (cmpInst) { cb.style.display = ''; cb.textContent = '⇄ Comparar ' + cmpInst.label; cb.classList.toggle('primary', goal.compare); }
    else { cb.style.display = 'none'; goal.compare = false; }
    var cl = el('goal-cmp-legend');
    if (cl) cl.style.display = showCmp ? '' : 'none';
    // abas
    document.querySelectorAll('#goal-tabs [data-range]').forEach(function (t) {
      t.classList.toggle('on', t.getAttribute('data-range') === goal.range);
    });
  }

  function initGoal() {
    if (!el('goal-chart')) return;
    document.querySelectorAll('#goal-tabs [data-range]').forEach(function (t) {
      t.addEventListener('click', function () { goal.range = t.getAttribute('data-range'); renderGoal(); });
    });
    el('goal-prev').addEventListener('click', function () { goal.idx[goal.range] = Math.max(0, goal.idx[goal.range] - 1); renderGoal(); });
    el('goal-next').addEventListener('click', function () { var l = window.GOAL[goal.range]; goal.idx[goal.range] = Math.min(l.length - 1, goal.idx[goal.range] + 1); renderGoal(); });
    el('goal-compare').addEventListener('click', function () { goal.compare = !goal.compare; renderGoal(); });
    renderGoal();
  }

  // ---------------------------------------------------------------- Receita
  var revCompare = false;
  function drawRevenue() {
    if (!el('rev-chart') || !window.REVENUE) return;
    var data = window.REVENUE, W = 960, H = 280, L = 52, R = 12, T = 20, B = 34;
    var max = 0;
    data.forEach(function (d) { max = Math.max(max, d.received, d.forecast, revCompare ? d.prev : 0); });
    max = max * 1.1 || 1;
    var pw = W - L - R, ph = H - T - B, step = pw / data.length;
    function Y(v) { return T + (1 - v / max) * ph; }
    var grid = '', ylab = '';
    for (var g = 0; g <= 3; g++) { var yy = T + (g / 3) * ph, val = max * (1 - g / 3); grid += '<line x1="' + L + '" y1="' + yy.toFixed(0) + '" x2="' + (W - R) + '" y2="' + yy.toFixed(0) + '" stroke="var(--border)" stroke-dasharray="3 3"/>'; ylab += '<text x="' + (L - 8) + '" y="' + (yy + 4).toFixed(0) + '" text-anchor="end" fill="var(--muted-fg)" font-size="12">' + axis(val) + '</text>'; }
    var bars = '', xlab = '', fpts = [], ppts = [];
    data.forEach(function (d, i) {
      var cx = L + i * step + step / 2, bw = step * 0.5, bh = (d.received / max) * ph, by = Y(d.received);
      bars += '<rect x="' + (cx - bw / 2).toFixed(0) + '" y="' + by.toFixed(0) + '" width="' + bw.toFixed(0) + '" height="' + bh.toFixed(0) + '" rx="6" fill="var(--chart-1)"/>';
      fpts.push([cx, Y(d.forecast)]);
      ppts.push([cx, Y(d.prev)]);
      xlab += '<text x="' + cx.toFixed(0) + '" y="' + (H - 10) + '" text-anchor="middle" fill="var(--muted-fg)" font-size="12">' + d.label + '</text>';
    });
    el('rev-chart').innerHTML = grid + ylab + bars
      + svgLine(fpts, '#c9a24a', 2, '5 4')
      + (revCompare ? svgLine(ppts, cssv('--chart-2'), 2, '') : '')
      + xlab;
    var lg = el('rev-cmp-legend'); if (lg) lg.style.display = revCompare ? '' : 'none';
  }
  function initRevenue() {
    var b = el('rev-compare'); if (!b) return;
    b.addEventListener('click', function () { revCompare = !revCompare; b.classList.toggle('primary', revCompare); drawRevenue(); });
    drawRevenue();
  }

  // ---------------------------------------------------------------- Metas editáveis
  function initMetas() {
    var store = JSON.parse(localStorage.getItem('rizoGoals') || '{}');
    document.querySelectorAll('[data-meta]').forEach(function (row) {
      var id = row.getAttribute('data-meta');
      var closed = +row.getAttribute('data-closed');
      var def = +row.getAttribute('data-goal');
      var goalVal = store[id] != null ? store[id] : def;
      var valEl = row.querySelector('.meta-value');
      var barEl = row.querySelector('.meta-bar');
      var pctEl = row.querySelector('.meta-pct');
      function paint() {
        var p = goalVal > 0 ? (closed / goalVal) * 100 : 0;
        valEl.textContent = money(goalVal);
        barEl.style.width = Math.min(p, 100) + '%';
        barEl.className = 'bar-fill' + (p >= 100 ? ' ok' : '');
        pctEl.textContent = Math.round(p) + '% da meta';
        pctEl.style.color = p >= 100 ? 'var(--success)' : 'var(--muted-fg)';
      }
      paint();
      var btn = row.querySelector('.meta-edit');
      btn.addEventListener('click', function () {
        var cur = document.createElement('div');
        cur.style.cssText = 'display:flex;gap:6px;align-items:center';
        cur.innerHTML = '<input class="input" type="number" step="1000" value="' + goalVal + '" style="width:120px;height:32px"/><button class="btn primary sm">Salvar</button>';
        btn.replaceWith(cur);
        var inp = cur.querySelector('input');
        inp.focus();
        function save() {
          goalVal = Math.max(0, Math.round(+inp.value || 0));
          store[id] = goalVal; localStorage.setItem('rizoGoals', JSON.stringify(store));
          cur.replaceWith(btn); paint();
        }
        cur.querySelector('button').addEventListener('click', save);
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') save(); });
      });
    });
  }

  // ---------------------------------------------------------------- Tabelas (filtro + busca)
  function initTables() {
    document.querySelectorAll('[data-table]').forEach(function (wrap) {
      var rows = wrap.querySelectorAll('tbody tr');
      var search = wrap.querySelector('[data-search]');
      var active = 'all';
      function apply() {
        var q = search ? search.value.trim().toLowerCase() : '';
        rows.forEach(function (r) {
          var okS = active === 'all' || r.getAttribute('data-status') === active;
          var okQ = !q || r.textContent.toLowerCase().indexOf(q) >= 0;
          r.style.display = okS && okQ ? '' : 'none';
        });
      }
      wrap.querySelectorAll('[data-filter]').forEach(function (t) {
        t.addEventListener('click', function () {
          active = t.getAttribute('data-filter');
          wrap.querySelectorAll('[data-filter]').forEach(function (x) { x.classList.toggle('on', x === t); });
          apply();
        });
      });
      if (search) search.addEventListener('input', apply);
    });
  }

  // ---------------------------------------------------------------- dropdown período
  function initPeriod() {
    document.querySelectorAll('[data-dropdown]').forEach(function (dd) {
      var btn = dd.querySelector('[data-dd-btn]');
      var menu = dd.querySelector('[data-dd-menu]');
      if (!btn || !menu) return;
      btn.addEventListener('click', function (e) { e.stopPropagation(); menu.style.display = menu.style.display === 'block' ? 'none' : 'block'; });
      menu.querySelectorAll('[data-dd-item]').forEach(function (it) {
        it.addEventListener('click', function () { btn.firstChild.textContent = it.textContent + ' '; menu.style.display = 'none'; });
      });
      document.addEventListener('click', function () { menu.style.display = 'none'; });
    });
  }

  // ---------------------------------------------------------------- boot
  window.__redraw = function () { renderGoal(); drawRevenue(); };
  document.addEventListener('DOMContentLoaded', function () {
    initTheme(); initGoal(); initRevenue(); initMetas(); initTables(); initPeriod();
  });
})();
