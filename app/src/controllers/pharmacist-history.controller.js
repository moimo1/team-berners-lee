import { getHistory } from '../services/pharmacist-history.service.js';

/**
 * Controller: HTTP request/response handling for pharmacist history
 */

export async function getPharmacistHistory(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Pharmacist ID is required' });
        }

        const history = await getHistory(id);

        res.json({ success: true, data: history });
    } catch (error) {
        console.error('getPharmacistHistory error', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve history' });
    }
}
