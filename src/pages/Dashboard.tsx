import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Settings,
  Bot,
  Calendar,
  Target,
  Clock,
  Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKPIMetrics } from "@/hooks/useKPIMetrics";
import { TrafficAnalytics } from "@/components/TrafficAnalytics";
import { BotConfiguration } from "@/components/BotConfiguration";
import { MarketingInsights } from "@/components/MarketingInsights";

export default function Dashboard() {
  const { data: metrics, isLoading } = useKPIMetrics();
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Gerencie seus agentes de IA e analise performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-success border-success">
              <div className="w-2 h-2 bg-success rounded-full mr-2" />
              Online
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversas Hoje</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.leads_today || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +12% em relação a ontem
                </p>
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
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((metrics?.conversion_rate || 0) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  +2.1% esta semana
                </p>
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
                <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.avg_response_time || 0}s</div>
                <p className="text-xs text-muted-foreground">
                  -5s melhor que a média
                </p>
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
                <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(metrics?.customer_satisfaction || 0).toFixed(1)}/5
                </div>
                <p className="text-xs text-muted-foreground">
                  Baseado em 127 avaliações
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="bot-config" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Configurar Bot
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Marketing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversas por Hora</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Gráfico de conversas por hora
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Principais Intenções</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Informações sobre preços</span>
                    <Badge>45%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Solicitação de demo</span>
                    <Badge>32%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Suporte técnico</span>
                    <Badge>18%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Outros</span>
                    <Badge>5%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <TrafficAnalytics />
          </TabsContent>

          <TabsContent value="bot-config">
            <BotConfiguration />
          </TabsContent>

          <TabsContent value="marketing">
            <MarketingInsights />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}