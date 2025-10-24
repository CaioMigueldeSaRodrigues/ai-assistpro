import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Bot, 
  Save, 
  TestTube, 
  MessageSquare, 
  Clock, 
  Globe,
  Briefcase,
  Volume2,
  Calendar,
  Settings,
  Zap,
  Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useBotConfig, useSaveBotConfig, useTestBot } from "@/hooks/useBotConfig";

export function BotConfiguration() {
  const { data: botConfig, isLoading } = useBotConfig();
  const saveBotConfig = useSaveBotConfig();
  const testBot = useTestBot();
  
  const [config, setConfig] = useState({
    // Informações Básicas
    botName: "Assistente IA",
    company: "Minha Empresa",
    industry: "tecnologia",
    description: "Somos uma empresa de tecnologia focada em soluções inovadoras para nossos clientes.",
    
    // Personalidade e Tom
    personality: "profissional",
    tone: "amigavel",
    language: "pt-BR",
    
    // Horário de Funcionamento
    workingHours: {
      enabled: true,
      timezone: "America/Sao_Paulo",
      monday: { start: "09:00", end: "18:00", enabled: true },
      tuesday: { start: "09:00", end: "18:00", enabled: true },
      wednesday: { start: "09:00", end: "18:00", enabled: true },
      thursday: { start: "09:00", end: "18:00", enabled: true },
      friday: { start: "09:00", end: "18:00", enabled: true },
      saturday: { start: "09:00", end: "14:00", enabled: false },
      sunday: { start: "09:00", end: "14:00", enabled: false }
    },
    
    // Regras de Negócio
    businessRules: {
      maxConversationTime: 30,
      transferToHuman: true,
      collectLeadInfo: true,
      sendFollowUp: true,
      autoQualifyLeads: true
    },
    
    // Integrações
    integrations: {
      whatsapp: true,
      telegram: false,
      webchat: true,
      email: true
    },
    
    // Mensagens Personalizadas
    messages: {
      welcome: "Olá! Sou o assistente virtual da {company}. Como posso ajudar você hoje?",
      offline: "No momento estamos offline. Deixe sua mensagem que retornaremos em breve!",
      transfer: "Vou transferir você para um de nossos especialistas. Um momento, por favor.",
      goodbye: "Foi um prazer ajudar você! Tenha um ótimo dia!"
    }
  });

  const [isTestMode, setIsTestMode] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [testResponse, setTestResponse] = useState("");

  // Load config when data is available
  useEffect(() => {
    if (botConfig) {
      setConfig(botConfig as any);
    }
  }, [botConfig]);

  const handleSave = () => {
    saveBotConfig.mutate(config);
  };

  const handleTest = () => {
    if (!testMessage.trim()) {
      toast({
        title: "Digite uma mensagem",
        description: "Digite uma mensagem para testar o bot.",
        variant: "destructive",
      });
      return;
    }

    testBot.mutate(testMessage, {
      onSuccess: (response: any) => {
        setTestResponse(response.botResponse);
        setIsTestMode(true);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuração do Assistente Virtual</h2>
          <p className="text-muted-foreground">Personalize seu bot de acordo com seu negócio</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleTest}>
            <TestTube className="h-4 w-4 mr-2" />
            Testar Bot
          </Button>
          <Button onClick={handleSave} disabled={saveBotConfig.isPending}>
            {saveBotConfig.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="botName">Nome do Assistente</Label>
                  <Input
                    id="botName"
                    value={config.botName}
                    onChange={(e) => setConfig({...config, botName: e.target.value})}
                    placeholder="Ex: Assistente IA"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Nome da Empresa</Label>
                  <Input
                    id="company"
                    value={config.company}
                    onChange={(e) => setConfig({...config, company: e.target.value})}
                    placeholder="Ex: Minha Empresa"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="industry">Setor de Atuação</Label>
                <Select value={config.industry} onValueChange={(value) => setConfig({...config, industry: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="saude">Saúde</SelectItem>
                    <SelectItem value="educacao">Educação</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="varejo">Varejo</SelectItem>
                    <SelectItem value="servicos">Serviços</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Descrição da Empresa</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => setConfig({...config, description: e.target.value})}
                  placeholder="Descreva sua empresa e o que ela faz..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Personality & Tone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Personalidade e Tom
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="personality">Personalidade</Label>
                  <Select value={config.personality} onValueChange={(value) => setConfig({...config, personality: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="profissional">Profissional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="divertido">Divertido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tone">Tom de Voz</Label>
                  <Select value={config.tone} onValueChange={(value) => setConfig({...config, tone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amigavel">Amigável</SelectItem>
                      <SelectItem value="autoritativo">Autoritativo</SelectItem>
                      <SelectItem value="empático">Empático</SelectItem>
                      <SelectItem value="entusiasmado">Entusiasmado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={config.language} onValueChange={(value) => setConfig({...config, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (BR)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horário de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Ativar horário de funcionamento</Label>
                <Switch
                  checked={config.workingHours.enabled}
                  onCheckedChange={(checked) => 
                    setConfig({
                      ...config, 
                      workingHours: {...config.workingHours, enabled: checked}
                    })
                  }
                />
              </div>

              {config.workingHours.enabled && (
                <div className="space-y-3">
                  {Object.entries(config.workingHours).map(([day, hours]: [string, any]) => {
                    if (day === 'enabled' || day === 'timezone') return null;
                    
                    const dayNames: Record<string, string> = {
                      monday: 'Segunda-feira',
                      tuesday: 'Terça-feira', 
                      wednesday: 'Quarta-feira',
                      thursday: 'Quinta-feira',
                      friday: 'Sexta-feira',
                      saturday: 'Sábado',
                      sunday: 'Domingo'
                    };

                    return (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-24">
                          <Switch
                            checked={hours?.enabled || false}
                            onCheckedChange={(checked) => 
                              setConfig({
                                ...config,
                                workingHours: {
                                  ...config.workingHours,
                                  [day]: {...(hours || {}), enabled: checked}
                                }
                              })
                            }
                          />
                        </div>
                        <div className="w-32 text-sm">{dayNames[day] || day}</div>
                        {hours?.enabled && (
                          <>
                            <Input
                              type="time"
                              value={hours?.start || '09:00'}
                              onChange={(e) => 
                                setConfig({
                                  ...config,
                                  workingHours: {
                                    ...config.workingHours,
                                    [day]: {...(hours || {}), start: e.target.value}
                                  }
                                })
                              }
                              className="w-24"
                            />
                            <span className="text-muted-foreground">às</span>
                            <Input
                              type="time"
                              value={hours?.end || '18:00'}
                              onChange={(e) => 
                                setConfig({
                                  ...config,
                                  workingHours: {
                                    ...config.workingHours,
                                    [day]: {...(hours || {}), end: e.target.value}
                                  }
                                })
                              }
                              className="w-24"
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Regras de Negócio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Transferir para humano</Label>
                    <Switch
                      checked={config.businessRules.transferToHuman}
                      onCheckedChange={(checked) => 
                        setConfig({
                          ...config,
                          businessRules: {...config.businessRules, transferToHuman: checked}
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Coletar informações de leads</Label>
                    <Switch
                      checked={config.businessRules.collectLeadInfo}
                      onCheckedChange={(checked) => 
                        setConfig({
                          ...config,
                          businessRules: {...config.businessRules, collectLeadInfo: checked}
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Enviar follow-up automático</Label>
                    <Switch
                      checked={config.businessRules.sendFollowUp}
                      onCheckedChange={(checked) => 
                        setConfig({
                          ...config,
                          businessRules: {...config.businessRules, sendFollowUp: checked}
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Tempo máximo de conversa (minutos)</Label>
                    <Input
                      type="number"
                      value={config.businessRules.maxConversationTime}
                      onChange={(e) => 
                        setConfig({
                          ...config,
                          businessRules: {
                            ...config.businessRules, 
                            maxConversationTime: parseInt(e.target.value)
                          }
                        })
                      }
                      min="5"
                      max="120"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Qualificar leads automaticamente</Label>
                    <Switch
                      checked={config.businessRules.autoQualifyLeads}
                      onCheckedChange={(checked) => 
                        setConfig({
                          ...config,
                          businessRules: {...config.businessRules, autoQualifyLeads: checked}
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Mensagens Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="welcome">Mensagem de Boas-vindas</Label>
                <Textarea
                  id="welcome"
                  value={config.messages.welcome}
                  onChange={(e) => 
                    setConfig({
                      ...config,
                      messages: {...config.messages, welcome: e.target.value}
                    })
                  }
                  placeholder="Mensagem inicial do bot..."
                  rows={2}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use {"{company}"} para inserir o nome da empresa automaticamente
                </p>
              </div>

              <div>
                <Label htmlFor="offline">Mensagem Fora do Horário</Label>
                <Textarea
                  id="offline"
                  value={config.messages.offline}
                  onChange={(e) => 
                    setConfig({
                      ...config,
                      messages: {...config.messages, offline: e.target.value}
                    })
                  }
                  placeholder="Mensagem quando fora do horário..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="transfer">Mensagem de Transferência</Label>
                <Textarea
                  id="transfer"
                  value={config.messages.transfer}
                  onChange={(e) => 
                    setConfig({
                      ...config,
                      messages: {...config.messages, transfer: e.target.value}
                    })
                  }
                  placeholder="Mensagem ao transferir para humano..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Status do Bot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge className="bg-success text-white">
                  <div className="w-2 h-2 bg-white rounded-full mr-2" />
                  Online
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Última atualização</span>
                <span className="text-xs text-muted-foreground">Há 2 minutos</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Conversas hoje</span>
                <span className="text-sm font-medium">47</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Taxa de resolução</span>
                <span className="text-sm font-medium">89%</span>
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Integrações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">WhatsApp</span>
                </div>
                <Switch
                  checked={config.integrations.whatsapp}
                  onCheckedChange={(checked) => 
                    setConfig({
                      ...config,
                      integrations: {...config.integrations, whatsapp: checked}
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">Telegram</span>
                </div>
                <Switch
                  checked={config.integrations.telegram}
                  onCheckedChange={(checked) => 
                    setConfig({
                      ...config,
                      integrations: {...config.integrations, telegram: checked}
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">WebChat</span>
                </div>
                <Switch
                  checked={config.integrations.webchat}
                  onCheckedChange={(checked) => 
                    setConfig({
                      ...config,
                      integrations: {...config.integrations, webchat: checked}
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2">
                <Input
                  placeholder="Digite uma mensagem para testar..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTest()}
                />
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleTest}
                  disabled={testBot.isPending}
                >
                  {testBot.isPending ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <TestTube className="h-4 w-4 mr-2" />
                  )}
                  Testar Conversa
                </Button>
                {testResponse && (
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <div className="font-medium mb-1">Resposta do Bot:</div>
                    <div>{testResponse}</div>
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Configurações Avançadas
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Logs de Segurança
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}