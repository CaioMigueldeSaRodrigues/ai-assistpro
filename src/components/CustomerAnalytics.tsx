import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Clock,
  Target,
  MessageSquare,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export function CustomerAnalytics() {
  const [timeRange, setTimeRange] = useState("30d");

  const analyticsData = {
    revenue: {
      total: 45200,
      change: 23.5,
      byChannel: [
        { name: "WhatsApp", value: 22600, percentage: 50 },
        { name: "WebChat", value: 13560, percentage: 30 },
        { name: "Prospecção", value: 9040, percentage: 20 }
      ]
    },
    conversions: {
      total: 87,
      rate: 12.8,
      change: 3.2,
      funnel: [
        { stage: "Visitantes", count: 8934, percentage: 100 },
        { stage: "Engajados", count: 2156, percentage: 24.1 },
        { stage: "Leads", count: 456, percentage: 5.1 },
        { stage: "Conversões", count: 87, percentage: 1.0 }
      ]
    },
    satisfaction: {
      nps: 8.7,
      promoters: 67,
      passives: 23,
      detractors: 10,
      responseRate: 78.5
    },
    performance: {
      avgResponseTime: 1.8,
      avgHandleTime: 4.2,
      firstContactResolution: 82.3,
      customerEffortScore: 4.1
    },
    topIntents: [
      { intent: "Preços e Planos", count: 234, percentage: 32 },
      { intent: "Demonstração", count: 178, percentage: 24 },
      { intent: "Suporte Técnico", count: 145, percentage: 20 },
      { intent: "Funcionalidades", count: 112, percentage: 15 },
      { intent: "Outros", count: 65, percentage: 9 }
    ],
    leadQuality: [
      { quality: "Hot (Alta Intenção)", count: 23, color: "bg-red-500" },
      { quality: "Warm (Média Intenção)", count: 45, color: "bg-orange-500" },
      { quality: "Cold (Baixa Intenção)", count: 89, color: "bg-blue-500" }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Avançados</h2>
          <p className="text-muted-foreground">Métricas detalhadas do seu negócio</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 dias</SelectItem>
            <SelectItem value="30d">30 dias</SelectItem>
            <SelectItem value="90d">90 dias</SelectItem>
            <SelectItem value="1y">1 ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Gerada</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {analyticsData.revenue.total.toLocaleString()}</div>
              <div className="flex items-center text-xs text-success">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{analyticsData.revenue.change}% vs período anterior
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversões</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.conversions.total}</div>
              <div className="flex items-center text-xs text-success">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{analyticsData.conversions.change}% taxa de conversão
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NPS</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.satisfaction.nps}</div>
              <div className="text-xs text-muted-foreground">
                {analyticsData.satisfaction.promoters}% promotores
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.performance.avgResponseTime}s</div>
              <div className="text-xs text-muted-foreground">
                Média de resposta
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Channel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Receita por Canal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.revenue.byChannel.map((channel, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{channel.name}</span>
                  <span className="text-sm">R$ {channel.value.toLocaleString()}</span>
                </div>
                <Progress value={channel.percentage} className="h-2" />
                <div className="text-xs text-muted-foreground text-right mt-1">
                  {channel.percentage}% do total
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Funil de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analyticsData.conversions.funnel.map((stage, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold"
                    style={{ opacity: 1 - (index * 0.2) }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{stage.stage}</div>
                    <div className="text-xs text-muted-foreground">{stage.count.toLocaleString()}</div>
                  </div>
                </div>
                <Badge variant={index === analyticsData.conversions.funnel.length - 1 ? "default" : "outline"}>
                  {stage.percentage}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Intents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Principais Intenções
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analyticsData.topIntents.map((intent, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{intent.intent}</div>
                  <div className="text-xs text-muted-foreground">{intent.count} interações</div>
                </div>
                <Badge variant="outline">{intent.percentage}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Lead Quality */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Qualidade dos Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.leadQuality.map((lead, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${lead.color}`} />
                  <span className="text-sm">{lead.quality}</span>
                </div>
                <Badge variant="outline">{lead.count} leads</Badge>
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <div className="text-sm font-medium mb-2">Resumo de Performance</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Resolução 1º Contato</div>
                  <div className="font-semibold">{analyticsData.performance.firstContactResolution}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Esforço do Cliente</div>
                  <div className="font-semibold">{analyticsData.performance.customerEffortScore}/5</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NPS Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Distribuição NPS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-success">{analyticsData.satisfaction.promoters}%</div>
              <div className="text-sm text-muted-foreground">Promotores (9-10)</div>
              <div className="text-xs text-muted-foreground mt-1">Recomendam ativamente</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{analyticsData.satisfaction.passives}%</div>
              <div className="text-sm text-muted-foreground">Passivos (7-8)</div>
              <div className="text-xs text-muted-foreground mt-1">Satisfeitos mas não engajados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive">{analyticsData.satisfaction.detractors}%</div>
              <div className="text-sm text-muted-foreground">Detratores (0-6)</div>
              <div className="text-xs text-muted-foreground mt-1">Podem prejudicar a marca</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex h-4 rounded-full overflow-hidden">
              <div className="bg-success" style={{ width: `${analyticsData.satisfaction.promoters}%` }} />
              <div className="bg-orange-500" style={{ width: `${analyticsData.satisfaction.passives}%` }} />
              <div className="bg-destructive" style={{ width: `${analyticsData.satisfaction.detractors}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Taxa de resposta: {analyticsData.satisfaction.responseRate}%</span>
              <span>NPS Score: {analyticsData.satisfaction.nps}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
