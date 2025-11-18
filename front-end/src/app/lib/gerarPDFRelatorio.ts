import jsPDF from 'jspdf';

interface DadosRelatorio {
  receitaTotal: number;
  receitaMes: number;
  receitaHoje: number;
  totalPedidos: number;
  pedidosMes: number;
  pedidosHoje: number;
}

/**
 * Função auxiliar para formatar valores monetários
 */
const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

/**
 * Função auxiliar para desenhar um card no PDF
 */
function desenharCard(
  doc: jsPDF, 
  y: number,
  { titulo, valor, detalhes }: { titulo: string; valor: string; detalhes: string }
): number {
  // Fundo do card (cinza claro)
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.rect(15, y, 180, 20, 'FD');

  // Título (cinza médio)
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(titulo, 20, y + 6);

  // Valor (PRETO - destaque)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(valor, 20, y + 13);

  // Detalhes (cinza claro)
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(detalhes, 185, y + 12, { align: 'right' });

  return y + 22; // Retorna próxima posição Y
}

/**
 * Gera um PDF com o relatório de receitas
 */
export function gerarPDFRelatorio(dados: DadosRelatorio): void {
  try {
    console.log('📊 Iniciando geração de relatório PDF no frontend...');

    // Criar documento PDF (A4)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let currentY = 20;

    // === CABEÇALHO ===
    doc.setTextColor(37, 99, 235); // Azul
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatorio de Receitas', 105, currentY, { align: 'center' });

    currentY += 10;

    // Data de geração
    doc.setTextColor(107, 114, 128); // Cinza
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dataGeracao = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Gerado em: ${dataGeracao}`, 105, currentY, { align: 'center' });

    currentY += 15;

    // === LINHA SEPARADORA ===
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(15, currentY, 195, currentY);

    currentY += 10;

    // === SEÇÃO: MÉTRICAS PRINCIPAIS ===
    doc.setTextColor(31, 41, 55); // Preto suave
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Financeiro', 15, currentY);

    currentY += 8;

    // Card: Receita Hoje
    currentY = desenharCard(doc, currentY, {
      titulo: 'Receita Hoje',
      valor: formatarMoeda(dados.receitaHoje),
      detalhes: `${dados.pedidosHoje} pedido(s)`
    });

    currentY += 2;

    // Card: Receita do Mês
    currentY = desenharCard(doc, currentY, {
      titulo: 'Receita do Mes',
      valor: formatarMoeda(dados.receitaMes),
      detalhes: `${dados.pedidosMes} pedido(s)`
    });

    currentY += 2;

    // Card: Receita Total
    currentY = desenharCard(doc, currentY, {
      titulo: 'Receita Total',
      valor: formatarMoeda(dados.receitaTotal),
      detalhes: `${dados.totalPedidos} pedido(s)`
    });

    currentY += 2;

    // Card: Ticket Médio
    const ticketMedio = dados.totalPedidos > 0 
      ? dados.receitaTotal / dados.totalPedidos 
      : 0;

    currentY = desenharCard(doc, currentY, {
      titulo: 'Ticket Medio',
      valor: formatarMoeda(ticketMedio),
      detalhes: 'Por pedido'
    });

    currentY += 10;

    // === LINHA SEPARADORA ===
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(15, currentY, 195, currentY);

    currentY += 8;

    // === SEÇÃO: INFORMAÇÕES ADICIONAIS ===
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Informacoes Detalhadas', 15, currentY);

    currentY += 8;

    // Informações detalhadas
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    const infos = [
      `• Total de pedidos no sistema: ${dados.totalPedidos}`,
      `• Pedidos realizados hoje: ${dados.pedidosHoje}`,
      `• Pedidos realizados este mes: ${dados.pedidosMes}`,
      `• Periodo do mes: ${primeiroDiaMes.toLocaleDateString('pt-BR')} ate ${hoje.toLocaleDateString('pt-BR')}`
    ];

    infos.forEach(info => {
      doc.text(info, 20, currentY);
      currentY += 5;
    });

    currentY += 15;

    // === RODAPÉ ===
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('________________________________________', 105, currentY, { align: 'center' });
    
    currentY += 4;
    
    doc.text('Relatorio gerado automaticamente pelo Sistema de Restaurante', 105, currentY, { align: 'center' });
    
    currentY += 4;
    
    doc.text('DSM-P3-G03-2025-2', 105, currentY, { align: 'center' });

    // === SALVAR PDF ===
    const nomeArquivo = `relatorio-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nomeArquivo);

    console.log('✅ PDF gerado com sucesso no frontend!');
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    throw new Error('Erro ao gerar relatório PDF');
  }
}
