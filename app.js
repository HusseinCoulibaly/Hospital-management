require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./dbConnection'); // Importez la connexion Snowflake


const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');

// Servir les fichiers statiques depuis le répertoire 'Scripts'
app.use(express.static(path.join(__dirname, 'public')));

const cors = require('cors');
app.use(cors());
app.use((req, res, next) => {
    req.dbConnection = connection;
    next();
  });
app.use(bodyParser.json());

// Middleware pour transmettre la connexion à toutes les routes


const patientRoutes = require('./routes/patientsRoute');
const consultationRoutes = require('./routes/consultationsRoute');
const treatmentHistoryRoute = require('./routes/treatmentHistoryRoute');

app.use('/api/treatments', treatmentHistoryRoute);
app.use('/api/patients', patientRoutes);
app.use('/api/consultations', consultationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
