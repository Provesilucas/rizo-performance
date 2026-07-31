#!/usr/bin/env python3
"""
Gera o handoff estático (HTML) de todas as telas do RIZO Performance.
Casca compartilhada (sidebar + topbar) + conteúdo por página.
Rode:  python3 handoff/_build.py   (a partir da raiz do projeto)
"""
import os

import os
import json
import calendar
import datetime

OUT = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(OUT, "assets", "rizo.css"), encoding="utf-8") as _f:
    CSS = _f.read()
with open(os.path.join(OUT, "assets", "rizo.js"), encoding="utf-8") as _f:
    JS = _f.read()

# ================================================================ DADOS (JS)
MT = 1_500_000
CLOSED_2026 = [1_420_000, 1_380_000, 1_550_000, 1_610_000, 1_660_000, 1_720_000]
CLOSED_2025 = [1_300_000, 1_250_000, 1_400_000, 1_450_000, 1_500_000, 1_550_000,
               1_600_000, 1_580_000, 1_620_000, 1_680_000, 1_720_000, 1_800_000]
JUL_REAL, JUL_PROJ, CUR_DAY = 535_000, 1_658_000, 10
MSHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
MFULL = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
         "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
REF = datetime.date(2026, 7, 11)


def _realized_month(year, m):
    if year == 2025:
        return CLOSED_2025[m]
    if m < 6:
        return CLOSED_2026[m]
    if m == 6:
        return JUL_REAL
    return None


def _summary(target, realized, elapsed):
    rp = realized / target * 100 if target else 0
    pace = rp - elapsed
    proj = round(realized / (elapsed / 100)) if elapsed > 0 else target
    status = "above" if pace > 3 else "below" if pace < -3 else "on-track"
    a = "{:.1f}".format(abs(pace)).replace(".", ",")
    if status == "above":
        msg = "Acima do esperado — " + a + " p.p. à frente do ritmo ideal."
    elif status == "below":
        msg = "Abaixo do esperado — " + a + " p.p. atrás do ritmo ideal."
    else:
        msg = "Dentro do esperado — ritmo alinhado à meta do período."
    return {"target": target, "realized": realized, "projection": proj,
            "realizedPct": round(rp, 1), "expectedPct": round(elapsed, 1),
            "pace": round(pace, 1), "status": status, "message": msg}


def _month_inst(year, m):
    days = calendar.monthrange(year, m + 1)[1]
    is_cur = year == 2026 and m == 6
    is_past = year < 2026 or (year == 2026 and m < 6)
    if is_cur:
        cur, rt, pt, el_ = CUR_DAY, JUL_REAL, JUL_PROJ, round(CUR_DAY / days * 100, 1)
    elif is_past:
        cur = days; rt = _realized_month(year, m) or 0; pt = rt; el_ = 100
    else:
        cur, rt, pt, el_ = 0, 0, MT, 0
    series = []
    for d in range(1, days + 1):
        t = round(MT / days * d)
        r = p = None
        if cur > 0 and d <= cur:
            r = round(rt * d / cur)
            if d == cur:
                p = r
        elif d > cur:
            denom = days - cur
            p = round(rt + (pt - rt) * ((d - cur) / denom)) if denom > 0 else pt
        series.append({"x": "%02d" % d, "t": t, "r": r, "p": p})
    return {"label": "%s %d" % (MFULL[m], year), "isCurrent": is_cur,
            "targetLabel": "Meta do mês", "series": series,
            "sum": _summary(MT, rt, el_)}


def _elapsed(year, m0, m1):
    start = datetime.date(year, m0 + 1, 1)
    end = datetime.date(year + 1, 1, 1) if m1 == 11 else datetime.date(year, m1 + 2, 1)
    p = (REF - start).days / (end - start).days * 100
    return round(max(0, min(100, p)), 1)


def _multi_inst(year, months, label, target_label):
    mreal = [_realized_month(year, mm) for mm in months]
    rt = sum(x or 0 for x in mreal)
    tgt = MT * len(months)
    el_ = _elapsed(year, months[0], months[-1])
    summ = _summary(tgt, rt, el_)
    pt = summ["projection"] if el_ > 0 else tgt
    last = -1
    for i, v in enumerate(mreal):
        if v is not None:
            last = i
    r_at_last = sum(mreal[k] or 0 for k in range(last + 1))
    remaining = len(months) - 1 - last
    step = (pt - r_at_last) / remaining if remaining > 0 else 0
    series, tacc, racc = [], 0, 0
    for i, mm in enumerate(months):
        tacc += MT
        r = p = None
        if i <= last and mreal[i] is not None:
            racc += mreal[i]; r = round(racc)
            if i == last:
                p = r
        elif i > last:
            p = round(r_at_last + step * (i - last))
        series.append({"x": MSHORT[mm], "t": round(tacc), "r": r, "p": p})
    return {"label": label, "isCurrent": 0 < el_ < 100, "targetLabel": target_label,
            "series": series, "sum": summ}


YEARS = [2025, 2026]
QUARTERS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]]
SEMS = [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11]]
GOAL = {
    "month": [_month_inst(y, m) for y in YEARS for m in range(12)],
    "quarter": [_multi_inst(y, q, "%dº trimestre %d" % (i + 1, y), "Meta do trimestre")
                for y in YEARS for i, q in enumerate(QUARTERS)],
    "semester": [_multi_inst(y, s, "%dº semestre %d" % (i + 1, y), "Meta do semestre")
                 for y in YEARS for i, s in enumerate(SEMS)],
    "year": [_multi_inst(y, list(range(12)), str(y), "Meta do ano") for y in YEARS],
}
REVENUE = [
    {"label": "Fev", "received": 780000, "forecast": 820000, "prev": 640000},
    {"label": "Mar", "received": 910000, "forecast": 900000, "prev": 720000},
    {"label": "Abr", "received": 1020000, "forecast": 1050000, "prev": 810000},
    {"label": "Mai", "received": 1140000, "forecast": 1120000, "prev": 950000},
    {"label": "Jun", "received": 1310000, "forecast": 1280000, "prev": 1060000},
    {"label": "Jul", "received": 1240000, "forecast": 1658000, "prev": 1120000},
]

