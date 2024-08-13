const express = require('express');
const router = express.Router();

// Enregistrer une consultation
router.post('/add', async (req, res) => {
    const { medicalRecordNumber, doctorId, dateOfVisit, notes } = req.body;

    // Requête pour récupérer l'ID du patient à partir du numéro de dossier médical
    const patientSql = `SELECT patient_id FROM HOPITAUX.PUBLIC.PATIENTS WHERE medical_record_number = ?`;

    req.dbConnection.execute({
        sqlText: patientSql,
        binds: [medicalRecordNumber],
        complete: function (err, stmt, rows) {
            if (err) {
                console.error('Erreur lors de la récupération du patient:', err.message);
                return res.status(500).json({ message: 'Erreur de base de données: ' + err.message });
            } else if (rows.length === 0) {
                return res.status(404).json({ message: 'Patient non trouvé' });
            } else {
                const patientId = rows[0].PATIENT_ID;

                // Requête pour insérer une nouvelle consultation
                const sql = `INSERT INTO HOPITAUX.PUBLIC.CONSULTATION_HISTORY (patient_id, doctor_id, date_of_consultation, notes) 
                             VALUES (?, ?, ?, ?)`;

                req.dbConnection.execute({
                    sqlText: sql,
                    binds: [patientId, doctorId, dateOfVisit, notes],
                    complete: function (err, stmt, rows) {
                        if (err) {
                            console.error('Erreur lors de l\'insertion:', err.message);
                            res.status(400).json({ message: 'Erreur lors de l\'insertion: ' + err.message });
                        } else {
                            res.status(201).json({ message: 'Consultation enregistrée avec succès' });
                        }
                    }
                });
            }
        }
    });
});

// Afficher l'historique des consultations par numéro de dossier médical
router.get('/history/:medicalRecordNumber', (req, res) => {
    const sql = `SELECT ch.date_of_consultation, ch.notes 
                 FROM HOPITAUX.PUBLIC.CONSULTATION_HISTORY ch
                 JOIN HOPITAUX.PUBLIC.PATIENTS p ON ch.patient_id = p.patient_id
                 WHERE p.medical_record_number = ?`;

    req.dbConnection.execute({
        sqlText: sql,
        binds: [req.params.medicalRecordNumber],
        complete: function (err, stmt, rows) {
            if (err) {
                console.error('Erreur lors de la récupération de l\'historique:', err.message);
                res.status(500).json({ message: 'Erreur de base de données: ' + err.message });
            } else if (rows.length === 0) {
                res.status(404).json({ message: 'Aucune consultation trouvée pour ce patient' });
            } else {
                // Convertir les dates au format ISO string
                const formattedRows = rows.map(row => ({
                    date_of_consultation: row.DATE_OF_CONSULTATION.toJSON(), // Convertir en ISO string
                    notes: row.NOTES
                }));
                
                console.log('Historique des consultations:', formattedRows); // Log pour vérifier les données retournées
                res.json(formattedRows);
            }
        }
    });
});


module.exports = router;
