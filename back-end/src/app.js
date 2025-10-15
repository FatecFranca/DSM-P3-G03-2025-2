import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'

const app = express()

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)
app.use('/users', usersRouter)


//-------------- ROTAS ---------  //

import usuariosRouter from './routes/usuarios.js'
app.use('/usuarios' , usuariosRouter)

import mesasRouter from './routes/mesas.js'
app.use('mesas' , mesasRouter)

import pedidosRouter from './routes/pedidos.js'
app.use('/pedidos' , pedidosRouter)

import produtosRouter from './routes/produtos.js'
app.use('/produtos' , produtosRouter)

import garcomRouter from './routes/garcom.js'
app.use('/garcom' , garcomRouter)

export default app