# ---------------------------------------------------------------- ícones (nav)
IC = {
    "dash": '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
    "target": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1"/>',
    "line": '<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/>',
    "video": '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8l-6 4 6 4V8z"/>',
    "file": '<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/>',
    "card": '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    "users": '<circle cx="9" cy="8" r="3"/><path d="M2 21a7 7 0 0114 0"/><circle cx="18" cy="9" r="2"/>',
    "building": '<path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/>',
    "star": '<path d="M12 3l2 5 5 .5-4 3.5 1.5 5L12 14l-4.5 3 1.5-5-4-3.5 5-.5z"/>',
    "gear": '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1l2-1.5-2-3.4-2.3.9a7 7 0 00-1.7-1L16 3H8l-.9 2.5a7 7 0 00-1.7 1l-2.3-.9-2 3.4L3.1 11a7 7 0 000 2l-2 1.5 2 3.4 2.3-.9a7 7 0 001.7 1L8 21h8l.9-2.5a7 7 0 001.7-1l2.3.9 2-3.4-2-1.5c.1-.3.1-.6.1-1z"/>',
    "cal": '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>',
    "wallet": '<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M16 12h.01M2 10h20"/>',
    "crown": '<path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10z"/><path d="M5 20h14"/>',
    "filter": '<path d="M3 4h18l-7 8v6l-4 2v-8z"/>',
    "trend": '<path d="M3 17l6-6 4 4 7-8"/><path d="M17 7h4v4"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "alert": '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    "check": '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    "gauge": '<path d="M12 13l4-4"/><path d="M4 18a8 8 0 1116 0"/>',
    "receipt": '<path d="M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1V3l-2 1-2-1-2 1-2-1-2 1z"/>',
    "megaphone": '<path d="M3 11v2l12 4V7z"/><path d="M15 8a4 4 0 010 8"/>',
    "hand": '<path d="M4 12a8 8 0 1116 0"/><path d="M8 12v-2M12 12V9M16 12v-2"/>',
    "download": '<path d="M12 3v12m0 0l-4-4m4 4l4-4"/><path d="M4 21h16"/>',
    "scale": '<path d="M12 3v18M4 21h16M6 7h12"/><path d="M6 7l-3 6h6zM18 7l-3 6h6z"/>',
    "user": '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
    "palette": '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="8" r="1"/><circle cx="16" cy="11" r="1"/>',
    "db": '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14a8 3 0 0016 0V5"/>',
    "send": '<path d="M4 11l16-7-7 16-2-6z"/>',
    "flag": '<path d="M5 21V4h11l-2 4 2 4H5"/>',
    "sparkle": '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
}

NAV = [
    ("Principal", [
        ("Visão Geral", "index.html", "dash"),
        ("Comercial", "comercial.html", "target"),
        ("Financeiro", "financeiro.html", "line"),
    ]),
    ("Operação", [
        ("Produção", "producao.html", "video"),
        ("Contratos", "contratos.html", "file"),
        ("Recebimentos", "recebimentos.html", "card"),
        ("Influenciadores", "influenciadores.html", "users"),
        ("Marcas", "marcas.html", "building"),
    ]),
    ("Insights", [
        ("Relatórios", "relatorios.html", "star"),
        ("Configurações", "configuracoes.html", "gear"),
    ]),
]


def icon(name, cls=""):
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{IC[name]}</svg>')


def sidebar(active):
    groups = ""
    for label, items in NAV:
        lis = ""
        for title, href, ic in items:
            cls = "nav-item active" if href == active else "nav-item"
            lis += f'<a class="{cls}" href="{href}">{icon(ic)}{title}</a>'
        groups += f'<div class="nav-group"><p>{label}</p>{lis}</div>'
    return f'''<aside class="sidebar">
  <a class="logo" href="index.html" style="text-decoration:none;color:inherit">
    <svg viewBox="0 0 48 48" aria-label="RIZO"><g fill="currentColor" font-family="Unbounded, sans-serif" font-weight="700" font-size="19" text-anchor="middle"><text x="13" y="21">R</text><text x="36" y="21">I</text><text x="13" y="45">Z</text><text x="36" y="45">O</text></g></svg>
    <div class="wm"><b>RIZO</b><span>Performance</span></div>
  </a>
  <nav>{groups}</nav>
  <div class="sidebar-foot"><span class="dot"></span><div style="line-height:1.2"><div style="font-size:12px;font-weight:500">Dados simulados</div><div style="font-size:11px;color:var(--muted-fg)">Ambiente demo</div></div></div>
</aside>'''


def topbar(title, sub):
    return f'''<header class="topbar"><div class="topbar-inner">
  <div><h1 class="page-title">{title}<span class="live"><span class="pulse"></span>Ao vivo</span></h1><p class="page-sub">{sub}</p></div>
  <div class="spacer"></div>
  <span data-dropdown style="position:relative"><button class="btn" data-dd-btn><span>Este mês </span>▾</button>
    <div data-dd-menu style="display:none;position:absolute;right:0;top:42px;z-index:20;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:6px;min-width:150px;box-shadow:0 10px 30px -10px rgba(0,0,0,.15)">
      <div data-dd-item class="nav-item" style="padding:6px 10px">Este mês</div><div data-dd-item class="nav-item" style="padding:6px 10px">Mês anterior</div><div data-dd-item class="nav-item" style="padding:6px 10px">Trimestre</div><div data-dd-item class="nav-item" style="padding:6px 10px">Ano</div></div></span>
  <button class="btn">Filtros</button>
  <button class="btn icon" title="Atualizar">⟳</button>
  <button class="btn icon" id="theme-toggle" title="Alternar tema">☾</button>
  <button class="btn" style="gap:8px;padding-left:6px"><span class="avatar">LP</span> Lucas Provesi</button>
</div></header>'''


def page(active, title, sub, main, data=None):
    datajs = ""
    if data:
        parts = "".join(
            "window.%s=%s;" % (k, json.dumps(v, ensure_ascii=False)) for k, v in data.items()
        )
        datajs = "<script>%s</script>" % parts
    return f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>{title} · RIZO Performance</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=Unbounded:wght@500;600;700;800&display=swap" rel="stylesheet"/>
<style>{CSS}</style></head>
<body><div class="app">{sidebar(active)}<div class="content">{topbar(title, sub)}
<main class="main stack">{main}</main>
<p class="note">Handoff interativo (HTML/CSS/JS puro) — RIZO Performance · {title}. Implementação real em Next.js + TypeScript + Tailwind: github.com/Provesilucas/rizo-performance · rizo-performance.vercel.app</p>
</div></div>{datajs}<script>{JS}</script></body></html>'''


# ---------------------------------------------------------------- helpers UI
def kpi(label, value, ic, delta=None, brand=False, sm=False):
    chip = f'<span class="chip {"brand" if brand else ""}">{icon(ic)}</span>'
    d = ""
    if delta:
        d = f'<div class="kpi-delta">{delta}</div>'
    return f'<div class="card pad"><div class="kpi-label">{label}{chip}</div><div class="kpi-value {"sm" if sm else ""} tnum">{value}</div>{d}</div>'


def up(p):
    return f'<span class="pill up">↑ {p}</span>'


def down(p):
    return f'<span class="pill down">↓ {p}</span>'


def dist(name, val, pct, width):
    return (f'<div class="dist"><div class="row"><strong>{name}</strong>'
            f'<span class="tnum">{val} <small>{pct}</small></span></div>'
            f'<div class="bar-track"><div class="bar-fill" style="width:{width}%"></div></div></div>')


def card(title, sub, body, cls=""):
    head = f'<div class="card-head"><h3>{title}</h3>' + (f'<p>{sub}</p>' if sub else "") + '</div>'
    return f'<section class="card {cls}">{head}<div class="card-body">{body}</div></section>'


LINE_CHART = '''<svg viewBox="0 0 960 300" width="100%" height="300"><defs><linearGradient id="fr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ba4073" stop-opacity="0.18"/><stop offset="100%" stop-color="#ba4073" stop-opacity="0"/></linearGradient></defs>
<g stroke="#eee" stroke-dasharray="3 3"><line x1="60" y1="40" x2="940" y2="40"/><line x1="60" y1="110" x2="940" y2="110"/><line x1="60" y1="180" x2="940" y2="180"/><line x1="60" y1="250" x2="940" y2="250"/></g>
<g fill="#9a9a9a" font-size="12"><text x="12" y="44">1,8 mi</text><text x="18" y="114">1,4 mi</text><text x="20" y="184">900 mil</text><text x="20" y="254">450 mil</text></g>
<line x1="340" y1="20" x2="340" y2="250" stroke="#bbb" stroke-dasharray="4 4"/>
<line x1="60" y1="250" x2="940" y2="40" stroke="var(--chart-5)" stroke-width="2" stroke-dasharray="6 5"/>
<path d="M60 250 C 140 230, 260 200, 340 178 L 340 250 Z" fill="url(#fr)"/>
<path d="M60 250 C 140 230, 260 200, 340 178" fill="none" stroke="var(--chart-1)" stroke-width="2.5"/>
<path d="M340 178 C 520 120, 740 70, 940 30" fill="none" stroke="var(--chart-2)" stroke-width="2" stroke-dasharray="2 5"/>
<g fill="#9a9a9a" font-size="12" text-anchor="middle"><text x="60" y="278">01</text><text x="240" y="278">06</text><text x="360" y="278">11</text><text x="540" y="278">16</text><text x="720" y="278">21</text><text x="900" y="278">26</text><text x="940" y="278">31</text></g></svg>'''


def bar_chart(vals, labels, line=None, h=260):
    # vals: list of (y, height) rects already scaled 0..1 (fraction of chart height 200)
    bars = ""
    n = len(vals)
    step = 880 / n
    for i, v in enumerate(vals):
        x = 70 + i * step + step * 0.2
        w = step * 0.5
        bh = v * 200
        y = 230 - bh
        bars += f'<rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{bh:.0f}" rx="6" fill="var(--chart-1)"/>'
    labs = ""
    for i, l in enumerate(labels):
        x = 70 + i * step + step * 0.45
        labs += f'<text x="{x:.0f}" y="252">{l}</text>'
    ln = ""
    if line:
        pts = " ".join(f'{70 + i*step + step*0.45:.0f},{230 - v*200:.0f}' for i, v in enumerate(line))
        ln = f'<polyline points="{pts}" fill="none" stroke="#c9a24a" stroke-width="2" stroke-dasharray="5 4"/>'
    return f'''<svg viewBox="0 0 960 {h}" width="100%" height="{h}">
