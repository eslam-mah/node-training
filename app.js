const express = require('express');
const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

const patientRoutes = require('./src/routes/patientRoutes');

app.use('/patients', patientRoutes);
app.use( radiologyRoutes);
app.get('/', (req, res) => {
    res.send('Node.js Training API is running smoothly.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
 
