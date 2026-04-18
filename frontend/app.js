/* ══════════════════════════════════════════════════
   EduData Analytics — app.js
   All JS: API fetch, Chart.js, filters, table, pagination
══════════════════════════════════════════════════ */

const API = 'http://127.0.0.1:8000';

/* ─────────────────────────────────────────────────
   State
───────────────────────────────────────────────── */
let allData     = [];
let filteredData = [];
let charts      = {};
let sortState   = { col: 'ratio', dir: 'desc' };
let currentPage = 1;
let pageSize    = 20;
let statsData   = null;

/* ─────────────────────────────────────────────────
   Boot
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });
  setupThemeToggle();
  setupNav();
  setupTableSort();
  setupFilters();
  setupPagination();
  setupExport();

  await Promise.all([
    fetchSchools(),
    fetchStats(),
  ]);

  buildKPIs();
  buildInsights();
  buildAllCharts();
  renderTable();
});

/* ─────────────────────────────────────────────────
   API Helpers
───────────────────────────────────────────────── */
async function fetchSchools() {
  try {
    const res  = await fetch(`${API}/api/schools`);
    const json = await res.json();
    allData      = json.data;
    filteredData = [...allData];
  } catch (e) {
    showApiError();
  }
}

async function fetchStats() {
  try {
    const res  = await fetch(`${API}/api/stats`);
    statsData  = await res.json();
  } catch (_) {}
}

async function fetchDistribution() {
  const res  = await fetch(`${API}/api/distribution?bins=12`);
  return res.json();
}

async function fetchTop(by='ratio', n=15, dir='desc') {
  const res  = await fetch(`${API}/api/top?by=${by}&n=${n}&dir=${dir}`);
  const json = await res.json();
  return json.data;
}

function showApiError() {
  document.getElementById('tableBody').innerHTML = `
    <tr><td colspan="8" class="text-center py-5 text-danger">
      <i class="fa-solid fa-triangle-exclamation fa-2x mb-3 d-block"></i>
      Không kết nối được backend. Hãy chạy:<br>
      <code style="background:#1e293b;padding:4px 12px;border-radius:6px;font-size:0.9rem">
        uvicorn main:app --reload
      </code>
    </td></tr>`;
}

/* ─────────────────────────────────────────────────
   KPI Cards
───────────────────────────────────────────────── */
function buildKPIs() {
  if (!statsData) return;
  const s = statsData;

  // Find max ratio school
  const top1 = [...allData].sort((a,b) => b.ratio - a.ratio)[0];

  animateNumber('kpi-schools', 0, s.total_schools, 1200);
  animateNumber('kpi-quota',   0, s.total_quota,   1400, true);
  animateNumber('kpi-nv1',     0, s.total_nv1,     1600, true);

  el('kpi-max-ratio').textContent   = top1.ratio.toFixed(2);
  el('kpi-max-school').textContent  = top1.name;

  setTimeout(() => {
    el('kpi-avg-ratio').textContent = s.ratio.mean.toFixed(2);
  }, 500);

  animateNumber('kpi-competitive', 0, s.highly_competitive, 1200);
}