<g stroke="#eee" stroke-dasharray="3 3"><line x1="70" y1="30" x2="940" y2="30"/><line x1="70" y1="130" x2="940" y2="130"/><line x1="70" y1="230" x2="940" y2="230"/></g>
{bars}{ln}<g fill="#9a9a9a" font-size="12" text-anchor="middle">{labs}</g></svg>'''


def area_chart(h=240):
    return f'''<svg viewBox="0 0 960 {h}" width="100%" height="{h}"><defs><linearGradient id="fa" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ba4073" stop-opacity="0.18"/><stop offset="100%" stop-color="#ba4073" stop-opacity="0"/></linearGradient></defs>
<g stroke="#eee" stroke-dasharray="3 3"><line x1="60" y1="40" x2="940" y2="40"/><line x1="60" y1="120" x2="940" y2="120"/><line x1="60" y1="200" x2="940" y2="200"/></g>
<path d="M60 190 C 200 180, 360 160, 500 150 S 800 120, 940 70 L 940 210 L 60 210 Z" fill="url(#fa)"/>
<path d="M60 190 C 200 180, 360 160, 500 150 S 800 120, 940 70" fill="none" stroke="var(--chart-1)" stroke-width="2.5"/></svg>'''


DONUT = '''<svg viewBox="0 0 200 200" width="180" height="180"><g transform="rotate(-90 100 100)" fill="none" stroke-width="26">
<circle cx="100" cy="100" r="74" stroke="var(--danger)" stroke-dasharray="66 399" stroke-dashoffset="0"/>
<circle cx="100" cy="100" r="74" stroke="var(--warning)" stroke-dasharray="132 399" stroke-dashoffset="-66"/>
<circle cx="100" cy="100" r="74" stroke="var(--success)" stroke-dasharray="199 399" stroke-dashoffset="-198"/>
<circle cx="100" cy="100" r="74" stroke="var(--chart-5)" stroke-dasharray="66 399" stroke-dashoffset="-397"/></g>
<text x="100" y="98" text-anchor="middle" font-size="30" font-weight="600" fill="var(--fg)">7</text>
<text x="100" y="118" text-anchor="middle" font-size="12" fill="#9a9a9a">contratos</text></svg>'''


GOAL_CARD = '''<section class="card"><div class="card-head">
<div class="row" style="flex-wrap:wrap;gap:12px"><div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><h3>Evolução da Meta</h3><span id="goal-status" class="badge success">Acima do esperado</span><span id="goal-state" class="badge soft">Em andamento</span></div><p>Meta acumulada, realizado e projeção — navegue entre períodos para fechamento.</p></div>
<div id="goal-tabs" class="tabs"><span data-range="month" class="on">Mês</span><span data-range="quarter">Trimestre</span><span data-range="semester">Semestre</span><span data-range="year">Ano</span></div></div>
<div class="row" style="margin-top:14px;flex-wrap:wrap;gap:12px"><div class="navb"><button id="goal-prev">‹</button><span class="lbl" id="goal-label">Julho 2026</span><button id="goal-next">›</button></div>
<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap"><button class="btn sm" id="goal-compare">⇄ Comparar</button>
<div class="legend"><span><i style="background:var(--chart-5)"></i>Meta acumulada</span><span><i style="background:var(--chart-1)"></i>Realizado</span><span><i style="background:var(--chart-2)"></i>Projeção</span><span id="goal-cmp-legend" style="display:none"><i style="background:var(--warning)"></i>Ano anterior</span></div></div></div></div>
<div class="card-body"><svg id="goal-chart" viewBox="0 0 960 300" width="100%" height="300"></svg>
<div class="msg"><strong style="color:var(--primary)">↗</strong> <span id="goal-msg"></span>
<div class="bar-track" style="margin-top:12px"><div id="gs-bar" class="bar-fill ok" style="width:0"></div><span id="gs-marker" class="marker" style="left:0"></span></div>
<div class="row" style="margin-top:6px;font-size:12px;color:var(--muted-fg)"><span id="gs-realpct"></span><span id="gs-exppct"></span></div></div>
<div class="summary"><div><div class="lbl" id="gs-target-label">Meta do mês</div><div class="val tnum" id="gs-target"></div></div><div><div class="lbl">Realizado</div><div class="val tnum" id="gs-real"></div></div><div><div class="lbl">Projeção</div><div class="val tnum" id="gs-proj"></div></div><div><div class="lbl">Diferença de ritmo</div><div class="val tnum" id="gs-pace"></div></div></div></div></section>'''

def rev_card(title, sub):
    return (f'<section class="card"><div class="card-head"><div class="row" style="flex-wrap:wrap;gap:12px">'
            f'<div><h3>{title}</h3><p>{sub}</p></div>'
            f'<div style="display:flex;align-items:center;gap:12px"><span id="rev-cmp-legend" class="legend" style="display:none"><span><i style="background:var(--chart-2)"></i>Recebido 2025</span></span>'
            f'<button class="btn sm" id="rev-compare">⇄ Comparar 2025</button></div></div></div>'
            f'<div class="card-body"><svg id="rev-chart" viewBox="0 0 960 280" width="100%" height="280"></svg></div></section>')


REVENUE_CARD = rev_card("Faturamento da agência",
                        "Receita mensal — recebido x previsto, com comparativo do ano anterior.")


# ================================================================ CONTEÚDO
def build_index():
    kpis = (kpi("Previsão do mês", "R$ 1,7 mi", "cal", up("+3,4%") + " vs. ritmo esperado")
            + kpi("Novos contratos no mês", "18", "file", up("+20,0%") + " vs. mês anterior")
            + '<div class="card pad"><div class="kpi-label">Top comercial do mês<span class="chip brand">' + icon("crown") + '</span></div><div class="kpi-value">Djony</div><div class="kpi-delta">Fechou <strong class="green tnum">R$ 36.500</strong> · 6 contratos</div></div>'
            + kpi("Acumulado no ano", "R$ 6,4 mi", "wallet", up("+9,4%") + " vs. ano anterior"))
    goal = GOAL_CARD
    fat = REVENUE_CARD
    hub = f'''<section class="card hub"><div class="hub-grid">
