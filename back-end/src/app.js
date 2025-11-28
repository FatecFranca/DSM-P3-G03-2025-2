import express from 'express'
import cors from 'cors'
import routes from './routes/index.js' 

const app = express()

// Configuração CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))

// Middleware para parsing de JSON
app.use(express.json())

// Rotas (As rotas estão em index.js)
app.use(routes)

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' })
})

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erro interno do servidor' })
})

export default app
