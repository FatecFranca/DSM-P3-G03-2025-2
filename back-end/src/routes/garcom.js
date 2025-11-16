import { Router } from 'express'
import controller from '../controllers/garcom.js'

const router = Router()

// Rota de autenticação (pública)
router.post('/login', controller.login)

// Rotas CRUD
router.post('/', controller.create)
router.get('/', controller.retrieveAll)

// :id é um PARÂMETRO DE ROTA, isto é, uma informação não fixa
// que será enviada ao back-end na própria rota
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

export default router