/* ─────────────────────────────────────────────────
   Insights
───────────────────────────────────────────────── */
function buildInsights() {
  if (!statsData || !allData.length) return;
  const s = statsData;
  const avgRatio = s.ratio.mean;

  const top1     = [...allData].sort((a,b) => b.ratio  - a.ratio)[0];
  const topNV1   = [...allData].sort((a,b) => b.nv1    - a.nv1)[0];
  const topTotal = [...allData].sort((a,b) => b.total  - a.total)[0];
  const bottom1  = [...allData].sort((a,b) => a.ratio  - b.ratio)[0];
  const topQuota = [...allData].sort((a,b) => b.quota  - a.quota)[0];
  const aboveAvg = allData.filter(d => d.ratio >= avgRatio).length;

  const insights = [
    {
      icon: '🔥', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',
      title: 'Trường cạnh tranh nhất',
      badge: `${top1.ratio.toFixed(2)}x`,
      text: `<strong>${top1.name}</strong> dẫn đầu với tỷ lệ chọi ${top1.ratio}. Mỗi chỉ tiêu có đến ${top1.ratio} hồ sơ NV1 cạnh tranh.`
    },
    {
      icon: '📋', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',
      title: 'Trường nhận nhiều NV1 nhất',
      badge: topNV1.nv1.toLocaleString(),
      text: `<strong>${topNV1.name}</strong> thu hút ${topNV1.nv1.toLocaleString()} hồ sơ nguyện vọng 1—nhiều nhất toàn thành phố.`
    },
    {
      icon: '📊', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',
      title: 'Tỷ lệ chọi trung bình',
      badge: avgRatio.toFixed(2) + 'x',
      text: `Tỷ lệ chọi trung bình là <strong>${avgRatio.toFixed(2)}</strong>. Có <strong>${aboveAvg}/${allData.length}</strong> trường cao hơn mức này.`
    },
    {
      icon: '✅', color: '#10b981', bg: 'rgba(16,185,129,0.12)',
      title: 'Trường ít cạnh tranh nhất',
      badge: `${bottom1.ratio.toFixed(2)}x`,
      text: `<strong>${bottom1.name}</strong> có tỷ lệ chọi thấp nhất (${bottom1.ratio}). Còn nhiều cơ hội cho thí sinh.`
    },
    {
      icon: '🏫', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',
      title: 'Trường có chỉ tiêu cao nhất',
      badge: topQuota.quota.toLocaleString(),
      text: `<strong>${topQuota.name}</strong> tuyển nhiều nhất với ${topQuota.quota.toLocaleString()} chỉ tiêu — tạo nhiều cơ hội nhất cho học sinh.`
    },
    {
      icon: '📈', color: '#22d3ee', bg: 'rgba(34,211,238,0.12)',
      title: 'Tổng hồ sơ dịch chuyển',
      badge: s.total_aspirations.toLocaleString(),
      text: `Tổng cộng <strong>${s.total_aspirations.toLocaleString()}</strong> lượt nộp hồ sơ (NV1+NV2+NV3), tương đương ${s.nv1_vs_quota_ratio}x chỉ tiêu.`
    },
  ];

  const container = el('insightCards');
  container.innerHTML = insights.map((ins, i) => `
    <div class="col-md-6 col-xl-4" data-aos="fade-up" data-aos-delay="${i * 80}">
      <div class="insight-card">
        <div class="insight-icon" style="background:${ins.bg};color:${ins.color};font-size:1.6rem">${ins.icon}</div>
        <div>
          <div class="insight-badge" style="color:${ins.color}">${ins.badge}</div>
          <div class="insight-title">${ins.title}</div>
          <div class="insight-text">${ins.text}</div>
        </div>
      </div>
    </div>
  `).join('');
}

/* ─────────────────────────────────────────────────
   Charts
───────────────────────────────────────────────── */
const PALETTE = {
  blue:   'rgba(59,130,246,',
  purple: 'rgba(139,92,246,',
  green:  'rgba(16,185,129,',
  red:    'rgba(239,68,68,',
  gold:   'rgba(245,158,11,',
  teal:   'rgba(34,211,238,',
  orange: 'rgba(249,115,22,',
};

function chartDefaults() {
  const light = document.documentElement.getAttribute('data-theme') === 'light';
  return {
    textColor: light ? '#1a2340' : '#e8edf5',
    gridColor: light ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)',
    tooltipBg: light ? 'rgba(255,255,255,0.95)' : 'rgba(10,16,30,0.95)',
  };
}

async function buildAllCharts() {
  /* Fetch extra data in parallel */
  const [top15, distData, topNV1_15, topTotal15] = await Promise.all([
    fetchTop('ratio', 15, 'desc'),
    fetchDistribution(),
    fetchTop('nv1',   20, 'desc'),
    fetchTop('total', 15, 'desc'),
  ]);

  Chart.defaults.font.family = "'Inter', sans-serif";

  buildHeroMini();
  buildTopRatioChart(top15);
  buildAspirationPie();
  buildQuotaVsNv1Chart();
  buildScatterChart();
  buildHistoChart(distData);
  buildStackedNvChart(topTotal15);
  buildRadarChart();
  buildTopNv1Chart(topNV1_15);
}

