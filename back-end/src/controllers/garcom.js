import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../database/client.js'
import { includeRelations } from '../lib/utils.js'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const SALT_ROUNDS = 10

const controller = {}   // Objeto vazio

controller.create = async function(req, res) {
  /*
    Conecta-se ao banco de dados e envia uma instrução
    de criação de um novo documento, contendo os dados
    que chegaram dentro da seção "body" da requisição
    ("req")
  */
  try {
    const data = { ...req.body }
    
    // Hash da senha se foi fornecida
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, SALT_ROUNDS)
    }

    await prisma.garcom.create({ data })

    // Envia um código de sucesso ao front-end
    // HTTP 201: Created
    res.status(201).end()
  }
  catch(error) {
    // Algo deu errado: exibe o erro no terminal
    console.error(error)

    // Envia o erro ao front-end, com código de erro
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.retrieveAll = async function(req, res) {
  try {

    const include = includeRelations(req.query)

    // Manda buscar todas os pedidos cadastradas no BD
    const result = await prisma.garcom.findMany({
      include,
      orderBy: [ { nome: 'asc' }]  // Ordem ASCendente
    })

    // Retorna os dados obtidos ao cliente com o status
    // HTTP 200: OK (implícito)
    res.send(result)
  }
  catch(error) {
    // Algo deu errado: exibe o erro no terminal
    console.error(error)

    // Envia o erro ao front-end, com código de erro
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.retrieveOne = async function(req, res) {
  try {

    const include = includeRelations(req.query)

    // Manda recuperar o documento no servidor de BD
    // usando como critério um id informado no parâmetro
    // da requisição
    const result = await prisma.garcom.findUnique({
      include,
      where: { id: req.params.id }
    })

    // Encontrou o docuemento ~> retorna HTTP 200: OK (implícito)
    if(result) res.send(result)
    // Não encontrou o documento ~> retorna HTTP 404: Not Found
    else res.status(404).end()
  }
  catch(error) {
    // Algo deu errado: exibe o erro no terminal
    console.error(error)

    // Envia o erro ao front-end, com código de erro
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.update = async function(req, res) {
  try {
    const data = { ...req.body }
    
    // Hash da senha se foi fornecida e não está vazia
    if (data.senha && data.senha.trim() !== '') {
      data.senha = await bcrypt.hash(data.senha, SALT_ROUNDS)
    } else {
      // Remove senha do objeto se estiver vazia (não atualizar)
      delete data.senha
    }

    // Busca o documento passado como parâmetro e, caso o documento seja
    // encontrado, atualiza-o com as informações contidas em req.body
    await prisma.garcom.update({
      where: { id: req.params.id },
      data
    })

    // Encontrou e atualizou ~> retorna HTTP 204: No Content
    res.status(204).end()
  }
  catch(error) {
    // Algo deu errado: exibe o erro no terminal
    console.error(error)

    // P2025: erro do Prisma referente a objeto não encontrado
    if(error?.code === 'P2025') {
      // Não encontrou e não atualizou ~> retorna HTTP 404: Not Found
      res.status(404).end()
    }
    else {    // Outros tipos de erro
      // Envia o erro ao front-end, com código de erro
      // HTTP 500: Internal Server Error
      res.status(500).send(error)
    }
  }
}

controller.delete = async function(req, res) {
  try {
    // Busca o documento pelo id passado como parâmetro
    // e efetua a exclusão, caso o documento seja encontrado
    await prisma.garcom.delete({
      where: { id: req.params.id }
    })

    // Encontrou e excluiu ~> retorna HTTP 204: No Content
    res.status(204).end()
  }
  catch(error) {
    // Algo deu errado: exibe o erro no terminal
    console.error(error)

    // P2025: erro do Prisma referente a objeto não encontrado
    if(error?.code === 'P2025') {
      // Não encontrou e não excluiu ~> retorna HTTP 404: Not Found
      res.status(404).end()
    }
    else {    // Outros tipos de erro
      // Envia o erro ao front-end, com código de erro
      // HTTP 500: Internal Server Error
      res.status(500).send(error)
    }
  }
}

// Login de Garçom
controller.login = async function(req, res) {
  try {
    const { email, senha } = req.body

    console.log('🔐 [GARÇOM] Tentativa de login:', email)

    if (!email) {
      console.log('❌ [GARÇOM] Email não fornecido')
      return res.status(400).json({ error: 'Email é obrigatório' })
    }

    // Buscar garçom por email
    const garcom = await prisma.garcom.findUnique({
      where: { email }
    })

    console.log('🔍 [GARÇOM] Garçom encontrado:', !!garcom)
    
    if (!garcom) {
      console.log('❌ [GARÇOM] Garçom não encontrado no banco')
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    console.log('🔐 [GARÇOM] Verificando senha...')
    console.log('   - Senha fornecida:', !!senha)
    console.log('   - Senha no banco:', !!garcom.senha)

    // Verificar senha (se fornecida e se existe no banco)
    if (senha && garcom.senha) {
      const senhaValida = await bcrypt.compare(senha, garcom.senha)
      console.log('🔑 [GARÇOM] Senha válida:', senhaValida)
      
      if (!senhaValida) {
        console.log('❌ [GARÇOM] Senha inválida')
        return res.status(401).json({ error: 'Credenciais inválidas' })
      }
    } else if (senha && !garcom.senha) {
      console.log('⚠️ [GARÇOM] Senha fornecida mas não há hash no banco')
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    console.log('✅ [GARÇOM] Login bem sucedido')

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: garcom.id, 
        email: garcom.email,
        garcom: true,
        tipo: 'garcom'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.json({
      token,
      user: {
        id: garcom.id,
        nome: garcom.nome,
        email: garcom.email,
        role: 'garcom'
      }
    })
  } catch (error) {
    console.error('❌ [GARÇOM] Erro no login:', error)
    res.status(500).json({ error: error.message })
  }
}

export default controller