<div><div style="display:flex;align-items:center;gap:8px"><span class="chip brand">{icon("trend")}</span><h3 style="margin:0;font-size:16px">Hub externo</h3><span class="badge soft">Prioridade estratégica</span></div>
<p class="muted" style="margin:6px 0 0;font-size:14px">Influenciadores fora do casting exclusivo — foco de crescimento para a saúde financeira da agência.</p>
<div style="display:flex;align-items:baseline;gap:10px;margin-top:16px"><span class="hub-value tnum">R$ 148.000</span>{up("+34,5%")}</div>
<p class="muted" style="font-size:14px;margin:4px 0 0">7 influenciadores · 9 jobs · 11% do faturamento</p>
<div style="margin-top:16px"><div class="row" style="font-size:12px;color:var(--muted-fg)"><span>Meta externa R$ 200 mil</span><strong style="color:var(--fg)">74%</strong></div><div class="bar-track"><div class="bar-fill" style="width:74%"></div></div></div></div>
<div><p style="font-size:12px;color:var(--muted-fg);margin:0 0 8px">Evolução do faturamento externo</p>{area_chart(170)}</div></div></section>'''
    metas = card("Metas dos comerciais", None, METAS_BODY, cls="")
    metas = f'<section class="card"><div class="card-head row"><h3>Metas dos comerciais</h3><span class="muted" style="font-size:12px">Clique na meta para editar</span></div><div class="card-body">{METAS_BODY}</div></section>'
    marcas = card("Top marcas fechadas", "Marcas com maior valor fechado no período.",
                  dist("NovaTech", "R$ 380 mil", "19%", 66) + dist("Bloom Beauty", "R$ 340 mil", "17%", 59)
                  + dist("FitLife", "R$ 285 mil", "14%", 49) + dist("Urban Wear", "R$ 230 mil", "12%", 40)
                  + dist("CaféÔro", "R$ 190 mil", "10%", 33) + dist("Outras", "R$ 575 mil", "29%", 100))
    setores = card("Top setores fechados", "Segmentos com maior faturamento (beleza, alimentos, varejo…).",
                   dist("Beleza", "R$ 620 mil", "26%", 100) + dist("Alimentos & Bebidas", "R$ 480 mil", "20%", 77)
                   + dist("Varejo", "R$ 410 mil", "17%", 66) + dist("Tecnologia", "R$ 380 mil", "16%", 61)
                   + dist("Saúde & Fitness", "R$ 300 mil", "12%", 48) + dist("Moda", "R$ 230 mil", "10%", 37))
    influ = card("Top influenciadores", "Principais influenciadores por receita no ano.", TOP_INFLU)
    alert = '<div class="alert"><span style="color:var(--warning)">⚠</span><span>Você tem <strong>2 contratos</strong> a encerrar em 60 dias ou já encerrados. <a href="contratos.html">Ver contratos</a></span></div>'
    return page("index.html", "Visão Geral", "Panorama executivo do mês",
                alert + f'<section class="kpis">{kpis}</section>' + goal + fat + hub
                + f'<section class="grid two">{metas}{marcas}</section>'
                + f'<section class="grid two">{setores}{influ}</section>',
                data={"GOAL": GOAL, "REVENUE": REVENUE})


def meta_person(pid, name, ini, contracts, ticket, closed, goal, year_val, year_ct, top, mt=""):
    badge = '<span class="badge warn">♛ Top do mês</span>' if top else ''
    return (f'<div data-meta="{pid}" data-closed="{closed}" data-goal="{goal}"{mt}>'
            f'<div class="row"><div style="display:flex;align-items:center;gap:12px"><span class="av2">{ini}</span>'
            f'<div><div style="display:flex;align-items:center;gap:8px"><strong>{name}</strong>{badge}</div>'
            f'<small class="muted">{contracts} contratos · {ticket} ticket médio</small></div></div>'
            f'<div style="text-align:right"><div style="font-size:12px;color:var(--muted-fg)">Meta</div>'
            f'<button class="meta-edit" style="background:none;border:0;cursor:pointer;font:inherit;display:inline-flex;align-items:center;gap:6px">'
            f'<strong class="meta-value tnum"></strong> <span style="color:var(--muted-fg)">✎</span></button></div></div>'
            f'<div class="row" style="margin-top:10px;font-size:14px"><strong class="tnum">{money_str(closed)}</strong>'
            f'<span class="meta-pct muted"></span></div>'
            f'<div class="bar-track"><div class="meta-bar bar-fill" style="width:0"></div></div>'
            f'<div class="row softbox" style="margin-top:8px;font-size:14px"><span class="muted">Acumulado no ano</span>'
            f'<strong class="tnum">{year_val} <span style="font-weight:400;font-size:12px;color:var(--muted-fg)">· {year_ct} contratos</span></strong></div></div>')


def money_str(v):
    return "R$ " + format(v, ",").replace(",", ".")


METAS_BODY = (meta_person("djony", "Djony", "DJ", 6, "R$ 6.083", 36500, 40000, "R$ 420 mil", 71, True)
              + meta_person("nicole", "Nicole Reig", "NR", 5, "R$ 9.320", 46600, 55000, "R$ 510 mil", 63, False, mt=' style="margin-top:24px"'))


def _influ_row(i, ini, name, rev, n):
    return (f'<div class="influ"><span class="rank">{i}</span><span class="av2">{ini}</span>'
            f'<div style="flex:1"><div style="font-weight:500">{name}</div>'
            f'<div class="green" style="font-size:12px">{rev} de receita</div></div>'
            f'<span class="badge soft tnum">{n}</span></div>')


TOP_INFLU = (_influ_row(1, "JP", "Júlia Prado", "R$ 420 mil", 6) + _influ_row(2, "LF", "Lucas Franco", "R$ 360 mil", 5)
             + _influ_row(3, "AT", "Aline Torres", "R$ 295 mil", 4) + _influ_row(4, "PH", "Pedro Henrique", "R$ 240 mil", 4)
             + _influ_row(5, "ML", "Mariana Lopes", "R$ 205 mil", 3) + _influ_row(6, "RD", "Rafael Dias", "R$ 160 mil", 3))


def build_comercial():
    kpis = ('<div class="card pad"><div class="kpi-label">Top comercial do mês<span class="chip brand">' + icon("crown") + '</span></div><div class="kpi-value">Djony</div><div class="kpi-delta">Fechou <strong class="green tnum">R$ 36.500</strong> · 6 contratos</div></div>'
            + kpi("Acumulado no ano", "R$ 930 mil", "wallet", up("+11,2%") + " vs. ano anterior")
            + kpi("Pipeline em aberto", "R$ 11,7 mi", "filter")
            + kpi("Conversão global", "18,8%", "trend", "prospecção → fechado"))
    funil_rows = ""
    for i, (name, n, val, w, lost) in enumerate([
        ("Prospecções", 96, "R$ 5,2 mi", 100, False), ("Reuniões", 48, "R$ 3,4 mi", 65, False),
        ("Propostas", 27, "R$ 1,95 mi", 44, False), ("Negociação", 14, "R$ 1,12 mi", 30, False),
        ("Fechados", 18, "R$ 535 mil", 22, False)]):
        funil_rows += (f'<div style="margin-bottom:12px"><div class="row" style="font-size:14px;margin-bottom:6px">'
                       f'<span><span class="muted tnum" style="font-size:12px">{i+1:02d}</span> <strong>{name}</strong></span>'
                       f'<strong class="tnum">{n}</strong></div>'
                       f'<div style="height:34px;border-radius:6px;background:var(--secondary);overflow:hidden">'
                       f'<div style="height:100%;width:{w}%;background:var(--primary);display:flex;align-items:center;padding:0 12px;color:#fff;font-size:12px">{val}</div></div></div>')
    funil_rows += '<div class="row" style="margin-top:16px;border:1px solid rgba(207,59,52,.25);background:rgba(207,59,52,.05);border-radius:10px;padding:10px 14px"><span class="badge danger">Perdidos</span><span class="tnum"><span class="muted">R$ 640 mil</span> &nbsp; <strong>11</strong></span></div>'
    metas = f'<section class="card"><div class="card-head row"><h3>Metas dos comerciais</h3><span class="muted" style="font-size:12px">Clique na meta para editar</span></div><div class="card-body">{METAS_BODY}</div></section>'
    funil = card("Funil comercial", None, funil_rows)

    def bd(name, jobs, ticket, p_val, p_pct, i_val, i_pct, big):
        return (f'<div class="card pad"><h3 style="margin:0;font-size:16px">{name} <span class="muted" style="font-weight:400">— breakdown</span></h3>'
                f'<p class="muted" style="margin:2px 0 0;font-size:13px">{jobs} jobs · ticket médio {ticket}</p>'
                f'<div style="margin-top:14px"><div class="row" style="font-size:14px"><span class="muted">Prospecção</span><span class="tnum"><strong>{p_val}</strong> <small class="muted">({p_pct})</small></span></div><div class="bar-track"><div class="bar-fill" style="width:{p_pct}"></div></div></div>'
                f'<div style="margin-top:10px"><div class="row" style="font-size:14px"><span class="muted">Email / Inbound</span><span class="tnum"><strong>{i_val}</strong> <small class="muted">({i_pct})</small></span></div><div class="bar-track"><div class="bar-fill" style="width:{i_pct};background:var(--chart-2)"></div></div></div>'
                f'<p class="muted" style="margin-top:14px;border-top:1px solid var(--border);padding-top:12px;font-size:12px">Maior job: <strong style="color:var(--fg)">{big}</strong></p></div>')
    hub_card = (f'<div class="card pad"><div style="display:flex;align-items:center;gap:8px"><h3 style="margin:0;font-size:16px">Hub externo</h3><span class="badge soft">Prioridade estratégica</span></div>'
                f'<p class="muted" style="margin:2px 0 0;font-size:13px">Influenciadores fora do casting</p>'
                f'<div style="display:flex;align-items:baseline;gap:8px;margin-top:14px"><span style="font-size:24px;font-weight:500" class="tnum">R$ 148.000</span>{up("+34,5%")}</div>'
                f'<p class="muted" style="font-size:12px;margin:2px 0 0">7 influenciadores · 9 jobs · 11%</p>'
                f'<ul style="list-style:none;padding:14px 0 0;margin:0;border-top:1px solid var(--border);margin-top:12px">'
                f'<li class="row" style="margin-bottom:10px"><div><div style="font-size:14px;font-weight:500">@leofeck1</div><div class="muted" style="font-size:12px">PERNAMBUCANAS</div></div><strong class="tnum">R$ 38.000</strong></li>'
                f'<li class="row"><div><div style="font-size:14px;font-weight:500">@carolwoudenberg</div><div class="muted" style="font-size:12px">SKALA COSMÉTICOS</div></div><strong class="tnum">R$ 32.000</strong></li></ul></div>')
    breakdown = (bd("Nicole Reig", 5, "R$ 9.320", "R$ 31.100", "66.7%", "R$ 15.500", "33.3%", "DROGARIA CATARINENSE R$ 24.600")
                 + bd("Djony", 6, "R$ 6.083", "R$ 36.500", "100.0%", "R$ 0", "0.0%", "GRUPO OCEANIC R$ 12.000")
                 + hub_card)
    sechead = '<div style="border-bottom:1px solid var(--border);padding-bottom:20px"><h2 style="margin:0;font-size:18px;font-weight:600">Breakdown por comercial</h2><p class="muted" style="margin:4px 0 0;font-size:14px">Origem dos negócios, ticket médio e maior job no período.</p></div>'
    return page("comercial.html", "Comercial", "Funil e ranking comercial",
                f'<section class="kpis">{kpis}</section>'
                + f'<section class="grid two">{metas}{funil}</section>'
                + sechead + f'<section class="grid three">{breakdown}</section>')


def build_financeiro():
    kpis = (kpi("Recebido no mês", "R$ 1,2 mi", "wallet", up("+6,2%") + " vs. mês anterior")
            + kpi("A receber", "R$ 720 mil", "clock", up("+4,8%") + " em aberto")
            + kpi("Vencidos", "R$ 330 mil", "alert", down("-12,5%") + " vs. mês anterior")
            + kpi("Ticket médio", "R$ 68.000", "receipt", up("+3,1%") + " vs. mês anterior"))
    receita = rev_card("Receita mensal", "Recebido x previsto nos últimos meses.")
    contratos = card("Contratos fechados", "Volume mensal de contratos assinados.",
                     bar_chart([.55, .65, .75, .80, .95, .90], ["Fev", "Mar", "Abr", "Mai", "Jun", "Jul"]))
    ticket = card("Ticket médio", "Evolução do valor médio por contrato.", area_chart())
    inf = card("Receita por influenciador", "Participação no faturamento do período.",
               dist("Júlia Prado", "R$ 420 mil", "23%", 88) + dist("Lucas Franco", "R$ 360 mil", "20%", 75)
               + dist("Aline Torres", "R$ 295 mil", "16%", 61) + dist("Pedro Henrique", "R$ 240 mil", "13%", 50)
               + dist("Mariana Lopes", "R$ 205 mil", "11%", 43) + dist("Outros", "R$ 480 mil", "26%", 100))
    marca = card("Receita por marca", "Participação no faturamento do período.",
                 dist("NovaTech", "R$ 380 mil", "19%", 66) + dist("Bloom Beauty", "R$ 340 mil", "17%", 59)
                 + dist("FitLife", "R$ 285 mil", "14%", 49) + dist("Urban Wear", "R$ 230 mil", "12%", 40)
                 + dist("CaféÔro", "R$ 190 mil", "10%", 33) + dist("Outras", "R$ 575 mil", "29%", 100))

    def bucket(name, cnt, val, w, danger=False):
        cls = "bar-fill danger" if danger else "bar-fill"
        bd = "danger" if danger else "soft"
        return (f'<div class="dist"><div class="row"><span><strong>{name}</strong> <span class="badge {bd}" style="font-size:10px">{cnt}</span></span>'
                f'<strong class="tnum">{val}</strong></div><div class="bar-track"><div class="{cls}" style="width:{w}%"></div></div></div>')
    receber = card("Contas a receber", "Distribuição por faixa de vencimento.",
                   bucket("A vencer", 24, "R$ 720.000", 100) + bucket("1–15 dias", 7, "R$ 180.000", 25, True)
                   + bucket("16–30 dias", 4, "R$ 96.000", 13, True) + bucket("+30 dias", 2, "R$ 54.000", 8, True))
    vencidos = f'''<section class="card" style="border-color:rgba(207,59,52,.3);background:rgba(207,59,52,.02)"><div class="card-head" style="border-color:rgba(207,59,52,.2)"><h3 style="display:flex;align-items:center;gap:8px"><span style="color:var(--danger)">⚠</span> Recebimentos vencidos</h3><p>Total em atraso que requer atenção.</p></div><div class="card-body"><p style="font-size:30px;font-weight:600;color:var(--danger);margin:0" class="tnum">R$ 330.000</p><p class="muted" style="margin:4px 0 16px">3 faixas com pendências · 13 recebimentos</p>{bucket("1–15 dias", 7, "R$ 180.000", 100, True) + bucket("16–30 dias", 4, "R$ 96.000", 53, True) + bucket("+30 dias", 2, "R$ 54.000", 30, True)}</div></section>'''
    return page("financeiro.html", "Financeiro", "Receita, recebimentos e ticket médio",
                f'<section class="kpis">{kpis}</section>' + receita
                + f'<section class="grid two">{contratos}{ticket}{inf}{marca}{receber}{vencidos}</section>',
                data={"REVENUE": REVENUE})


def build_producao():
    kpis = (kpi("Vídeos entregues", "64", "video", up("+4,9%") + " vs. mês anterior")
            + kpi("Retenção média", "7,8/10", "gauge", up("+1,3%") + " vs. mês anterior")
            + kpi("Aprovação no QC", "86%", "check", up("+2,4%") + " controle de qualidade")
            + kpi("Apenas planejados", "9", "file", "brief sem render"))
    prod = card("Produção &amp; retenção", "Vídeos entregues por mês e evolução da nota de retenção prevista.",
                bar_chart([.64, .72, .80, .88, .94, 1.0], ["Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
                          line=[.69, .71, .73, .75, .77, .78]))
    rows = ""
    for ini, name, v, ret, qc, w in [("LU", "Lucas", 28, "8,4/10", "91%", 91), ("YA", "Yasmin", 22, "7,6/10", "85%", 85), ("RI", "RIZO (marca)", 14, "7,1/10", "79%", 79)]:
        rows += (f'<tr><td><div style="display:flex;align-items:center;gap:12px"><span class="av2">{ini}</span>'
                 f'<strong>{name}</strong></div></td><td class="r tnum">{v}</td>'
                 f'<td class="r"><span class="badge soft tnum">{ret}</span></td>'
                 f'<td class="r"><div style="display:inline-block;width:110px"><div style="text-align:right;font-size:13px">{qc}</div><div class="bar-track"><div class="bar-fill" style="width:{w}%"></div></div></div></td></tr>')
    criador = f'<section class="card"><div class="card-head"><h3>Produção por criador</h3><p>Perfis internos da agência.</p></div><div class="card-body p0"><table><thead><tr><th>Criador</th><th class="r">Vídeos</th><th class="r">Retenção</th><th class="r">Aprovação QC</th></tr></thead><tbody>{rows}</tbody></table></div></section>'
    checks = ""
    for item, p in [("Hook começa forte", 82), ("Sem enrolação", 88), ("Legendas legíveis", 94), ("Cor premium", 90), ("Áudio claro (voz priorizada)", 91), ("Formato correto", 97), ("Ritmo bom", 84), ("Sem cortes estranhos", 86), ("Parece algo que o perfil postaria", 89)]:
        tone = "ok" if p >= 90 else ("" if p >= 80 else "warn")
        checks += f'<div class="dist"><div class="row" style="font-size:14px"><span>{item}</span><span class="muted tnum">{p}%</span></div><div class="bar-track"><div class="bar-fill {tone}" style="width:{p}%"></div></div></div>'
    qc = card("Controle de qualidade", "Taxa de aprovação em cada checagem antes da entrega.", checks)
    temas = card("Temas mais produzidos", "Assuntos recorrentes nos conteúdos do período.",
                 dist("Bastidores de negócios", "18", "24%", 100) + dist("Liderança", "14", "18%", 78)
                 + dist("Construção de marca", "12", "16%", 67) + dist("Paternidade &amp; rotina", "11", "15%", 61)
                 + dist("Disciplina", "9", "12%", 50))
    return page("producao.html", "Produção de conteúdo", "Conteúdo, retenção e qualidade",
                f'<section class="kpis">{kpis}</section>' + prod
                + f'<section class="grid two">{criador}{qc}</section>' + temas)


def build_contratos():
    kpis = (kpi("Valor total", "R$ 473 mil", "file")
            + kpi("Ativos / assinados", "4", "check")
            + kpi("Requerem revisão jurídica", "3", "scale"))
    donut = f'''<section class="card"><div class="card-head"><h3>Risco jurídico dos contratos</h3><p>Validação automática — Aprovado, ressalvas ou reprovado.</p></div><div class="card-body"><div class="donut-wrap">{DONUT}
