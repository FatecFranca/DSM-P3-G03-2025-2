import { Router } from 'express'
import controller from '../controllers/mesas.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

// Nova rota protegida para cliente sair da mesa (usa token JWT)
router.post('/:id/sair', authenticateToken, controller.sairDaMesa)

export default router