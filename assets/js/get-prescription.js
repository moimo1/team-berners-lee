document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('prescription-details-tbody');
    if (!tbody) return;

    fetch('../../controller/get-prescription.php', { credentials: 'same-origin' })
        .then(async res => {
            if (res.status === 401) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 24px; color: #dc2626;">Please log in to view prescriptions.</td></tr>';
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
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 24px; color: #64748b;">No prescription details found.</td></tr>';
                return;
            }

            data.forEach(item => {
                const row = document.createElement('tr');
                
                const formatDate = (dateString) => {
                    if (!dateString) return 'N/A';
                    try {
                        const date = new Date(dateString);
                        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
                    } catch (e) {
                        return dateString;
                    }
                };

                const extractFrequency = (dosage) => {
                    if (!dosage) return 'N/A';
                    const lower = dosage.toLowerCase();
                    if (lower.includes('once daily') || lower.includes('once a day')) return '1x/day';
                    if (lower.includes('twice') || lower.includes('2 times')) return '2x/day';
                    if (lower.includes('three times') || lower.includes('3 times')) return '3x/day';
                    if (lower.includes('every 6 hours')) return '4x/day';
                    if (lower.includes('every 8 hours')) return '3x/day';
                    if (lower.includes('every 12 hours')) return '2x/day';
                    return 'N/A';
                };

                const escapeHtml = (text) => {
                    if (!text) return '';
                    const div = document.createElement('div');
                    div.textContent = text;
                    return div.innerHTML;
                };

                const medicineName = escapeHtml(item.genericName || 'N/A');
                const dosage = escapeHtml(item.dosage || 'N/A');
                const frequency = extractFrequency(item.dosage);
                const remainingAmount = item.remainingAmount !== null && item.remainingAmount !== undefined ? item.remainingAmount : 'N/A';
                const totalAmount = 'N/A';
                const expiryDate = formatDate(item.dateExpiry);

                row.innerHTML = `
                    <td>${medicineName}</td>
                    <td>${dosage}</td>
                    <td>${frequency}</td>
                    <td>${totalAmount}</td>
                    <td>${remainingAmount}</td>
                    <td>${expiryDate}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 24px; color: #dc2626;">Error loading prescription details.</td></tr>';
            console.error('Failed to fetch prescription details:', err);
        });
});
