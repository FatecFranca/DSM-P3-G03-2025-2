import prisma from '../database/client.js'
import { includeRelations } from '../lib/utils.js'
const controller = {}

controller.create = async function(req, res) {
  try {
    await prisma.mesa.create({ data: req.body })
    res.status(201).end()
  }
  catch(error) {
    console.error(error)
    res.status(500).send(error)
  }
}

controller.retrieveAll = async function(req, res) {
  try {
    const include = includeRelations(req.query)
    const result = await prisma.mesa.findMany({
      include,
      orderBy: [ { numero: 'asc' }]
    })

    console.log(`📋 Carregando ${result.length} mesa(s)...`)

    // Para cada mesa, sempre recalcular o total baseado nos pedidos vinculados
    for (const mesa of result) {
      const pedidos = await prisma.pedido.findMany({
        where: { mesa_id: mesa.id }
      })
      
      const totalCalculado = pedidos.reduce((sum, p) => sum + p.valor, 0)
      
      console.log(`Mesa ${mesa.numero_mesa}: ${pedidos.length} pedido(s), Total calculado: R$ ${totalCalculado.toFixed(2)}, Total no banco: R$ ${mesa.total.toFixed(2)}`)
      
      // Atualizar se houver diferença significativa
      if (Math.abs(mesa.total - totalCalculado) > 0.01) {
        console.log(`🔄 Atualizando total da mesa ${mesa.numero_mesa} de R$ ${mesa.total.toFixed(2)} para R$ ${totalCalculado.toFixed(2)}`)
        await prisma.mesa.update({
          where: { id: mesa.id },
          data: { total: totalCalculado }
        })
        mesa.total = totalCalculado
      }
    }

    res.send(result)
  }
  catch(error) {
    console.error(error)
    res.status(500).send(error)
  }
}

controller.retrieveOne = async function(req, res) {
  try {
    const include = includeRelations(req.query)
    const result = await prisma.mesa.findUnique({
      include,
      where: { id: req.params.id }
    })

    if (result) {
      // Sempre buscar pedidos vinculados para calcular total correto
      const pedidos = await prisma.pedido.findMany({
        where: { mesa_id: result.id }
      })
      
      console.log(`📊 Mesa ${result.numero_mesa}: ${pedidos.length} pedido(s) vinculado(s)`)
      
      // Calcular total baseado nos pedidos
      const totalCalculado = pedidos.reduce((sum, p) => sum + p.valor, 0)
      console.log(`💰 Total calculado: R$ ${totalCalculado.toFixed(2)}`)
      console.log(`💾 Total no banco: R$ ${result.total.toFixed(2)}`)
      
      // Atualizar se houver diferença significativa
      if (Math.abs(result.total - totalCalculado) > 0.01) {
        console.log(`🔄 Atualizando total da mesa de R$ ${result.total.toFixed(2)} para R$ ${totalCalculado.toFixed(2)}`)
        await prisma.mesa.update({
          where: { id: result.id },
          data: { total: totalCalculado }
        })
        result.total = totalCalculado
      }

      res.send(result)
    } else {
      res.status(404).end()
    }
  }
  catch(error) {
    console.error(error)
    res.status(500).send(error)
  }
}

controller.update = async function(req, res) {
  try {
    // Se estiver liberando a mesa (status = "livre"), zerar o total
    if (req.body.status === 'livre') {
      req.body.total = 0
      console.log('🔄 Mesa sendo liberada - total zerado')
    }

    await prisma.mesa.update({
      where: { id: req.params.id },
      data: req.body
    })

    res.status(204).end()
  }
  catch(error) {
    console.error(error)
    if(error?.code === 'P2025') {
      res.status(404).end()
    }
    else {
      res.status(500).send(error)
    }
  }
}

controller.delete = async function(req, res) {
  try {
    await prisma.mesa.delete({
      where: { id: req.params.id }
    })
    res.status(204).end()
  }
  catch(error) {
    console.error(error)
    if(error?.code === 'P2025') {
      res.status(404).end()
    }
    else {
      res.status(500).send(error)
    }
  }
}

