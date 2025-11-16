import { Router } from 'express'
import mesasRoutes from './mesas.js'
import pedidosRoutes from './pedidos.js'
import produtosRoutes from './produtos.js'
import categoriasRoutes from './categorias.js'
import clientesRoutes from './clientes.js'
import garconsRoutes from './garcom.js'
import fornecedoresRoutes from './fornecedores.js'

const router = Router()

// Rotas de autenticação estão agora nos respectivos controllers
// /clientes/login, /clientes/register, /clientes/verify
// /garcons/login

router.use('/mesas', mesasRoutes)
router.use('/pedidos', pedidosRoutes)
router.use('/produtos', produtosRoutes)
router.use('/categorias', categoriasRoutes)
router.use('/clientes', clientesRoutes)
router.use('/garcons', garconsRoutes)
router.use('/fornecedores', fornecedoresRoutes)

export default router
