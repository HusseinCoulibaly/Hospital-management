const express = require('express');
const router = express.Router();

// Afficher l'historique des traitements par numéro de dossier médical
router.get('/history/:medicalRecordNumber', (req, res) => {
    const sql = `SELECT t.date_of_visit, t.treatment 
                 FROM HOPITAUX.PUBLIC.MEDICAL_RECORDS t
                 JOIN HOPITAUX.PUBLIC.PATIENTS p ON t.patient_id = p.patient_id
                 WHERE p.medical_record_number = ?`;

    req.dbConnection.execute({
        sqlText: sql,
        binds: [req.params.medicalRecordNumber],
        complete: function (err, stmt, rows) {
            if (err) {
                console.error('Erreur lors de la récupération de l\'historique des traitements:', err.message);
                res.status(500).json({ message: 'Erreur de base de données: ' + err.message });
            } else if (rows.length === 0) {
                res.status(404).json({ message: 'Aucun traitement trouvé pour ce patient' });
            } else {
                const formattedRows = rows.map(row => ({
                    date_of_visit: row.DATE_OF_VISIT.toISOString(), // Convertir en ISO string
                    details: row.TREATMENT
                }));
                
                console.log('Historique des traitements:', formattedRows);
                res.json(formattedRows);
            }
        }
    });
});

module.exports = router;
