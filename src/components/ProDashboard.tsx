import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, MessageSquare, Target, TrendingUp, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BotConfiguration } from "@/components/BotConfiguration";
import { ProspectionConfig } from "@/components/ProspectionConfig";

export function ProDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel Pro</h1>
          <p className="text-muted-foreground">Atendimento + Prospecção Ativa de Leads</p>
        </div>
        <Badge className="bg-purple-500 text-white">
          Plano Pro
        </Badge>
      </div>

      {/* Quick Stats */}
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
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                +15% em relação a ontem
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
              <CardTitle className="text-sm font-medium">Leads Capturados</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Hoje pela prospecção
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
              <div className="text-2xl font-bold">8.5%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% esta semana
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
              <CardTitle className="text-sm font-medium">ROI Prospecção</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">340%</div>
              <p className="text-xs text-muted-foreground">
                Retorno sobre investimento
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="atendimento" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="atendimento" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Agente de Atendimento
          </TabsTrigger>
          <TabsTrigger value="prospeccao" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Agente de Prospecção
          </TabsTrigger>
        </TabsList>

        <TabsContent value="atendimento">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Configuração do Assistente de Atendimento
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure seu assistente virtual para atender seus clientes 24/7
              </p>
            </CardHeader>
            <CardContent>
              <BotConfiguration planType="pro" />
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
              <p className="text-sm text-muted-foreground">
                Configure a prospecção ativa de leads qualificados
              </p>
            </CardHeader>
            <CardContent>
              <ProspectionConfig />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Usage Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Uso do Plano Pro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Conversas este mês</span>
              <span>3.247 / 5.000</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '64.9%' }} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Leads prospectados este mês</span>
              <span>234 / ilimitado</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium">Integrações</div>
              <div className="text-muted-foreground">WhatsApp, Site, CRM</div>
            </div>
            <div>
              <div className="font-medium">Suporte</div>
              <div className="text-muted-foreground">Chat + Email</div>
            </div>
            <div>
              <div className="font-medium">Relatórios</div>
              <div className="text-muted-foreground">Semanais</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}