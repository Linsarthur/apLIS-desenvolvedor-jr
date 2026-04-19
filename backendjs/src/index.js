const express = require('express');
const cors = require('cors');

const pacientesRouter = require('./routes/pacientes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1/pacientes', pacientesRouter);

app.use((req, res) => {
    res.status(404).json({ error: `Rota não encontrada: ${req.path}` });
});

app.use((err, req, res, next) => {
    console.error('[Erro inesperado]', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
    console.log(`✅ Backend Node rodando em http://localhost:${PORT}`);
});