/* Hero mini-preview bar chart */
function buildHeroMini() {
  const ctx = document.getElementById('heroMiniChart')?.getContext('2d');
  if (!ctx) return;

  const top8 = [...allData].sort((a,b) => b.ratio - a.ratio).slice(0, 8);
  const C = chartDefaults();

  charts.hero = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top8.map(d => d.name.length > 12 ? d.name.slice(0,12)+'…' : d.name),
      datasets: [{
        data: top8.map(d => d.ratio),
        backgroundColor: top8.map((_,i) => `hsla(${220 + i*10}, 80%, 65%, 0.8)`),
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: { display: false, min: 0 }
      },
      animation: { duration: 1200, easing: 'easeOutQuart' }
    }
  });
}

/* 1. Top 15 Ratio — horizontal bar */
function buildTopRatioChart(data) {
  const ctx = document.getElementById('topRatioChart').getContext('2d');
  const C = chartDefaults();

  const colors = data.map(d =>
    d.ratio >= 3   ? `${PALETTE.red}0.85)`   :
    d.ratio >= 2   ? `${PALETTE.gold}0.85)`  :
    d.ratio >= 1.5 ? `${PALETTE.blue}0.75)`  : `${PALETTE.green}0.7)`
  );

  charts.topRatio = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.name),
      datasets: [{
        label: 'Tỷ lệ chọi',
        data: data.map(d => d.ratio),
        backgroundColor: colors,
        borderRadius: 5,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.tooltipBg, titleColor: C.textColor, bodyColor: C.textColor,
          callbacks: {
            label: ctx => ` Tỷ lệ chọi: ${ctx.raw}`,
            afterLabel: ctx => {
              const d = data[ctx.dataIndex];
              return ` Chỉ tiêu: ${d.quota.toLocaleString()} | NV1: ${d.nv1.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: { ticks: { color: C.textColor }, grid: { color: C.gridColor } },
        y: { ticks: { color: C.textColor, font: { size: 11 } }, grid: { display: false } }
      },
      animation: { duration: 1000, easing: 'easeOutQuart' }
    }
  });
}

/* 2. Aspiration Doughnut */
function buildAspirationPie() {
  const ctx = document.getElementById('aspirationPieChart').getContext('2d');
  const C = chartDefaults();

  const sumNV1  = allData.reduce((s,d) => s + d.nv1,  0);
  const sumNV2  = allData.reduce((s,d) => s + d.nv2,  0);
  const sumNV3  = allData.reduce((s,d) => s + d.nv3,  0);
  const total   = sumNV1 + sumNV2 + sumNV3;
  const pct     = v => ((v / total) * 100).toFixed(1);

  charts.pie = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['NV 1', 'NV 2', 'NV 3'],
      datasets: [{
        data: [sumNV1, sumNV2, sumNV3],
        backgroundColor: ['rgba(59,130,246,0.85)', 'rgba(16,185,129,0.85)', 'rgba(139,92,246,0.85)'],
        borderColor: 'transparent',
        hoverOffset: 12
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { position: 'bottom', labels: { color: C.textColor, padding: 18, usePointStyle: true } },
        tooltip: {
          backgroundColor: C.tooltipBg, titleColor: C.textColor, bodyColor: C.textColor,
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.raw.toLocaleString()} hồ sơ (${pct(ctx.raw)}%)`
          }
        }
      },
      animation: { animateScale: true, duration: 1000 }
    }
  });
}

/* 3. Quota vs NV1 grouped bar */
function buildQuotaVsNv1Chart() {
  const ctx = document.getElementById('quotaVsNv1Chart').getContext('2d');
  const C = chartDefaults();
  const top20 = [...allData].sort((a,b) => b.quota - a.quota).slice(0, 20);

  charts.quotaNv1 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top20.map(d => d.name.length > 14 ? d.name.slice(0,14)+'…' : d.name),
      datasets: [
        {
          label: 'NV 1',
          data: top20.map(d => d.nv1),
          backgroundColor: `${PALETTE.blue}0.8)`,
          borderRadius: 4,
        },
        {
          label: 'Chỉ tiêu',
          data: top20.map(d => d.quota),
          backgroundColor: `${PALETTE.green}0.75)`,
          borderRadius: 4,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: C.textColor, usePointStyle: true } },
        tooltip: { backgroundColor: C.tooltipBg, titleColor: C.textColor, bodyColor: C.textColor }
      },
      scales: {
        x: { ticks: { color: C.textColor, maxRotation: 45, font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: C.textColor }, grid: { color: C.gridColor } }
      }
    }
  });
}

