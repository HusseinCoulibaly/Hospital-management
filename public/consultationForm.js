document.addEventListener('DOMContentLoaded', () => {
    const consultationForm = document.getElementById('consultationForm');
    consultationForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        
        const formData = new FormData(consultationForm);
        const data = {
            medicalRecordNumber: formData.get('medicalRecordNumber'),
            doctorId: formData.get('doctorId'),
            dateOfVisit: formData.get('dateOfVisit'),
            notes: formData.get('notes')
        };

        try {
            const response = await axios.post('/api/consultations/add', data);
            document.getElementById('response').innerText = response.data.message;
            consultationForm.reset();
        } catch (error) {
            document.getElementById('response').innerText = 'Erreur: ' + (error.response?.data?.message || error.message);
        }
    });

    const historyForm = document.getElementById('consultationHistoryForm');
    historyForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        
        const medicalRecordNumber = document.getElementById('treatmentMedicalRecordNumber').value;

        try {
            const historyDiv = document.getElementById('history');
            
            // Si le bouton "Consultations" est cliqué
            if (event.submitter.innerText === 'Consultations') {
                const response = await axios.get(`/api/consultations/history/${medicalRecordNumber}`);
                const history = response.data;

                historyDiv.innerHTML = `
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${history.map(entry => `
                                <tr>
                                    <td>${new Date(entry.date_of_consultation).toLocaleDateString()}</td>
                                    <td>${entry.notes}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
            // Si le bouton "Traitements" est cliqué
            else if (event.submitter.innerText === 'Traitements') {
                const response = await axios.get(`/api/treatments/history/${medicalRecordNumber}`);
                const history = response.data;

                historyDiv.innerHTML = `
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Traitement</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${history.map(entry => `
                                <tr>
                                    <td>${new Date(entry.date_of_visit).toLocaleDateString()}</td>
                                    <td>${entry.details}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        } catch (error) {
            document.getElementById('history').innerText = 'Erreur: ' + (error.response?.data?.message || error.message);
        }
    });
});
