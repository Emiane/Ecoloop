import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur fonctionnel' })
})

app.listen(PORT, () => {
  console.log(`🚀 Serveur de test démarré sur le port ${PORT}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
})