/* 4. Scatter: Quota vs Ratio */
function buildScatterChart() {
  const ctx = document.getElementById('scatterChart').getContext('2d');
  const C = chartDefaults();

  charts.scatter = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Trường THPT',
        data: allData.map(d => ({ x: d.quota, y: d.ratio, name: d.name })),
        backgroundColor: allData.map(d =>
          d.ratio >= 2 ? `${PALETTE.red}0.75)` : `${PALETTE.blue}0.6)`
        ),
        pointRadius: 6,
        pointHoverRadius: 9,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.tooltipBg, titleColor: C.textColor, bodyColor: C.textColor,
          callbacks: {
            title: () => '',
            label: ctx => [
              `📍 ${ctx.raw.name}`,
              `Chỉ tiêu: ${ctx.raw.x}`,
              `Tỷ lệ chọi: ${ctx.raw.y}`
            ]
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Chỉ tiêu', color: C.textColor },
          ticks: { color: C.textColor }, grid: { color: C.gridColor }
        },
        y: {
          title: { display: true, text: 'Tỷ lệ chọi', color: C.textColor },
          ticks: { color: C.textColor }, grid: { color: C.gridColor }
        }
      }
    }
  });
}

/* 5. Histogram of ratio distribution */
function buildHistoChart(distData) {
  const ctx = document.getElementById('histoChart').getContext('2d');
  const C = chartDefaults();

  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(139,92,246,0.9)');
  gradient.addColorStop(1, 'rgba(59,130,246,0.4)');

  charts.histo = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: distData.bins.map(b => b.label),
      datasets: [{
        label: 'Số trường',
        data: distData.bins.map(b => b.count),
        backgroundColor: gradient,
        borderRadius: 5,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.tooltipBg, titleColor: C.textColor, bodyColor: C.textColor,
          callbacks: { label: ctx => ` ${ctx.raw} trường` }
        }
      },
      scales: {
        x: { ticks: { color: C.textColor, maxRotation: 40, font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: C.textColor, stepSize: 1 }, grid: { color: C.gridColor } }
      }
    }
  });
}

/* 6. Stacked NV bar */
function buildStackedNvChart(data) {
  const ctx = document.getElementById('stackedNvChart').getContext('2d');
  const C = chartDefaults();

  charts.stackedNv = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.name.length > 14 ? d.name.slice(0,14)+'…' : d.name),
      datasets: [
        { label: 'NV 1', data: data.map(d => d.nv1), backgroundColor: `${PALETTE.blue}0.85)`,   borderRadius: 0 },
        { label: 'NV 2', data: data.map(d => d.nv2), backgroundColor: `${PALETTE.green}0.75)`,  borderRadius: 0 },
        { label: 'NV 3', data: data.map(d => d.nv3), backgroundColor: `${PALETTE.purple}0.75)`, borderRadius: 0, borderSkipped: false },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { stacked: true, ticks: { color: C.textColor, maxRotation: 45, font: { size: 10 } }, grid: { display: false } },
        y: { stacked: true, ticks: { color: C.textColor }, grid: { color: C.gridColor } }
      },
      plugins: {
        legend: { labels: { color: C.textColor, usePointStyle: true } },
        tooltip: {
          mode: 'index', backgroundColor: C.tooltipBg, titleColor: C.textColor, bodyColor: C.textColor
        }
      }
    }
  });
}

