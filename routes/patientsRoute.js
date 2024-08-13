const express = require('express');
const router = express.Router();

// Enregistrement d'un patient
router.post('/register', async (req, res) => {
  const { firstName, lastName, dob, gender, contactInfo, address, medicalRecordNumber, emergencyContact } = req.body;

  const sql = `INSERT INTO patients (first_name, last_name, dob, gender, contact_info, address, medical_record_number, emergency_contact, FL) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`; 

  req.dbConnection.execute({
    sqlText: sql,
    binds: [firstName, lastName, dob, gender, contactInfo, address, medicalRecordNumber, emergencyContact],
    complete: function (err, stmt, rows) {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(201).json({ message: 'Patient enregistré avec succès' });
      }
    }
  });
});


router.get('/:id/medical-record', (req, res) => {
  const sql = `SELECT * FROM patients WHERE patient_id = ?`;

  req.dbConnection.execute({
    sqlText: sql,
    binds: [req.params.id],
    complete: function (err, stmt, rows) {
      if (err) {
        res.status(500).json({ message: err.message });
      } else if (rows.length === 0) {
        res.status(404).json({ message: 'Patient non trouvé' });
      } else {
        res.json(rows);  // Retourne l'objet patient trouvé
      }
    }
  });
});
router.put('/:id/medical-record', (req, res) => {
  const { firstName, lastName, dob, gender, contactInfo, address, medicalRecordNumber, emergencyContact } = req.body;

  const sql = `UPDATE patients SET first_name = ?, last_name = ?, dob = ?, gender = ?, contact_info = ?, address = ?, medical_record_number = ?, emergency_contact = ?, FL = 2
               WHERE patient_id = ?`;

  req.dbConnection.execute({
    sqlText: sql,
    binds: [firstName, lastName, dob, gender, contactInfo, address, medicalRecordNumber, emergencyContact, req.params.id],
    complete: function (err, stmt, rows) {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        res.json({ message: 'Dossier médical mis à jour avec succès' });
      }
    }
  });
});

router.get('/', (req, res) => {
  const sql = `SELECT patient_id ,first_name, last_name, dob, gender, contact_info, address FROM patients`;

  req.dbConnection.execute({
    sqlText: sql,
    complete: function (err, stmt, rows) {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.json(rows);
      }
    }
  });
});


module.exports = router;
