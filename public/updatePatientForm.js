document.addEventListener('DOMContentLoaded', async () => {
    const updatePatientForm = document.getElementById('updatePatientForm');
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patient_id');

    if (patientId) {
        try {
            // Récupérer les informations du patient en utilisant l'ID
            const response = await axios.get(`/api/patients/${patientId}/medical-record`);
            console.log('Response received:', response.data);

            const patient = response.data[0]; // Accès au premier élément du tableau

            if (!patient) {
                alert('Patient non trouvé.');
                return;
            }

            // Pré-remplir le formulaire avec les informations du patient
            document.getElementById('patientId').value = patient.patient_id || patient.PATIENT_ID;
            document.getElementById('firstName').value = patient.first_name || patient.FIRST_NAME;
            document.getElementById('lastName').value = patient.last_name || patient.LAST_NAME;
            document.getElementById('dob').value = patient.dob || patient.DOB;
            document.getElementById('gender').value = patient.gender || patient.GENDER;
            document.getElementById('contactInfo').value = patient.contact_info || patient.CONTACT_INFO;
            document.getElementById('address').value = patient.address || patient.ADDRESS;
            document.getElementById('medicalRecordNumber').value = patient.medical_record_number || patient.MEDICAL_RECORD_NUMBER;
            document.getElementById('emergencyContact').value = patient.emergency_contact || patient.EMERGENCY_CONTACT;
        } catch (error) {
            console.error('Erreur lors de la récupération des informations du patient:', error);
            alert('Erreur lors de la récupération des informations du patient.');
        }
    }

    // Soumission du formulaire pour mise à jour
    updatePatientForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        
        const formData = new FormData(updatePatientForm);

        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            dob: formData.get('dob'),
            gender: formData.get('gender'),
            contactInfo: formData.get('contactInfo'),
            address: formData.get('address'),
            medicalRecordNumber: formData.get('medicalRecordNumber'),
            emergencyContact: formData.get('emergencyContact')
        };
        
        try {
            // Utiliser PUT pour mettre à jour les informations du patient
            const response = await axios.put(`/api/patients/${patientId}/medical-record`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Response received:', response.data);
            alert('Les informations du patient ont été mises à jour avec succès.');

            // Vider le formulaire
            updatePatientForm.reset();

            // Rediriger vers la page patientList.html
            window.location.href = 'patientList.html';
        } catch (error) {
            console.error('Erreur lors de la mise à jour des informations du patient:', error);
            alert('Erreur lors de la mise à jour des informations du patient.');
        }
    });
});