// Nova função para cliente sair da mesa (desvincular apenas o cliente logado)
controller.sairDaMesa = async function(req, res) {
  try {
    const mesaId = req.params.id
    const clienteId = req.user.id // ID do cliente vem do token JWT (middleware authenticateToken)

    console.log('🚪 Cliente saindo da mesa:', { mesaId, clienteId })

    // 1. Buscar dados da mesa atual
    const mesaAtual = await prisma.mesa.findUnique({
      where: { id: mesaId },
      include: { 
        pedidos: true,
        clientes: true 
      }
    })

    if (!mesaAtual) {
      return res.status(404).json({ message: 'Mesa não encontrada' })
    }

    // 2. Verificar se o cliente está vinculado a esta mesa
    const clienteNaMesa = await prisma.cliente.findFirst({
      where: { 
        id: clienteId,
        mesa_id: mesaId 
      }
    })

    if (!clienteNaMesa) {
      return res.status(400).json({ 
        message: 'Você não está vinculado a esta mesa' 
      })
    }

    // 3. Buscar pedidos do cliente nesta mesa (assumindo que temos uma forma de identificar)
    // PROBLEMA: Schema atual não tem cliente_id em Pedido
    // Solução temporária: Assumir que todos os pedidos não pagos são do último cliente
    // Melhor solução: Adicionar cliente_id ao schema de Pedido
    
    // Por enquanto, vamos trabalhar com a lógica de que quando um cliente sai,
    // ele deve ter pagado todos os seus pedidos, então desvinculamos apenas os pedidos pagos
    const pedidosPagosDaMesa = mesaAtual.pedidos.filter(p => p.pagamento === 'pago')
    
    console.log(`📊 Mesa ${mesaAtual.numero_mesa}:`, {
      totalClientes: mesaAtual.clientes.length,
      totalPedidos: mesaAtual.pedidos.length,
      pedidosPagos: pedidosPagosDaMesa.length
    })

    // 4. Desvincular apenas este cliente
    await prisma.cliente.update({
      where: { id: clienteId },
      data: { mesa_id: null }
    })
    console.log(`✅ Cliente ${clienteNaMesa.nome} desvinculado da mesa`)

    // 5. Buscar quantos clientes restam na mesa
    const clientesRestantes = await prisma.cliente.count({
      where: { mesa_id: mesaId }
    })

    console.log(`👥 Clientes restantes na mesa: ${clientesRestantes}`)

    // 6. Se não há mais clientes na mesa, liberar a mesa completamente
    if (clientesRestantes === 0) {
      console.log('🔄 Nenhum cliente restante - liberando mesa completamente')
      
      // Desvincular todos os pedidos pagos (mantém no histórico)
      if (pedidosPagosDaMesa.length > 0) {
        await prisma.pedido.updateMany({
          where: { 
            mesa_id: mesaId,
            pagamento: 'pago'
          },
          data: { mesa_id: null }
        })
        console.log(`✅ ${pedidosPagosDaMesa.length} pedido(s) pago(s) desvinculado(s) (mantidos no histórico)`)
      }

      // Liberar a mesa (status = livre, total = 0)
      await prisma.mesa.update({
        where: { id: mesaId },
        data: {
          status: 'livre',
          total: 0
        }
      })
      console.log('✅ Mesa liberada e zerada')

      return res.status(200).json({ 
        message: 'Você saiu da mesa com sucesso. Mesa foi liberada.',
        mesaLiberada: true,
        pedidosDesvinculados: pedidosPagosDaMesa.length,
        valorTotalHistorico: mesaAtual.total
      })
    } 
    // 7. Se ainda há clientes, apenas atualizar o total da mesa
    else {
      console.log('👥 Ainda há clientes na mesa - recalculando total')
      
      // Recalcular total baseado nos pedidos restantes não pagos
      const pedidosRestantes = await prisma.pedido.findMany({
        where: { mesa_id: mesaId }
      })
      
      const novoTotal = pedidosRestantes.reduce((sum, p) => sum + p.valor, 0)
      
      await prisma.mesa.update({
        where: { id: mesaId },
        data: { total: novoTotal }
      })
      
      console.log(`💰 Total da mesa atualizado: R$ ${novoTotal.toFixed(2)}`)

      // Verificar se deve mudar o status da mesa
      const novoStatus = clientesRestantes >= mesaAtual.capacidade ? 'ocupada' : 'livre'
      
      if (novoStatus !== mesaAtual.status) {
        await prisma.mesa.update({
          where: { id: mesaId },
          data: { status: novoStatus }
        })
        console.log(`🔄 Status da mesa atualizado para: ${novoStatus}`)
      }

      return res.status(200).json({ 
        message: 'Você saiu da mesa com sucesso',
        mesaLiberada: false,
        clientesRestantes: clientesRestantes,
        novoTotal: novoTotal
      })
    }
  }
  catch(error) {
    console.error('❌ Erro ao sair da mesa:', error)
    res.status(500).send(error)
  }
}

export default controller