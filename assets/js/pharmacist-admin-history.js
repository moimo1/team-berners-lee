const HISTORY_PHARMACISTS_ENDPOINT = '/api/pharma-admin/pharmacists';
const HISTORY_ENDPOINT = '/api/pharma-admin/history';

document.addEventListener('DOMContentLoaded', () => {
  initHistoryView();
});

async function initHistoryView() {
  const pharmacistSelect = document.getElementById('history-pharmacist');
  const rangeSelect = document.getElementById('history-range');
  const metricSelect = document.getElementById('history-metric');

  populateRangeSelect(rangeSelect);
  populateMetricSelect(metricSelect);

  try {
    await populatePharmacistSelect(pharmacistSelect);
    const update = () => updateHistory(pharmacistSelect.value);
    pharmacistSelect.addEventListener('change', update);
    rangeSelect.addEventListener('change', update);
    metricSelect.addEventListener('change', update);
    update();
  } catch (error) {
    console.error('Unable to load pharmacists for history view', error);
    renderHistoryError('Unable to load pharmacist roster.');
  }
}

async function populatePharmacistSelect(select) {
  if (!select) return;
  select.innerHTML = '<option value="">Loading...</option>';
  const data = await fetchJson(HISTORY_PHARMACISTS_ENDPOINT);
  const pharmacists = data?.pharmacists ?? [];
  if (!pharmacists.length) {
    select.innerHTML = '<option value="">No pharmacists found</option>';
    select.disabled = true;
    return;
  }
  select.innerHTML = '';
  pharmacists.forEach((pharmacist, index) => {
    const option = document.createElement('option');
    option.value = pharmacist.pharmaID;
    option.textContent = `${pharmacist.firstName} ${pharmacist.lastName}`;
    if (index === 0) option.selected = true;
    select.appendChild(option);
  });
}

function populateRangeSelect(select) {
  if (!select) return;
  const ranges = ['Last 7 days', 'Last 30 days', 'Last quarter'];
  select.innerHTML = '';
  ranges.forEach((range, index) => {
    const option = document.createElement('option');
    option.value = range;
    option.textContent = range;
    if (index === 0) option.selected = true;
    select.appendChild(option);
  });
}

function populateMetricSelect(select) {
  if (!select) return;
  const metrics = [
    { id: 'completed', label: 'Completed prescriptions' },
    { id: 'avgTime', label: 'Average fulfillment time' },
    { id: 'escalations', label: 'Escalations raised' }
  ];
  select.innerHTML = '';
  metrics.forEach((metric, index) => {
    const option = document.createElement('option');
    option.value = metric.id;
    option.textContent = metric.label;
    if (index === 0) option.selected = true;
    select.appendChild(option);
  });
}

async function updateHistory(pharmacistId) {
  const tbody = document.getElementById('history-table-body');
  const timeline = document.getElementById('history-timeline');
  if (!pharmacistId) {
    renderHistoryError('Select a pharmacist to view history.');
    return;
  }

  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="5">Loading weekly metrics...</td></tr>';
  }
  if (timeline) {
    timeline.innerHTML = '<li><strong>Loading highlights…</strong><span>Please wait.</span></li>';
  }

  try {
    const payload = await fetchJson(`${HISTORY_ENDPOINT}?pharmacistId=${encodeURIComponent(pharmacistId)}`);
    renderHistoryTable(payload?.weekly ?? []);
    renderTimeline(payload?.timeline ?? []);
  } catch (error) {
    console.error('Unable to load history data', error);
    renderHistoryError('Unable to load history data.');
  }
}

function renderHistoryTable(rows) {
  const tbody = document.getElementById('history-table-body');
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="5">No history available for the selected pharmacist.</td></tr>';
    return;
  }

  tbody.innerHTML = '';
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.range}</td>
      <td>${row.prescriptions}</td>
      <td>${row.avgTime}</td>
      <td>${row.errors}</td>
      <td class="${row.tone || ''}">${row.commentary}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderTimeline(highlights) {
  const timeline = document.getElementById('history-timeline');
  if (!timeline) return;

  if (!highlights.length) {
    timeline.innerHTML = `
      <li>
        <strong>No highlights logged</strong>
        <span>This pharmacist has no noteworthy events recorded for the selected window.</span>
      </li>
    `;
    return;
  }

  timeline.innerHTML = '';
  highlights.forEach((highlight) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${highlight.title}</strong>
      <span>${highlight.detail}</span>
    `;
    timeline.appendChild(li);
  });
}

function renderHistoryError(message) {
  const tbody = document.getElementById('history-table-body');
  const timeline = document.getElementById('history-timeline');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="5">${message}</td></tr>`;
  }
  if (timeline) {
    timeline.innerHTML = `
      <li>
        <strong>${message}</strong>
        <span>Please try again later.</span>
      </li>
    `;
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
    ...options
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

