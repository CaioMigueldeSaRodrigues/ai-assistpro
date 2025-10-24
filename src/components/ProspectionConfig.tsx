import { useState } from "react";
import { motion } from "framer-motion";
import { Target, MapPin, Clock, Bot, Save, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export function ProspectionConfig() {
  const [config, setConfig] = useState({
    // Segmentação
    cnae: "5611201", // Restaurantes
    uf: "",
    municipios: [],
    porteEmpresa: "todos",
    
    // Horários de Prospecção
    prospectionHours: {
      enabled: true,
      monday: { start: "09:00", end: "17:00", enabled: true },
      tuesday: { start: "09:00", end: "17:00", enabled: true },
      wednesday: { start: "09:00", end: "17:00", enabled: true },
      thursday: { start: "09:00", end: "17:00", enabled: true },
      friday: { start: "09:00", end: "17:00", enabled: true },
      saturday: { start: "09:00", end: "12:00", enabled: false },
      sunday: { start: "09:00", end: "12:00", enabled: false }
    },
    
    // Personalidade do Agente de Prospecção
    prospectionPersonality: {
      tone: "consultivo",
      approach: "educativo",
      persistence: "moderada"
    },
    
    // Configurações Avançadas
    advanced: {
      dailyLimit: 50,
      intervalBetweenContacts: 30, // minutos
      followUpDays: 3,
      qualificationCriteria: "interesse_demonstrado"
    },
    
    // Mensagens de Prospecção
    messages: {
      initial: "Olá! Sou da {company} e notei que sua empresa pode se beneficiar de nossos agentes de IA. Posso apresentar uma solução que pode automatizar seu atendimento?",
      followUp: "Oi! Retomando nossa conversa sobre automação de atendimento. Você teria alguns minutos para uma demonstração rápida?",
      qualification: "Perfeito! Para personalizar a demonstração, qual o principal desafio no atendimento da sua empresa atualmente?"
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const cnaes = [
    { value: "5611201", label: "Restaurantes e Similares" },
    { value: "4711302", label: "Supermercados" },
    { value: "6201501", label: "Desenvolvimento de Software" },
    { value: "8599699", label: "Outras Atividades de Ensino" },
    { value: "4781400", label: "Comércio Varejista de Artigos do Vestuário" },
    { value: "9602501", label: "Cabeleireiros, Manicure e Pedicure" }
  ];

  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", 
    "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
    "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Configurações de prospecção salvas!",
      description: "Seu agente de prospecção foi configurado com sucesso.",
    });
    
    setIsSaving(false);
  };

  const toggleProspection = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Prospecção pausada" : "Prospecção ativada",
      description: isActive ? "Seu agente parou de prospectar" : "Seu agente voltou a prospectar leads",
    });
  };

  return (
    <div className="space-y-6">
      {/* Status and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-success animate-pulse' : 'bg-muted'}`} />
            <span className="font-medium">
              {isActive ? 'Prospecção Ativa' : 'Prospecção Pausada'}
            </span>
          </div>
          <Badge variant="outline">
            {config.advanced.dailyLimit} leads/dia
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={toggleProspection}>
            <Play className="h-4 w-4 mr-2" />
            {isActive ? 'Pausar' : 'Ativar'}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Segmentação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Segmentação de Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cnae">Setor (CNAE)</Label>
              <Select value={config.cnae} onValueChange={(value) => setConfig({...config, cnae: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cnaes.map((cnae) => (
                    <SelectItem key={cnae.value} value={cnae.value}>
                      {cnae.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="uf">Estado (UF)</Label>
              <Select value={config.uf} onValueChange={(value) => setConfig({...config, uf: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os estados</SelectItem>
                  {estados.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="porte">Porte da Empresa</Label>
              <Select value={config.porteEmpresa} onValueChange={(value) => setConfig({...config, porteEmpresa: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os portes</SelectItem>
                  <SelectItem value="mei">MEI</SelectItem>
                  <SelectItem value="micro">Microempresa</SelectItem>
                  <SelectItem value="pequena">Pequena</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Personalidade do Agente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Personalidade do Agente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tone">Tom de Abordagem</Label>
              <Select 
                value={config.prospectionPersonality.tone} 
                onValueChange={(value) => 
                  setConfig({
                    ...config, 
                    prospectionPersonality: {...config.prospectionPersonality, tone: value}
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultivo">Consultivo</SelectItem>
                  <SelectItem value="direto">Direto</SelectItem>
                  <SelectItem value="educativo">Educativo</SelectItem>
                  <SelectItem value="amigavel">Amigável</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="approach">Abordagem</Label>
              <Select 
                value={config.prospectionPersonality.approach} 
                onValueChange={(value) => 
                  setConfig({
                    ...config, 
                    prospectionPersonality: {...config.prospectionPersonality, approach: value}
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="educativo">Educativo</SelectItem>
                  <SelectItem value="beneficios">Focado em Benefícios</SelectItem>
                  <SelectItem value="problema">Identificação de Problemas</SelectItem>
                  <SelectItem value="social_proof">Prova Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="persistence">Nível de Persistência</Label>
              <Select 
                value={config.prospectionPersonality.persistence} 
                onValueChange={(value) => 
                  setConfig({
                    ...config, 
                    prospectionPersonality: {...config.prospectionPersonality, persistence: value}
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa (1 tentativa)</SelectItem>
                  <SelectItem value="moderada">Moderada (2-3 tentativas)</SelectItem>
                  <SelectItem value="alta">Alta (4-5 tentativas)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Horários de Prospecção */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horários de Prospecção
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Ativar horários específicos</Label>
              <Switch
                checked={config.prospectionHours.enabled}
                onCheckedChange={(checked) => 
                  setConfig({
                    ...config, 
                    prospectionHours: {...config.prospectionHours, enabled: checked}
                  })
                }
              />
            </div>

            {config.prospectionHours.enabled && (
              <div className="space-y-3">
                {Object.entries(config.prospectionHours).map(([day, hours]: [string, any]) => {
                  if (day === 'enabled') return null;
                  
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
                              prospectionHours: {
                                ...config.prospectionHours,
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
                                prospectionHours: {
                                  ...config.prospectionHours,
                                  [day]: {...(hours || {}), start: e.target.value}
                                }
                              })
                            }
                            className="w-24"
                          />
                          <span className="text-muted-foreground">às</span>
                          <Input
                            type="time"
                            value={hours?.end || '17:00'}
                            onChange={(e) => 
                              setConfig({
                                ...config,
                                prospectionHours: {
                                  ...config.prospectionHours,
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

        {/* Configurações Avançadas */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações Avançadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dailyLimit">Limite diário de contatos</Label>
                <Input
                  id="dailyLimit"
                  type="number"
                  value={config.advanced.dailyLimit}
                  onChange={(e) => 
                    setConfig({
                      ...config,
                      advanced: {...config.advanced, dailyLimit: parseInt(e.target.value)}
                    })
                  }
                  min="10"
                  max="200"
                />
              </div>
              
              <div>
                <Label htmlFor="interval">Intervalo entre contatos (min)</Label>
                <Input
                  id="interval"
                  type="number"
                  value={config.advanced.intervalBetweenContacts}
                  onChange={(e) => 
                    setConfig({
                      ...config,
                      advanced: {...config.advanced, intervalBetweenContacts: parseInt(e.target.value)}
                    })
                  }
                  min="5"
                  max="120"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="followUpDays">Dias para follow-up</Label>
              <Select 
                value={config.advanced.followUpDays.toString()} 
                onValueChange={(value) => 
                  setConfig({
                    ...config,
                    advanced: {...config.advanced, followUpDays: parseInt(value)}
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 dia</SelectItem>
                  <SelectItem value="2">2 dias</SelectItem>
                  <SelectItem value="3">3 dias</SelectItem>
                  <SelectItem value="7">1 semana</SelectItem>
                  <SelectItem value="14">2 semanas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Mensagens de Prospecção */}
        <Card>
          <CardHeader>
            <CardTitle>Mensagens de Prospecção</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="initialMessage">Mensagem Inicial</Label>
              <Textarea
                id="initialMessage"
                value={config.messages.initial}
                onChange={(e) => 
                  setConfig({
                    ...config,
                    messages: {...config.messages, initial: e.target.value}
                  })
                }
                placeholder="Primeira mensagem de contato..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="followUpMessage">Mensagem de Follow-up</Label>
              <Textarea
                id="followUpMessage"
                value={config.messages.followUp}
                onChange={(e) => 
                  setConfig({
                    ...config,
                    messages: {...config.messages, followUp: e.target.value}
                  })
                }
                placeholder="Mensagem de retomada..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="qualificationMessage">Mensagem de Qualificação</Label>
              <Textarea
                id="qualificationMessage"
                value={config.messages.qualification}
                onChange={(e) => 
                  setConfig({
                    ...config,
                    messages: {...config.messages, qualification: e.target.value}
                  })
                }
                placeholder="Mensagem para qualificar o lead..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance da Prospecção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">234</div>
              <div className="text-sm text-muted-foreground">Leads contatados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">67</div>
              <div className="text-sm text-muted-foreground">Respostas obtidas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">23</div>
              <div className="text-sm text-muted-foreground">Leads qualificados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">8</div>
              <div className="text-sm text-muted-foreground">Conversões</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}