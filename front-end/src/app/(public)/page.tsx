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
  Monitor,
  TrendingUp,
  Star,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: 'Gestão Rápida e Eficiente',
      description: 'Controle completo de pedidos, mesas e produtos em tempo real com interface intuitiva.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: BarChart3,
      title: 'Dashboard Inteligente',
      description: 'Visualize métricas importantes e tome decisões baseadas em dados reais do seu negócio.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description: 'Seus dados protegidos com criptografia de ponta e backup automático na nuvem.',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Users,
      title: 'Gestão de Equipe',
      description: 'Controle de permissões, histórico de atendimentos e relatórios por colaborador.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Package,
      title: 'Controle de Estoque',
      description: 'Gerencie produtos, fornecedores e receba alertas automáticos de estoque baixo.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Clock,
      title: 'Atendimento 24/7',
      description: 'Suporte técnico disponível sempre que você precisar, por chat, email ou telefone.',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
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

  const stats = [
    { value: '1000+', label: 'Estabelecimentos', icon: Users },
    { value: '50K+', label: 'Pedidos/Mês', icon: TrendingUp },
    { value: '4.9/5', label: 'Avaliação', icon: Star },
    { value: '24/7', label: 'Suporte', icon: Clock },
  ];

  const plans = [
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

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:32px_32px]" />
        <div className="container mx-auto relative py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Sistema #1 em Gestão de Bares e Restaurantes
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Transforme a Gestão do Seu{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Estabelecimento
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              Sistema completo e intuitivo para gerenciar pedidos, mesas, estoque e equipe. 
              Aumente sua eficiência e ofereça uma experiência incrível aos seus clientes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/sign-in">
                  Começar Gratuitamente
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sobre">
                  Conhecer Mais
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Teste grátis 14 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
<section className="py-16 md:py-24">
  <div className="container mx-auto">
    
    
    <div className="text-center mb-12">
      <Badge variant="outline" className="mb-4">Recursos</Badge>
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
        Tudo que Você Precisa em Um Só Lugar
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Ferramentas poderosas e fáceis de usar para otimizar cada aspecto do seu negócio
      </p>
    </div>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
          <CardHeader>
            <div className={`h-12 w-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
              <feature.icon className={`h-6 w-6 ${feature.color}`} />
            </div>
            <CardTitle className="text-xl">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              {feature.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
    
  </div>
</section>

      {/* Benefits Section */}
      <section className="bg-muted/50">
        <div className="container mx-auto py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="lg:pl-8">
              <Badge variant="outline" className="mb-4">Benefícios</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">
                Por Que Escolher o RestaurantSys?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Desenvolvido especialmente para bares e restaurantes que buscam modernização, 
                eficiência e crescimento sustentável.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="text-base leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Teste Agora!
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20" />
                <CardContent className="relative p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
                      <Monitor className="h-8 w-8 text-primary" />
                      <div>
                        <div className="font-semibold">Dashboard Web</div>
                        <div className="text-sm text-muted-foreground">
                          Acesse de qualquer computador
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
                      <Smartphone className="h-8 w-8 text-purple-600" />
                      <div>
                        <div className="font-semibold">App Mobile</div>
                        <div className="text-sm text-muted-foreground">
                          Android e iOS disponíveis
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
                      <Zap className="h-8 w-8 text-yellow-500" />
                      <div>
                        <div className="font-semibold">Sincronização em Tempo Real</div>
                        <div className="text-sm text-muted-foreground">
                          Dados sempre atualizados
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
<section className="py-16 md:py-24"> 
  <div className="container mx-auto"> 

    
    <div className="text-center mb-12">
      <Badge variant="outline" className="mb-4">Planos</Badge>
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
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
          className={`relative ${
            plan.highlighted
              ? 'border-primary shadow-xl scale-105'
              : 'hover:shadow-lg transition-shadow'
          }`}
        >
          {plan.highlighted && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="shadow-lg">Mais Popular</Badge>
            </div>
          )}
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <CardDescription className="text-base">{plan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              {plan.price !== 'Personalizado' && plan.price !== 'Grátis' && (
                <span className="text-muted-foreground">/mês</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant={plan.highlighted ? 'default' : 'outline'}
              asChild
            >
              <Link href="/register">
                {plan.price === 'Personalizado' ? 'Falar com Vendas' : 'Começar Agora'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>

  </div> 
</section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
        <div className="container mx-auto py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">
              Pronto para Revolucionar Seu Negócio?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Junte-se a mais de 1000 estabelecimentos que já transformaram sua gestão com o RestaurantSys. 
              Comece hoje mesmo, sem compromisso!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <Link href="/register">
                  Iniciar Teste Gratuito
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
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