/* 7. Radar by group */
function buildRadarChart() {
  const ctx = document.getElementById('radarChart').getContext('2d');
  const C = chartDefaults();

  const groups = {
    'Rất cao (≥2.5)':     allData.filter(d => d.ratio >= 2.5),
    'Cao (1.5–2.5)':      allData.filter(d => d.ratio >= 1.5 && d.ratio < 2.5),
    'Trung bình (<1.5)':  allData.filter(d => d.ratio < 1.5),
  };

  const avg = (arr, key) => arr.length ? arr.reduce((s,d) => s + d[key], 0) / arr.length : 0;
  const labels = ['NV1 TB', 'NV2 TB', 'NV3 TB', 'Chỉ tiêu TB', 'Tổng TB'];
  const keys   = ['nv1', 'nv2', 'nv3', 'quota', 'total'];

  const colors = [
    ['rgba(239,68,68,0.8)', 'rgba(239,68,68,0.15)'],
    ['rgba(245,158,11,0.8)','rgba(245,158,11,0.15)'],
    ['rgba(16,185,129,0.8)','rgba(16,185,129,0.15)'],
  ];

  const datasets = Object.entries(groups).map(([label, items], i) => ({
    label,
    data: keys.map(k => Math.round(avg(items, k))),
    fill: true,
    backgroundColor: colors[i][1],
    borderColor: colors[i][0],
    pointBackgroundColor: colors[i][0],
    pointRadius: 4,
  }));

  charts.radar = new Chart(ctx, {
    type: 'radar',
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: C.textColor, usePointStyle: true } },
        tooltip: { backgroundColor: C.tooltipBg, titleColor: C.textColor, bodyColor: C.textColor }
      },
      scales: {
        r: {
          grid: { color: C.gridColor },
          ticks: { color: C.textColor, backdropColor: 'transparent', font: { size: 10 } },
          pointLabels: { color: C.textColor, font: { size: 11 } }
        }
      }
    }
  });
}

/* 8. Top 20 NV1 horizontal */
function buildTopNv1Chart(data) {
  const ctx = document.getElementById('topNv1Chart').getContext('2d');
  const C = chartDefaults();

  const gradient = ctx.createLinearGradient(400, 0, 0, 0);
  gradient.addColorStop(0, 'rgba(59,130,246,0.9)');
  gradient.addColorStop(1, 'rgba(139,92,246,0.6)');

  charts.topNv1 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.name),
      datasets: [{
        label: 'Hồ sơ NV1',
        data: data.map(d => d.nv1),
        backgroundColor: gradient,
        borderRadius: 5,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: C.tooltipBg, titleColor: C.textColor, bodyColor: C.textColor,
          callbacks: { label: ctx => ` NV1: ${ctx.raw.toLocaleString()} hồ sơ` }
        }
      },
      scales: {
        x: { ticks: { color: C.textColor }, grid: { color: C.gridColor } },
        y: { ticks: { color: C.textColor, font: { size: 11 } }, grid: { display: false } }
      }
    }
  });
}

