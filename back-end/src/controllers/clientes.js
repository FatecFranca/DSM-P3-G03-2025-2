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
    const dados = { ...req.body }
    
    // Hash da senha se fornecida
    if (dados.senha) {
      dados.senha = await bcrypt.hash(dados.senha, SALT_ROUNDS)
    }

    await prisma.cliente.create({ data: dados })

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
    const result = await prisma.cliente.findMany({
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
    const result = await prisma.cliente.findUnique({
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
    // Buscar cliente atual para verificar se mudou de mesa
    const clienteAtual = await prisma.cliente.findUnique({
      where: { id: req.params.id }
    })

    const mesaAntigaId = clienteAtual?.mesa_id
    const mesaNovaId = req.body.mesa_id

    // Busca o documento passado como parâmetro e, caso o documento seja
    // encontrado, atualiza-o com as informações contidas em req.body
    await prisma.cliente.update({
      where: { id: req.params.id },
      data: req.body
    })

    // Se mudou de mesa ou foi desvinculado, atualizar status das mesas afetadas
    if (mesaAntigaId !== mesaNovaId) {
      // Atualizar mesa antiga (se houver)
      if (mesaAntigaId) {
        const mesaAntiga = await prisma.mesa.findUnique({
          where: { id: mesaAntigaId },
          include: { clientes: true }
        })
        
        if (mesaAntiga) {
          // Verificar quantos clientes restaram na mesa antiga
          const totalClientesMesaAntiga = mesaAntiga.clientes.filter(c => c.id !== req.params.id).length
          const atingiuCapacidadeMaximaAntiga = totalClientesMesaAntiga >= mesaAntiga.capacidade
          
          await prisma.mesa.update({
            where: { id: mesaAntigaId },
            data: { 
              status: totalClientesMesaAntiga === 0 ? 'livre' : (atingiuCapacidadeMaximaAntiga ? 'ocupada' : 'livre')
            }
          })
        }
      }

      // Atualizar mesa nova (se houver)
      if (mesaNovaId) {
        const mesaNova = await prisma.mesa.findUnique({
          where: { id: mesaNovaId },
          include: { clientes: true }
        })
        
        if (mesaNova) {
          // Contar clientes incluindo o que acabou de ser vinculado
          const totalClientesMesaNova = mesaNova.clientes.length
          const atingiuCapacidadeMaximaNova = totalClientesMesaNova >= mesaNova.capacidade
          
          await prisma.mesa.update({
            where: { id: mesaNovaId },
            data: { 
              status: atingiuCapacidadeMaximaNova ? 'ocupada' : 'livre'
            }
          })
        }
      }
    }

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
    // Buscar cliente para verificar se está vinculado a uma mesa
    const cliente = await prisma.cliente.findUnique({
      where: { id: req.params.id }
    })

    const mesaId = cliente?.mesa_id

    // Busca o documento pelo id passado como parâmetro
    // e efetua a exclusão, caso o documento seja encontrado
    await prisma.cliente.delete({
      where: { id: req.params.id }
    })

    // Se cliente estava vinculado a uma mesa, atualizar status da mesa
    if (mesaId) {
      const mesa = await prisma.mesa.findUnique({
        where: { id: mesaId },
        include: { clientes: true }
      })
      
      if (mesa) {
        // Verificar quantos clientes restaram na mesa
        const totalClientes = mesa.clientes.length
        const atingiuCapacidadeMaxima = totalClientes >= mesa.capacidade
        
        await prisma.mesa.update({
          where: { id: mesaId },
          data: { 
            status: totalClientes === 0 ? 'livre' : (atingiuCapacidadeMaxima ? 'ocupada' : 'livre')
          }
        })
      }
    }

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

// Login de Cliente
controller.login = async function(req, res) {
  try {
    const { email, senha } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' })
    }

    // Buscar cliente por email
    const cliente = await prisma.cliente.findUnique({
      where: { email }
    })

    if (!cliente) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    // Verificar senha (se fornecida e se existe no banco)
    if (senha && cliente.senha) {
      const senhaValida = await bcrypt.compare(senha, cliente.senha)
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' })
      }
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: cliente.id, 
        email: cliente.email,
        admin: cliente.admin,
        tipo: 'cliente'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.json({
      token,
      user: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        admin: cliente.admin,
        role: cliente.admin ? 'admin' : 'cliente'
      }
    })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ error: error.message })
  }
}

// Registro de Cliente
controller.register = async function(req, res) {
  try {
    const { nome, email, senha, cpf, celular } = req.body

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' })
    }

    // Verificar se email já existe
    const existente = await prisma.cliente.findUnique({
      where: { email }
    })

    if (existente) {
      return res.status(409).json({ error: 'Email já cadastrado' })
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS)

    // Criar cliente
    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        cpf,
        celular,
        admin: false
      }
    })

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: cliente.id, 
        email: cliente.email,
        admin: false,
        tipo: 'cliente'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.status(201).json({
      token,
      user: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        admin: false,
        role: 'cliente'
      }
    })
  } catch (error) {
    console.error('Erro no registro:', error)
    res.status(500).json({ error: error.message })
  }
}

// Verificar token
controller.verifyToken = async function(req, res) {
  try {
    res.json({ 
      valid: true, 
      user: req.user 
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default controller