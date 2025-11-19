"use client";
import { useState, useEffect } from "react";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Label } from "@/src/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/app/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/app/components/ui/avatar";
import { Alert, AlertDescription } from "@/src/app/components/ui/alert";
import { User, Mail, Phone, Calendar, CreditCard, Lock, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/src/app/contexts/AuthContext";
import { clientesAPI, garconsAPI } from "@/src/app/lib/api";
import Header from "@/src/app/components/cliente/HeaderPerfil";

interface PerfilData {
  nome: string;
  email: string;
  cpf?: string;
  celular?: string;
  data_nascimento?: string;
}

interface SenhaData {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

export default function PerfilPage() {
  const { user, updateUser, isCliente, isGarcom, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [perfilData, setPerfilData] = useState<PerfilData>({
    nome: "",
    email: "",
    cpf: "",
    celular: "",
    data_nascimento: "",
  });

  const [senhaData, setSenhaData] = useState<SenhaData>({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let userData: any;

      if (isCliente) {
        userData = await clientesAPI.get(user.id);
      } else if (isGarcom) {
        userData = await garconsAPI.get(user.id);
      }

      if (userData) {
        setPerfilData({
          nome: userData.nome || "",
          email: userData.email || "",
          cpf: userData.cpf || "",
          celular: userData.celular || "",
          data_nascimento: userData.data_nascimento || "",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      setErrorMessage("Erro ao carregar dados do perfil");
    } finally {
      setLoading(false);
    }
  };

  const handlePerfilChange = (field: keyof PerfilData, value: string) => {
    setPerfilData(prev => ({ ...prev, [field]: value }));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSenhaChange = (field: keyof SenhaData, value: string) => {
    setSenhaData(prev => ({ ...prev, [field]: value }));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
    }
    return value;
  };

  const handleSalvarPerfil = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Validações básicas
      if (!perfilData.nome || !perfilData.email) {
        setErrorMessage("Nome e e-mail são obrigatórios");
        return;
      }

      // Preparar dados para envio
      const dataToSend: any = {
        nome: perfilData.nome,
        email: perfilData.email,
      };

      // Adicionar campos opcionais apenas se preenchidos
      if (perfilData.cpf) dataToSend.cpf = perfilData.cpf.replace(/\D/g, "");
      if (perfilData.celular) dataToSend.celular = perfilData.celular.replace(/\D/g, "");
      if (perfilData.data_nascimento) {
        // Converter DD/MM/YYYY para YYYY-MM-DD
        const [dia, mes, ano] = perfilData.data_nascimento.split("/");
        if (dia && mes && ano) {
          dataToSend.data_nascimento = `${ano}-${mes}-${dia}`;
        }
      }

      if (isCliente) {
        await clientesAPI.update(user.id, dataToSend);
      } else if (isGarcom) {
        await garconsAPI.update(user.id, dataToSend);
      }

      // Atualizar contexto
      updateUser({ nome: perfilData.nome, email: perfilData.email });
      
      setSuccessMessage("Perfil atualizado com sucesso!");
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      setErrorMessage(error.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarSenha = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Validações
      if (!senhaData.senhaAtual || !senhaData.novaSenha || !senhaData.confirmarSenha) {
        setErrorMessage("Todos os campos de senha são obrigatórios");
        return;
      }

      if (senhaData.novaSenha !== senhaData.confirmarSenha) {
        setErrorMessage("A nova senha e a confirmação não coincidem");
        return;
      }

      if (senhaData.novaSenha.length < 6) {
        setErrorMessage("A nova senha deve ter pelo menos 6 caracteres");
        return;
      }

      const dataToSend = {
        senhaAtual: senhaData.senhaAtual,
        novaSenha: senhaData.novaSenha,
      };

      if (isCliente) {
        await clientesAPI.update(user.id, dataToSend);
      } else if (isGarcom) {
        await garconsAPI.update(user.id, dataToSend);
      }

      setSuccessMessage("Senha alterada com sucesso!");
      
      // Limpar campos
      setSenhaData({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      });

      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      setErrorMessage(error.message || "Erro ao alterar senha. Verifique sua senha atual.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  const userInitials = user.nome
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="container  space-y-6">
        
        <Header user={user} handleLogout={logout} />
      
      <div className="pl-6 py-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md border border-black/30">
        <span className="inline-block px-3 py-1 text-sm font-semibold bg-primary text-primary-foreground rounded-full">
          Meu Perfil
        </span>

        <p className="mt-2 text-muted-foreground">
            Gerencie suas informações pessoais e configurações
        </p>
      </div>

      <div/>

      {/* Mensagens de Feedback */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card do Avatar */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.avatar} alt={user.nome} />
                <AvatarFallback className="text-3xl">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{user.nome}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    {user.role === "admin" ? "Administrador" : user.role === "garcom" ? "Garçom" : "Cliente"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Informações */}
        <Card className="md:col-span-2">
          <Tabs defaultValue="dados" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="senha">Alterar Senha</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* Aba de Dados Pessoais */}
              <TabsContent value="dados" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">
                        <User className="inline h-4 w-4 mr-2" />
                        Nome Completo *
                      </Label>
                      <Input
                        id="nome"
                        value={perfilData.nome}
                        onChange={(e) => handlePerfilChange("nome", e.target.value)}
                        placeholder="Digite seu nome completo"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="inline h-4 w-4 mr-2" />
                        E-mail *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={perfilData.email}
                        onChange={(e) => handlePerfilChange("email", e.target.value)}
                        placeholder="seu@email.com"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf">
                        <CreditCard className="inline h-4 w-4 mr-2" />
                        CPF
                      </Label>
                      <Input
                        id="cpf"
                        value={perfilData.cpf}
                        onChange={(e) => handlePerfilChange("cpf", formatCPF(e.target.value))}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="celular">
                        <Phone className="inline h-4 w-4 mr-2" />
                        Celular
                      </Label>
                      <Input
                        id="celular"
                        value={perfilData.celular}
                        onChange={(e) => handlePerfilChange("celular", formatPhone(e.target.value))}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="data_nascimento">
                        <Calendar className="inline h-4 w-4 mr-2" />
                        Data de Nascimento
                      </Label>
                      <Input
                        id="data_nascimento"
                        value={perfilData.data_nascimento}
                        onChange={(e) => handlePerfilChange("data_nascimento", formatDate(e.target.value))}
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSalvarPerfil} disabled={loading}>
                      <Save className="mr-2 h-4 w-4" />
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Aba de Alterar Senha */}
              <TabsContent value="senha" className="space-y-4">
                <div className="space-y-4">
                  <CardDescription>
                    Para sua segurança, você precisa informar sua senha atual antes de definir uma nova senha.
                  </CardDescription>

                  <div className="space-y-2">
                    <Label htmlFor="senhaAtual">
                      <Lock className="inline h-4 w-4 mr-2" />
                      Senha Atual *
                    </Label>
                    <Input
                      id="senhaAtual"
                      type="password"
                      value={senhaData.senhaAtual}
                      onChange={(e) => handleSenhaChange("senhaAtual", e.target.value)}
                      placeholder="Digite sua senha atual"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="novaSenha">
                      <Lock className="inline h-4 w-4 mr-2" />
                      Nova Senha *
                    </Label>
                    <Input
                      id="novaSenha"
                      type="password"
                      value={senhaData.novaSenha}
                      onChange={(e) => handleSenhaChange("novaSenha", e.target.value)}
                      placeholder="Digite sua nova senha (mín. 6 caracteres)"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">
                      <Lock className="inline h-4 w-4 mr-2" />
                      Confirmar Nova Senha *
                    </Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      value={senhaData.confirmarSenha}
                      onChange={(e) => handleSenhaChange("confirmarSenha", e.target.value)}
                      placeholder="Confirme sua nova senha"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleAlterarSenha} disabled={loading}>
                      <Lock className="mr-2 h-4 w-4" />
                      {loading ? "Alterando..." : "Alterar Senha"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
