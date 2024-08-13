document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('patientForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
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

        axios.post('/api/patients/register', data)
            .then(response => {
                // Utilisation correcte de la réponse reçue
                document.getElementById('response').innerText = response.data.message;
                alert('Patient registered successfully!');
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('response').innerText = 'Erreur: ' + error.response.data.message;
                alert('Failed to register patient.');
            });
    });
});
