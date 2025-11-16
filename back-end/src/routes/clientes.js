import { Router } from 'express'
import controller from '../controllers/clientes.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// Rotas de autenticação (públicas)
router.post('/login', controller.login)
router.post('/register', controller.register)
router.get('/verify', authenticateToken, controller.verifyToken)

// Rotas CRUD
router.post('/', controller.create)
router.get('/', controller.retrieveAll)

// :id é um PARÂMETRO DE ROTA, isto é, uma informação não fixa
// que será enviado ao back-end na própria rota
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

export default router