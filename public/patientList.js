document.addEventListener('DOMContentLoaded', () => {
    const patientList = document.getElementById('patientList');

    async function loadPatients() {
        try {
            const response = await axios.get('/api/patients'); // Appel de l'API pour récupérer les patients
            const patients = response.data;

            console.log('Patients reçus:', patients); // Vérifie la structure des données

            // Insertion des données dans le tableau avec un lien vers la page de mise à jour
            patientList.innerHTML = patients.map(patient => `
                <tr>
                     <td>${patient.patient_id || patient.PATIENT_ID}</td>
                    <td>${patient.first_name || patient.FIRST_NAME}</td>
                    <td>${patient.last_name || patient.LAST_NAME}</td>
                    <td>${patient.dob ? new Date(patient.dob).toLocaleDateString() : new Date(patient.DOB).toLocaleDateString()}</td>
                    <td>${patient.gender || patient.GENDER}</td>
                    <td>${patient.contact_info || patient.CONTACT_INFO}</td>
                    <td>${patient.address || patient.ADDRESS}</td>
                    <td>
                        <a href="updatePatientForm.html?patient_id=${patient.patient_id || patient.PATIENT_ID}">Modifier</a>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Erreur lors du chargement des patients:', error);
            alert('Erreur lors du chargement des patients.');
        }
    }

    // Charger la liste des patients lorsque la page est prête
    loadPatients();
});
