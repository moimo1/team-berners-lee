document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('prescription-details-tbody');
    if (!tbody) return;

    fetch('../../controller/get-prescription.php', { credentials: 'same-origin' })
        .then(async res => {
            if (res.status === 401) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align:center; padding:24px; color:#dc2626;">
                            Please log in to view prescriptions.
                        </td>
                    </tr>`;
                return null;
            }
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(`Request failed (${res.status}): ${text}`);
            }
            return res.json();
        })
        .then(data => {
            if (data === null) return;
            tbody.innerHTML = '';

            if (!Array.isArray(data) || data.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align:center; padding:24px; color:#64748b;">
                            No prescription details found.
                        </td>
                    </tr>`;
                return;
            }

            data.forEach(item => {
                const row = document.createElement('tr');

                const formatDate = dateStr => {
                    if (!dateStr) return 'N/A';
                    const d = new Date(dateStr);
                    return isNaN(d) ? 'N/A' : d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
                };

                const extractFrequency = dosage => {
                    if (!dosage) return 'N/A';
                    const lower = dosage.toLowerCase();
                    if (lower.includes('once')) return '1x/day';
                    if (lower.includes('twice')) return '2x/day';
                    if (lower.includes('three')) return '3x/day';
                    if (lower.includes('every 6')) return '4x/day';
                    if (lower.includes('every 8')) return '3x/day';
                    if (lower.includes('every 12')) return '2x/day';
                    return 'N/A';
                };

                const escape = str => {
                    const div = document.createElement('div');
                    div.textContent = str || '';
                    return div.innerHTML;
                };

                row.innerHTML = `
                    <td>${escape(item.genericName) || 'N/A'}</td>
                    <td>${escape(item.dosage) || 'N/A'}</td>
                    <td>${extractFrequency(item.dosage)}</td>
                    <td>N/A</td>
                    <td>${item.remainingAmount ?? 'N/A'}</td>
                    <td>${formatDate(item.dateExpiry)}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => {
            console.error('Failed to fetch prescription details:', err);
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; padding:24px; color:#dc2626;">
                        Error loading prescription details.
                    </td>
                </tr>`;
        });
});
