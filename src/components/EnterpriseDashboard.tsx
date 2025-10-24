import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bot, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  BarChart3,
  Users,
  Clock,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BotConfiguration } from "@/components/BotConfiguration";
import { ProspectionConfig } from "@/components/ProspectionConfig";
import { CustomerAnalytics } from "@/components/CustomerAnalytics";

export function EnterpriseDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel Enterprise</h1>
          <p className="text-muted-foreground">Solução completa com analytics avançados</p>
        </div>
        <Badge className="bg-orange-500 text-white">
          Plano Enterprise
        </Badge>
      </div>

      {/* Advanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">
                +23% em relação a ontem
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
              <CardTitle className="text-sm font-medium">Receita Gerada</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 45.2k</div>
              <p className="text-xs text-muted-foreground">
                Este mês pelos agentes
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
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.8%</div>
              <p className="text-xs text-muted-foreground">
                +3.2% esta semana
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
              <CardTitle className="text-sm font-medium">NPS</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.7</div>
              <p className="text-xs text-muted-foreground">
                Baseado em 89 avaliações
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="atendimento" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Atendimento
          </TabsTrigger>
          <TabsTrigger value="prospeccao" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Prospecção
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <CustomerAnalytics />
        </TabsContent>

        <TabsContent value="atendimento">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Configuração do Assistente de Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BotConfiguration planType="enterprise" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prospeccao">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Configuração do Agente de Prospecção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProspectionConfig />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Conversões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conversões por Atendimento</span>
                    <Badge>67%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conversões por Prospecção</span>
                    <Badge>23%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conversões Mistas</span>
                    <Badge>10%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">WhatsApp</span>
                    <Badge className="bg-success text-white">450%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">WebChat</span>
                    <Badge className="bg-primary text-white">320%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Prospecção</span>
                    <Badge className="bg-orange-500 text-white">280%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}