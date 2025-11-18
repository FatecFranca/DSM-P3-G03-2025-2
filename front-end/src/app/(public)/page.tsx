import Link from 'next/link';
import { Button } from '@/src/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/components/ui/card';
import { Badge } from '@/src/app/components/ui/badge';

import {
  Zap,
  Shield,
  BarChart3,
  Users,
  Package,
  Clock,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  QrCode,
  Search,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: 'Gestão Rápida e Eficiente',
      description: 'Controle completo de pedidos, mesas e produtos em tempo real com interface intuitiva.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    // ... (demais features mantidas iguais)
    {
      icon: BarChart3,
      title: 'Dashboard Inteligente',
      description: 'Visualize métricas importantes e tome decisões baseadas em dados reais do seu negócio.',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description: 'Seus dados protegidos com criptografia de ponta e backup automático na nuvem.',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: Users,
      title: 'Gestão de Equipe',
      description: 'Controle de permissões, histórico de atendimentos e relatórios por colaborador.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
    {
      icon: Package,
      title: 'Controle de Estoque',
      description: 'Gerencie produtos, fornecedores e receba alertas automáticos de estoque baixo.',
      color: 'text-amber-500',
      bgColor: 'bg-amber-100',
    },
    {
      icon: Clock,
      title: 'Atendimento 24/7',
      description: 'Suporte técnico disponível sempre que você precisar, por chat, email ou telefone.',
      color: 'text-rose-500',
      bgColor: 'bg-rose-100',
    },
  ];

  const benefits = [
    'Agilize o atendimento e reduza o tempo de espera dos seus clientes',
    'Minimize erros humanos no processo de anotação e envio de pedidos',
    'Automatize tarefas repetitivas e libere sua equipe para o que realmente importa',
    'Proporcione uma experiência moderna e personalizada aos seus clientes',
    'Tenha insights valiosos sobre o desempenho do seu negócio em tempo real',
    'Simplifique o processo de pagamento com múltiplas opções integradas',
  ];

  const plans = [
    // ... (planos mantidos iguais)
    {
      name: 'Básico',
      price: 'Grátis',
      description: 'Ideal para começar',
      features: [
        'Até 5 mesas',
        'Pedidos ilimitados',
        'Relatórios básicos',
        'Suporte por email',
      ],
      highlighted: false,
    },
    {
      name: 'Profissional',
      price: 'R$ 99',
      description: 'Perfeito para crescer',
      features: [
        'Mesas ilimitadas',
        'Dashboard avançado',
        'Relatórios completos',
        'Suporte prioritário',
        'Integrações',
        'App mobile',
      ],
      highlighted: true,
    },
    {
      name: 'Empresarial',
      price: 'Personalizado',
      description: 'Para grandes operações',
      features: [
        'Múltiplos estabelecimentos',
        'API personalizada',
        'Treinamento dedicado',
        'Gerente de conta',
        'SLA garantido',
      ],
      highlighted: false,
    },
  ];

  // Classe base para o efeito Glassmorphism
  const glassCardClass = "bg-white/70 dark:bg-black/40 backdrop-blur-lg border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300";

  return (
    <div className="flex flex-col w-full bg-orange-50/30 dark:bg-background relative overflow-x-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="container mx-auto relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200">
              <Sparkles className="mr-1 h-3 w-3 text-orange-500" />
              Sistema #1 em Gestão de Bares e Restaurantes
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 pb-2">
              Transforme a Gestão do Seu{' '}
              <span className="text-foreground">
                Estabelecimento
              </span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed">
              Sistema completo e intuitivo para gerenciar pedidos, mesas, estoque e 
              equipe. Aumente sua eficiência e ofereça uma experiência incrível aos seus 
              clientes.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/25 border-none h-12 px-8 text-base" asChild>
                <Link href="/sign-in">
                  Começar Gratuitamente
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 h-12 px-8 text-base bg-transparent" asChild>
                <Link href="/sobre">
                  Conhecer Mais
                </Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-y-4 gap-x-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-500" />
                <span>Teste grátis 14 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-500" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-500" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-orange-200 text-orange-600 bg-orange-50">Recursos</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">
              Tudo que Você Precisa em Um Só Lugar
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas poderosas e fáceis de usar para otimizar cada aspecto do seu negócio
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className={`${glassCardClass} border-0 ring-1 ring-white/40`}>
                <CardHeader>
                  <div className={`h-12 w-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground/80">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with Phone Mockup */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="lg:pl-8 order-2 lg:order-1">
              <Badge variant="outline" className="mb-4 border-orange-200 text-orange-600 bg-orange-50">Benefícios</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">
                {/* MUDANÇA AQUI: Nome do App */}
                Por Que Escolher o PedidoRapido?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Desenvolvido especialmente para bares e restaurantes que buscam modernização, 
                eficiência e crescimento sustentável.
              </p>
              <div className="space-y-5">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-orange-600" />
                      </div>
                    </div>
                    <span className="text-base text-muted-foreground leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8" asChild>
                  <Link href="/register">
                    Teste Agora!
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative flex justify-center order-1 lg:order-2">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[650px] bg-gradient-to-b from-orange-400/20 to-amber-400/20 rounded-full blur-[60px] -z-10"></div>

               <div className="relative mx-auto border-gray-900 dark:border-gray-900 bg-gray-900 border-[12px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl flex flex-col overflow-hidden">
                  <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[12px] top-[72px] rounded-s-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[12px] top-[124px] rounded-s-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[12px] top-[178px] rounded-s-lg"></div>
                  <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[12px] top-[142px] rounded-e-lg"></div>
                  <div className="w-[148px] h-[18px] bg-gray-900 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
                  
                  <div className="bg-white dark:bg-slate-900 w-full h-full overflow-hidden flex flex-col relative">
                    
                    <div className="pt-8 pb-4 px-5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-orange-100 p-1.5 rounded-lg">
                           <QrCode className="w-4 h-4 text-orange-600" />
                        </div>
                        {/* MUDANÇA AQUI: Nome no mockup */}
                        <span className="font-bold text-sm">PedidoRapido</span>
                      </div>
                      <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
                    </div>

                    <div className="px-5 space-y-4 overflow-hidden">
                       <div className="bg-orange-50 rounded-2xl p-4 space-y-2">
                          <div className="w-16 h-16 bg-orange-100 rounded-full mb-2 flex items-center justify-center mx-auto">
                             <Smartphone className="w-8 h-8 text-orange-500" />
                          </div>
                          <div className="h-3 w-3/4 bg-orange-200/50 rounded mx-auto"></div>
                          <div className="h-2 w-1/2 bg-orange-200/30 rounded mx-auto"></div>
                       </div>

                       <div className="space-y-3">
                          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-3 flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                                <Package className="w-5 h-5" />
                             </div>
                             <div className="flex-1 space-y-1">
                                <div className="h-2.5 w-24 bg-gray-200 rounded"></div>
                                <div className="h-2 w-16 bg-gray-100 rounded"></div>
                             </div>
                          </div>

                          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-3 flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                <Users className="w-5 h-5" />
                             </div>
                             <div className="flex-1 space-y-1">
                                <div className="h-2.5 w-20 bg-gray-200 rounded"></div>
                                <div className="h-2 w-12 bg-gray-100 rounded"></div>
                             </div>
                          </div>
                       </div>

                       <div className="mt-4 relative">
                          <div className="h-10 w-full bg-gray-50 rounded-lg flex items-center px-3 gap-2">
                             <Search className="w-4 h-4 text-gray-300" />
                             <div className="h-2 w-24 bg-gray-200 rounded"></div>
                          </div>
                       </div>
                       
                       <div className="absolute bottom-6 left-5 right-5">
                          <div className="h-10 w-full bg-orange-500 rounded-lg shadow-lg shadow-orange-200"></div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 relative"> 
        <div className="container mx-auto relative z-10"> 
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-orange-200 text-orange-600 bg-orange-50">Planos</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">
              Escolha o Plano Ideal para Você
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comece gratuitamente e evolua conforme seu negócio cresce
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${glassCardClass} flex flex-col ${
                  plan.highlighted
                    ? 'border-orange-400/50 ring-2 ring-orange-400/20 shadow-orange-500/20 scale-105 z-10'
                    : 'border-white/20'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 border-0 shadow-lg px-4 py-1">Mais Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-10">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-4 flex items-baseline justify-center">
                    {/* Mantendo a fonte 4xl como combinado */}
                    <span className={`text-4xl font-bold ${plan.highlighted ? 'text-orange-600' : 'text-foreground'}`}>
                      {plan.price}
                    </span>
                    {plan.price !== 'Personalizado' && plan.price !== 'Grátis' && (
                      <span className="text-muted-foreground ml-1">/mês</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlighted ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                           <CheckCircle2 className="h-3 w-3" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button
                    className={`w-full h-11 font-semibold ${
                        plan.highlighted 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20' 
                        : 'bg-white/50 hover:bg-white/80 text-foreground border border-gray-200'
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href="/register">
                      {plan.price === 'Personalizado' ? 'Falar com Vendas' : 'Começar Agora'}
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div> 
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 z-0"></div>
        
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 z-0"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Pronto para Revolucionar Seu Negócio?
            </h2>
            <p className="text-xl opacity-90 mb-10 font-light">
              {/* MUDANÇA AQUI: Nome do App */}
              Junte-se a mais de 1000 estabelecimentos que já transformaram sua gestão com o PedidoRapido. 
              Comece hoje mesmo, sem compromisso!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2 bg-white text-orange-600 hover:bg-orange-50 h-12 px-8" asChild>
                <Link href="/register">
                  Iniciar Teste Gratuito
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10 h-12 px-8" asChild>
                <Link href="/contato">
                  Falar com Especialista
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}