const express = require('express');
const app = express();

app.use(express.json());

const patientRoutes = require('./src/routes/patientRoutes');
const labRoutes = require('./src/routes/labRoutes');

app.use('/api/patients', patientRoutes);
app.use('/api', labRoutes);

app.get('/', (req, res) => {
    res.send('Node.js Training API is running smoothly.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});