<div class="donut-legend"><div class="row"><span><i class="legend" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--danger)"></i> Reprovado</span><span class="tnum"><strong>1</strong> <small class="muted">14%</small></span></div>
<div class="row"><span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--warning)"></span> Aprovado com ressalvas</span><span class="tnum"><strong>2</strong> <small class="muted">29%</small></span></div>
<div class="row"><span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--success)"></span> Aprovado</span><span class="tnum"><strong>3</strong> <small class="muted">43%</small></span></div>
<div class="row"><span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--chart-5)"></span> Em análise</span><span class="tnum"><strong>1</strong> <small class="muted">14%</small></span></div></div></div>
<div class="grid two" style="margin-top:20px;gap:12px"><div class="row softbox" style="border:1px solid rgba(224,138,30,.3);background:rgba(224,138,30,.05)"><span style="color:var(--warning)">⚠</span><div><div style="font-size:18px;font-weight:600">3</div><div class="muted" style="font-size:12px">Requerem revisão</div></div></div>
<div class="row softbox" style="border:1px solid var(--border);background:#fff"><span style="color:var(--success)">✓</span><div><div style="font-size:18px;font-weight:600">2</div><div class="muted" style="font-size:12px">Issues críticos</div></div></div></div></div></section>'''
    trows = ""
    data = [
        ("RZ-2026-0184", "Principal", "NovaTech", "Lucas Franco", "Marina Alves", "R$ 92.000", ("Assinado", "success"), ("Aprovado", "success"), "08 jul"),
        ("RZ-2026-0183", "Agência", "Bloom Beauty", "Aline Torres", "Marina Alves", "R$ 68.000", ("Ativo", "brand"), ("Ressalvas", "warn"), "03 jul"),
        ("RZ-2026-0182", "Agência", "FitLife", "Pedro Henrique", "Rafael Costa", "R$ 74.000", ("Assinado", "success"), ("Aprovado", "success"), "01 jul"),
        ("RZ-2026-0181", "Agência", "Urban Wear", "Júlia Prado", "Rafael Costa", "R$ 55.000", ("Enviado", "warn"), ("Em análise", "soft"), "—"),
        ("RZ-2026-0180", "Principal", "CaféÔro", "Rafael Dias", "Beatriz Nunes", "R$ 48.000", ("Assinado", "success"), ("Ressalvas", "warn"), "30 jun"),
        ("RZ-2026-0179", "Principal", "NovaTech", "Mariana Lopes", "Diego Martins", "R$ 61.000", ("Rascunho", "soft"), ("Reprovado", "danger"), "—"),
    ]
    stkey = {"Assinado": "signed", "Ativo": "active", "Enviado": "sent",
             "Rascunho": "draft", "Concluído": "completed"}
    for code, orig, brand, inf, com, val, (st, stc), (lg, lgc), sig in data:
        ob = "brand" if orig == "Principal" else "soft"
        trows += (f'<tr data-status="{stkey.get(st, "")}"><td class="tnum" style="font-weight:500">{code}</td>'
                  f'<td><span class="badge {ob}">{orig}</span></td><td>{brand}</td>'
                  f'<td class="muted">{inf}</td><td class="muted">{com}</td>'
                  f'<td class="r tnum" style="font-weight:600">{val}</td>'
                  f'<td><span class="badge {stc}">{st}</span></td>'
                  f'<td><span class="badge {lgc}">{lg}</span></td>'
                  f'<td class="r muted tnum">{sig}</td></tr>')
    tabela = (f'<section data-table><div class="row" style="margin-bottom:16px;flex-wrap:wrap;gap:12px">'
              f'<div class="tabs"><span class="on" data-filter="all">Todos</span><span data-filter="active">Ativos</span>'
              f'<span data-filter="signed">Assinados</span><span data-filter="sent">Enviados</span><span data-filter="draft">Rascunhos</span></div>'
              f'<input class="input" data-search style="width:240px" placeholder="Buscar contrato…"/></div>'
              f'<div class="card"><table><thead><tr><th>Contrato</th><th>Origem</th><th>Marca</th><th>Influenciador</th><th>Comercial</th><th class="r">Valor</th><th>Status</th><th>Jurídico</th><th class="r">Assinatura</th></tr></thead><tbody>{trows}</tbody></table></div></section>')
    return page("contratos.html", "Contratos", "Contratos e risco jurídico",
                f'<section class="kpis k3">{kpis}</section>'
                + f'<section class="grid two" style="grid-template-columns:1fr 2fr">{donut}{tabela}</section>')


def build_recebimentos():
    kpis = (kpi("A vencer", "R$ 80 mil", "clock") + kpi("Vencidos", "R$ 55 mil", "alert")
            + kpi("Recebidos", "R$ 37,5 mil", "check"))
    data = [
        ("24/07/2026", "#955 - SUBWAY", "SUBWAY", "Yasmin Castilho", "R$ 30.000", "20/07", ("A vencer", "warn")),
        ("22/07/2026", "#956 - GO CASE", "GO CASE", "Yasmin Castilho", "R$ 75.000", "15/07", ("A vencer", "warn")),
        ("10/07/2026", "#648 - GROWTH", "GROWTH", "Yasmin Castilho", "R$ 160.000", "05/07", ("Vencido", "danger")),
        ("07/07/2026", "#953 - KARSTEN", "KARSTEN", "Nicole Reig", "R$ 37.500", "25/06", ("Vencido", "danger")),
        ("04/07/2026", "#819 - NESTLÉ", "NESTLÉ", "Yasmin Castilho", "R$ 195.000", "29/06", ("Pago", "success")),
        ("01/07/2026", "#954 - CICATRIBEM", "CICATRIBEM", "Yasmin Castilho", "R$ 60.000", "01/07", ("A vencer", "warn")),
    ]
    rkey = {"A vencer": "pending", "Vencido": "overdue", "Pago": "paid"}
    trows = ""
    for d, contract, brand, inf, val, due, (st, stc) in data:
        trows += (f'<tr data-status="{rkey.get(st, "")}"><td class="tnum">{d}</td><td class="tnum" style="font-weight:500">{contract}</td>'
                  f'<td>{brand}</td><td class="muted">{inf}</td><td class="r tnum" style="font-weight:600">{val}</td>'
                  f'<td class="r muted tnum">{due}</td><td><span class="badge {stc}">{st}</span></td></tr>')
    tabela = (f'<section data-table><div class="tabs" style="margin-bottom:16px"><span class="on" data-filter="all">Todos</span>'
              f'<span data-filter="pending">A vencer</span><span data-filter="overdue">Vencidos</span><span data-filter="paid">Pagos</span></div>'
              f'<div class="card"><table><thead><tr><th>Data</th><th>Contrato</th><th>Marca</th><th>Influenciador</th><th class="r">Valor</th><th class="r">Vencimento</th><th>Status</th></tr></thead><tbody>{trows}</tbody></table></div></section>')
    return page("recebimentos.html", "Recebimentos", "Contas a receber e vencidos",
                f'<section class="kpis k3">{kpis}</section>' + tabela)


def _person_card(ini, name, handle, niche, fat, rec, contr, camp, growth, gd="up"):
    g = up(growth) if gd == "up" else down(growth)
    return (f'<div class="card pad"><div style="display:flex;align-items:center;gap:12px">'
            f'<span class="av2" style="width:44px;height:44px;flex-basis:44px">{ini}</span>'
            f'<div style="flex:1;min-width:0"><div style="font-weight:600">{name}</div>'
            f'<div class="muted" style="font-size:12px">{handle}</div></div>'
            f'<span class="badge soft">{niche}</span></div>'
            f'<div class="grid" style="grid-template-columns:1fr 1fr;gap:16px;margin-top:18px">'
            f'<div><div class="muted" style="font-size:12px">Faturamento</div><div class="tnum" style="font-weight:600">{fat}</div></div>'
            f'<div><div class="muted" style="font-size:12px">Recebido</div><div class="tnum" style="font-weight:600">{rec}</div></div>'
            f'<div><div class="muted" style="font-size:12px">Contratos</div><div class="tnum" style="font-weight:600">{contr}</div></div>'
            f'<div><div class="muted" style="font-size:12px">Campanhas ativas</div><div class="tnum" style="font-weight:600">{camp}</div></div></div>'
            f'<div class="row" style="margin-top:16px;border-top:1px solid var(--border);padding-top:12px">'
            f'<span class="muted" style="font-size:12px">Evolução vs. mês anterior</span>{g}</div></div>')


def build_influenciadores():
    kpis = (kpi("Influenciadores ativos", "6", "users") + kpi("Faturamento total", "R$ 1,7 mi", "trend")
            + kpi("Campanhas ativas", "11", "megaphone"))
    cards = (_person_card("JP", "Júlia Prado", "@juliaprado · 1,2M seguidores", "Moda", "R$ 420 mil", "R$ 310 mil", "6", "3", "+18,2%")
             + _person_card("LF", "Lucas Franco", "@lucasfranco · 980K seguidores", "Tecnologia", "R$ 360 mil", "R$ 268 mil", "5", "2", "+12,6%")
             + _person_card("AT", "Aline Torres", "@alinetorres · 1,5M seguidores", "Beleza", "R$ 295 mil", "R$ 210 mil", "4", "2", "+9,4%")
             + _person_card("PH", "Pedro Henrique", "@pedrohenrique · 760K seguidores", "Fitness", "R$ 240 mil", "R$ 185 mil", "4", "1", "-3,1%", "down")
             + _person_card("ML", "Mariana Lopes", "@marianalopes · 890K seguidores", "Lifestyle", "R$ 205 mil", "R$ 150 mil", "3", "2", "+6,8%")
             + _person_card("RD", "Rafael Dias", "@rafaeldias · 540K seguidores", "Gastronomia", "R$ 160 mil", "R$ 120 mil", "3", "1", "+14,9%"))
    return page("influenciadores.html", "Influenciadores", "Desempenho por influenciador",
                f'<section class="kpis k3">{kpis}</section><section class="grid three">{cards}</section>')


def _brand_card(ini, name, seg, active, rev, ticket, contr, act):
    st = ("Ativa", "success") if active else ("Inativa", "soft")
    return (f'<div class="card pad"><div style="display:flex;align-items:center;gap:12px">'
            f'<span class="av2" style="width:44px;height:44px;flex-basis:44px;border-radius:10px">{ini}</span>'
            f'<div style="flex:1;min-width:0"><div style="font-weight:600">{name}</div><div class="muted" style="font-size:12px">{seg}</div></div>'
            f'<span class="badge {st[1]}">{st[0]}</span></div>'
            f'<div class="grid" style="grid-template-columns:1fr 1fr;gap:16px;margin-top:18px">'
            f'<div><div class="muted" style="font-size:12px">Receita</div><div class="tnum" style="font-weight:600">{rev}</div></div>'
            f'<div><div class="muted" style="font-size:12px">Ticket médio</div><div class="tnum" style="font-weight:600">{ticket}</div></div>'
            f'<div><div class="muted" style="font-size:12px">Contratos</div><div class="tnum" style="font-weight:600">{contr}</div></div>'
            f'<div><div class="muted" style="font-size:12px">Ativos</div><div class="tnum" style="font-weight:600">{act}</div></div></div></div>')


def build_marcas():
    kpis = (kpi("Marcas", "6", "building") + kpi("Receita total", "R$ 1,58 mi", "wallet")
            + kpi("Contratos ativos", "11", "hand"))
    cards = (_brand_card("NT", "NovaTech", "Tecnologia", True, "R$ 380 mil", "R$ 63.333", "6", "3")
             + _brand_card("BB", "Bloom Beauty", "Beleza", True, "R$ 340 mil", "R$ 68.000", "5", "2")
             + _brand_card("FL", "FitLife", "Saúde & Fitness", True, "R$ 285 mil", "R$ 71.250", "4", "2")
             + _brand_card("UW", "Urban Wear", "Moda", False, "R$ 230 mil", "R$ 57.500", "4", "1")
             + _brand_card("CO", "CaféÔro", "Alimentos & Bebidas", True, "R$ 190 mil", "R$ 63.333", "3", "2")
             + _brand_card("VS", "Vitta Saúde", "Saúde", True, "R$ 150 mil", "R$ 75.000", "2", "1"))
    return page("marcas.html", "Marcas", "Desempenho por marca",
                f'<section class="kpis k3">{kpis}</section><section class="grid three">{cards}</section>')


def build_relatorios():
    def rc(ic, title, desc, fmts):
        badges = " ".join(f'<span class="badge soft">{f}</span>' for f in fmts)
        return (f'<div class="card pad" style="display:flex;flex-direction:column;justify-content:space-between">'
                f'<div><div class="row"><span class="chip">{icon(ic)}</span><span>{badges}</span></div>'
                f'<h3 style="margin:16px 0 4px;font-size:16px">{title}</h3><p class="muted" style="margin:0;font-size:14px">{desc}</p></div>'
                f'<button class="btn" style="margin-top:20px;justify-content:center">{icon("download","")} Exportar</button></div>')
    grid = (rc("line", "Relatório executivo mensal", "Panorama completo de metas, comercial e financeiro do mês.", ["PDF", "Excel"])
            + rc("target", "Fechamento comercial", "Funil, ranking e conversões do time comercial.", ["PDF"])
            + rc("wallet", "Demonstrativo financeiro", "Receita, recebimentos e contas a receber detalhados.", ["Excel", "CSV"])
            + rc("users", "Performance de influenciadores", "Faturamento, campanhas e evolução por influenciador.", ["PDF", "Excel"]))
    gerados = f'<section class="card"><div class="card-head"><h3>Relatórios gerados</h3></div><div class="card-body"><div class="empty"><div style="font-size:15px;font-weight:600;color:var(--fg)">Nenhum relatório gerado ainda</div><div style="margin-top:4px">Os relatórios exportados aparecerão aqui para download e histórico.</div></div></div></section>'
    return page("relatorios.html", "Relatórios", "Relatórios e exportações",
                f'<section class="grid two">{grid}</section>' + gerados)


def build_configuracoes():
    def sec(ic, title, sub, body):
        return (f'<section class="card"><div class="card-head" style="display:flex;align-items:center;gap:12px;flex-direction:row">'
                f'<span class="chip">{icon(ic)}</span><div><h3>{title}</h3><p>{sub}</p></div></div><div class="card-body">{body}</div></section>')
    perfil = sec("user", "Perfil", "Informações da sua conta.",
                 '<div class="grid two" style="gap:16px"><div class="field"><label>Nome</label><input class="input" value="Lucas Provesi"/></div><div class="field"><label>E-mail</label><input class="input" value="lucas@rizo.com.br"/></div></div><div class="field" style="margin-top:16px"><label>Cargo</label><input class="input" value="Diretoria"/></div><div style="margin-top:16px;text-align:right"><button class="btn primary">Salvar alterações</button></div>')
    aparencia = sec("palette", "Aparência", "Escolha o tema da interface.",
                    '<div class="seg"><div class="opt on"><span class="chip brand">☀</span> Claro</div><div class="opt"><span class="chip">☾</span> Escuro</div><div class="opt"><span class="chip">🖥</span> Sistema</div></div>')
    integ = sec("db", "Integração de dados", "Origem dos dados exibidos na plataforma.",
                '<div class="row softbox" style="margin-bottom:12px"><div><div style="font-weight:500">Provedor atual</div><div class="muted" style="font-size:12px">Dados simulados para demonstração.</div></div><span class="badge warn">Mock</span></div><div class="softbox" style="background:#fff;border:1px solid var(--border)"><div style="font-weight:500">Endpoint base</div><div class="muted" style="font-family:ui-monospace,monospace;font-size:12px;margin-top:2px">https://api.rizo.com.br/v1</div></div><p class="muted" style="font-size:12px;margin-top:12px">Para conectar ao sistema real, defina <code style="background:var(--secondary);padding:1px 5px;border-radius:4px">NEXT_PUBLIC_DATA_PROVIDER=api</code> e o token nas variáveis de ambiente.</p>')
    return page("configuracoes.html", "Configurações", "Preferências da conta",
                f'<div style="max-width:760px;margin:0 auto" class="stack">{perfil}{aparencia}{integ}</div>')


PAGES = {
    "index.html": build_index,
    "comercial.html": build_comercial,
    "financeiro.html": build_financeiro,
    "producao.html": build_producao,
    "contratos.html": build_contratos,
    "recebimentos.html": build_recebimentos,
    "influenciadores.html": build_influenciadores,
    "marcas.html": build_marcas,
    "relatorios.html": build_relatorios,
    "configuracoes.html": build_configuracoes,
}

if __name__ == "__main__":
    for fname, fn in PAGES.items():
        with open(os.path.join(OUT, fname), "w", encoding="utf-8") as f:
            f.write(fn())
        print("gerado:", fname)
    print("OK —", len(PAGES), "páginas")