/* ─────────────────────────────────────────────────
   Table Rendering
───────────────────────────────────────────────── */
function renderTable() {
  const tbody = el('tableBody');

  if (!filteredData.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5 text-muted">
      <i class="fa-solid fa-search-minus fa-2x d-block mb-3"></i>Không tìm thấy kết quả
    </td></tr>`;
    el('tableCount').textContent = '0';
    el('paginationInfo').textContent = '';
    el('paginationControls').innerHTML = '';
    return;
  }

  // Sort
  const sorted = [...filteredData].sort((a, b) => {
    let va = a[sortState.col], vb = b[sortState.col];
    if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    if (va < vb) return sortState.dir === 'asc' ? -1 : 1;
    if (va > vb) return sortState.dir === 'asc' ? 1  : -1;
    return 0;
  });

  const total = sorted.length;
  const start = (currentPage - 1) * pageSize;
  const page  = sorted.slice(start, start + pageSize);

  el('tableCount').textContent = total;
  el('tableSubInfo').textContent = total < allData.length ? ` (của ${allData.length})` : '';

  tbody.innerHTML = page.map((d, idx) => {
    const ratioClass =
      d.ratio >= 2.5  ? 'ratio-high' :
      d.ratio >= 1.75 ? 'ratio-med'  :
      d.ratio >= 1.25 ? 'ratio-low'  : 'ratio-vlow';

    const rank = start + idx + 1;
    return `
      <tr style="cursor:pointer" onclick="window.location.href='school-detail.html?id=${d.tt}'">
        <td><span class="school-rank">${rank}</span></td>
        <td class="school-cell">${d.name}</td>
        <td>${d.quota.toLocaleString()}</td>
        <td>${d.nv1.toLocaleString()}</td>
        <td>${d.nv2.toLocaleString()}</td>
        <td>${d.nv3.toLocaleString()}</td>
        <td>${d.total.toLocaleString()}</td>
        <td class="${ratioClass}">${d.ratio.toFixed(2)}</td>
      </tr>`;
  }).join('');

  renderPagination(total);
  updateSortIcons();
}

/* ─────────────────────────────────────────────────
   Pagination
───────────────────────────────────────────────── */
function renderPagination(total) {
  const totalPages = Math.ceil(total / pageSize);
  const start = (currentPage - 1) * pageSize + 1;
  const end   = Math.min(currentPage * pageSize, total);

  el('paginationInfo').textContent = `Hiển thị ${start}–${end} trong ${total} trường`;

  const ul = el('paginationControls');
  ul.innerHTML = '';

  if (totalPages <= 1) return;

  const makeItem = (label, page, disabled = false, active = false) => {
    const li = document.createElement('li');
    li.className = `page-item${disabled ? ' disabled' : ''}${active ? ' active' : ''}`;
    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#database';
    a.innerHTML = label;
    if (!disabled && !active) {
      a.addEventListener('click', e => {
        e.preventDefault();
        currentPage = page;
        renderTable();
      });
    }
    li.appendChild(a);
    return li;
  };

  ul.appendChild(makeItem('<i class="fa-solid fa-chevron-left"></i>', currentPage - 1, currentPage === 1));

  // Show up to 5 page numbers around current
  const range = [];
  for (let p = Math.max(1, currentPage - 2); p <= Math.min(totalPages, currentPage + 2); p++) {
    range.push(p);
  }
  if (range[0] > 1) { ul.appendChild(makeItem('1', 1)); if (range[0] > 2) ul.appendChild(makeItem('…', null, true)); }
  range.forEach(p => ul.appendChild(makeItem(p, p, false, p === currentPage)));
  if (range[range.length-1] < totalPages) {
    if (range[range.length-1] < totalPages - 1) ul.appendChild(makeItem('…', null, true));
    ul.appendChild(makeItem(totalPages, totalPages));
  }

  ul.appendChild(makeItem('<i class="fa-solid fa-chevron-right"></i>', currentPage + 1, currentPage === totalPages));
}

/* ─────────────────────────────────────────────────
   Filters
───────────────────────────────────────────────── */
function applyFilters() {
  const name     = el('searchName').value.trim().toLowerCase();
  const ratioMin = parseFloat(el('ratioMin').value) || 0;
  const ratioMax = parseFloat(el('ratioMax').value) || 99;
  const quotaMin = parseInt(el('quotaMin').value)   || 0;

  filteredData = allData.filter(d =>
    (!name || d.name.toLowerCase().includes(name)) &&
    d.ratio >= ratioMin && d.ratio <= ratioMax &&
    d.quota >= quotaMin
  );

  currentPage = 1;
  renderTable();
}

function resetFilters() {
  el('searchName').value = '';
  el('ratioMin').value   = 0;
  el('ratioMax').value   = 10;
  el('quotaMin').value   = 0;
  el('clearSearch').style.display = 'none';
  filteredData = [...allData];
  currentPage  = 1;
  renderTable();
}

function setupFilters() {
  el('applyFilters').addEventListener('click', applyFilters);
  el('resetFilters').addEventListener('click', resetFilters);

  // Search with live clear button
  el('searchName').addEventListener('input', e => {
    el('clearSearch').style.display = e.target.value ? 'block' : 'none';
    applyFilters();
  });
  el('clearSearch').addEventListener('click', () => {
    el('searchName').value = '';
    el('clearSearch').style.display = 'none';
    applyFilters();
  });

  el('ratioMin').addEventListener('change', applyFilters);
  el('ratioMax').addEventListener('change', applyFilters);
  el('quotaMin').addEventListener('change', applyFilters);
}

/* ─────────────────────────────────────────────────
   Table Sort
───────────────────────────────────────────────── */
function setupTableSort() {
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-col');
      if (sortState.col === col) {
        sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
      } else {
        sortState.col = col;
        sortState.dir = 'desc';
      }
      currentPage = 1;
      renderTable();
    });
  });
}

function updateSortIcons() {
  document.querySelectorAll('th.sortable').forEach(th => {
    th.classList.remove('active-sort', 'asc', 'desc');
    const icon = th.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-sort ms-1';
    if (th.getAttribute('data-col') === sortState.col) {
      th.classList.add('active-sort', sortState.dir);
      if (icon) icon.className = `fa-solid fa-sort-${sortState.dir === 'asc' ? 'up' : 'down'} ms-1`;
    }
  });
}

/* ─────────────────────────────────────────────────
   Pagination Setup
───────────────────────────────────────────────── */
function setupPagination() {
  el('pageSize').addEventListener('change', e => {
    pageSize    = parseInt(e.target.value);
    currentPage = 1;
    renderTable();
  });
}

/* ─────────────────────────────────────────────────
   Export CSV
───────────────────────────────────────────────── */
function setupExport() {
  el('exportCsv').addEventListener('click', () => {
    const headers = ['TT','Trường THPT','Chỉ tiêu','NV 1','NV 2','NV 3','Tổng','Tỷ lệ chọi'];
    const rows = filteredData.map(d => [d.tt, d.name, d.quota, d.nv1, d.nv2, d.nv3, d.total, d.ratio]);
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'tuyen_sinh_thpt_hanoi_2024.csv';
    a.click();
    URL.revokeObjectURL(url);
  });
}

/* ─────────────────────────────────────────────────
   Smooth Nav & Active State
───────────────────────────────────────────────── */
function setupNav() {
  document.querySelectorAll('.nav-scroll').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  // Scroll spy
  const sections = ['overview','charts','insights','database'].map(id => document.getElementById(id));
  window.addEventListener('scroll', () => {
    const y = window.scrollY + 120;
    sections.forEach((sec, i) => {
      if (!sec) return;
      if (y >= sec.offsetTop && (!sections[i+1] || y < sections[i+1].offsetTop)) {
        document.querySelectorAll('.nav-scroll').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.nav-scroll')[i]?.classList.add('active');
      }
    });
  });
}

/* ─────────────────────────────────────────────────
   Theme Toggle
───────────────────────────────────────────────── */
function setupThemeToggle() {
  const btn = el('themeToggle');
  let dark = false;

  // Apply light mode by default on load
  document.documentElement.setAttribute('data-theme', 'light');
  btn.innerHTML = '<i class="fa-solid fa-sun"></i>';

  btn.addEventListener('click', () => {
    dark = !dark;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    btn.innerHTML = dark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';

    // Rebuild charts with new theme
    Object.values(charts).forEach(c => {
      const C = chartDefaults();
      if (c.options.scales) {
        ['x','y','r'].forEach(axis => {
          if (c.options.scales[axis]) {
            if (c.options.scales[axis].ticks)      c.options.scales[axis].ticks.color      = C.textColor;
            if (c.options.scales[axis].grid)        c.options.scales[axis].grid.color       = C.gridColor;
            if (c.options.scales[axis].pointLabels) c.options.scales[axis].pointLabels.color = C.textColor;
            if (c.options.scales[axis].title)       c.options.scales[axis].title.color      = C.textColor;
          }
        });
      }
      if (c.options.plugins?.legend?.labels) c.options.plugins.legend.labels.color = C.textColor;
      if (c.options.plugins?.tooltip) {
        c.options.plugins.tooltip.backgroundColor = C.tooltipBg;
        c.options.plugins.tooltip.titleColor = C.textColor;
        c.options.plugins.tooltip.bodyColor  = C.textColor;
      }
      c.update();
    });
  });
}

/* ─────────────────────────────────────────────────
   Utilities
───────────────────────────────────────────────── */
function el(id) { return document.getElementById(id); }

function animateNumber(id, from, to, duration, format = false) {
  const obj = el(id);
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const val = Math.round(from + (to - from) * easeOut(p));
    obj.textContent = format ? val.toLocaleString() : val;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
