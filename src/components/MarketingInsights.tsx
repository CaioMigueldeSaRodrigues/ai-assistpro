import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Mail,
  Share2,
  Search,
  MousePointer,
  Eye,
  Heart,
  MessageCircle,
  BarChart3,
  PieChart,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export function MarketingInsights() {
  const [timeRange, setTimeRange] = useState("30d");

  const marketingData = {
    campaigns: [
      {
        name: "Google Ads - Agentes IA",
        type: "PPC",
        status: "active",
        budget: 5000,
        spent: 3240,
        clicks: 1847,
        conversions: 23,
        ctr: 3.2,
        cpc: 1.75,
        roas: 4.2
      },
      {
        name: "Facebook Ads - Automação",
        type: "Social",
        status: "active", 
        budget: 3000,
        spent: 2890,
        clicks: 2156,
        conversions: 18,
        ctr: 2.8,
        cpc: 1.34,
        roas: 3.8
      },
      {
        name: "LinkedIn - B2B",
        type: "Social",
        status: "paused",
        budget: 2000,
        spent: 1456,
        clicks: 567,
        conversions: 12,
        ctr: 1.9,
        cpc: 2.57,
        roas: 5.1
      }
    ],
    keywords: [
      { keyword: "agente de ia", position: 3, volume: 8900, difficulty: 65, clicks: 234 },
      { keyword: "chatbot para empresa", position: 7, volume: 5400, difficulty: 58, clicks: 156 },
      { keyword: "automação atendimento", position: 12, volume: 3200, difficulty: 72, clicks: 89 },
      { keyword: "ia conversacional", position: 5, volume: 2100, difficulty: 45, clicks: 167 },
      { keyword: "bot whatsapp", position: 15, volume: 12000, difficulty: 78, clicks: 67 }
    ],
    socialMedia: {
      linkedin: { followers: 2847, engagement: 4.2, posts: 12, reach: 15600 },
      facebook: { followers: 1234, engagement: 2.8, posts: 8, reach: 8900 },
      instagram: { followers: 3456, engagement: 5.1, posts: 15, reach: 12300 },
      twitter: { followers: 987, engagement: 3.4, posts: 20, reach: 5600 }
    },
    emailMarketing: {
      subscribers: 4567,
      openRate: 24.5,
      clickRate: 3.8,
      unsubscribeRate: 0.5,
      campaigns: 6,
      revenue: 12450
    },
    contentPerformance: [
      { title: "Como Implementar IA no Atendimento", views: 3456, shares: 89, leads: 23 },
      { title: "ROI de Chatbots: Guia Completo", views: 2134, shares: 67, leads: 18 },
      { title: "Automação vs Atendimento Humano", views: 1876, shares: 45, leads: 12 },
      { title: "Tendências de IA em 2024", views: 2987, shares: 123, leads: 34 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'paused': return 'bg-orange-500';
      case 'ended': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'paused': return 'Pausada';
      case 'ended': return 'Finalizada';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Insights de Marketing</h2>
          <p className="text-muted-foreground">Análise de performance das campanhas e estratégias</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 dias</SelectItem>
            <SelectItem value="30d">30 dias</SelectItem>
            <SelectItem value="90d">90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Marketing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 7.586</div>
              <p className="text-xs text-muted-foreground">
                +15% vs mês anterior
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
              <CardTitle className="text-sm font-medium">ROAS Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.37x</div>
              <p className="text-xs text-success">
                +0.8x vs mês anterior
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
              <CardTitle className="text-sm font-medium">Conversões</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">53</div>
              <p className="text-xs text-success">
                +23% vs mês anterior
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
              <CardTitle className="text-sm font-medium">CAC Médio</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 143</div>
              <p className="text-xs text-destructive">
                +R$ 12 vs mês anterior
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Campaigns Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance das Campanhas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketingData.campaigns.map((campaign, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{campaign.name}</h4>
                    <Badge variant="outline">{campaign.type}</Badge>
                    <Badge className={getStatusColor(campaign.status)}>
                      {getStatusText(campaign.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ROAS: {campaign.roas}x
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Orçamento</div>
                    <div className="font-medium">R$ {campaign.budget.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Gasto</div>
                    <div className="font-medium">R$ {campaign.spent.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Cliques</div>
                    <div className="font-medium">{campaign.clicks.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Conversões</div>
                    <div className="font-medium">{campaign.conversions}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">CTR</div>
                    <div className="font-medium">{campaign.ctr}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">CPC</div>
                    <div className="font-medium">R$ {campaign.cpc}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Progresso do orçamento</span>
                    <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                  </div>
                  <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Keywords */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Palavras-chave SEO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketingData.keywords.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{keyword.keyword}</div>
                    <div className="text-xs text-muted-foreground">
                      Volume: {keyword.volume.toLocaleString()} | Dificuldade: {keyword.difficulty}%
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant={keyword.position <= 5 ? "default" : keyword.position <= 10 ? "secondary" : "outline"}>
                      #{keyword.position}
                    </Badge>
                    <span className="text-muted-foreground">{keyword.clicks} cliques</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Redes Sociais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(marketingData.socialMedia).map(([platform, data]) => (
                <div key={platform} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Share2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium capitalize">{platform}</div>
                      <div className="text-xs text-muted-foreground">
                        {data.followers.toLocaleString()} seguidores
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium">{data.engagement}% eng.</div>
                    <div className="text-muted-foreground">{data.posts} posts</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Email Marketing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Marketing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">{marketingData.emailMarketing.subscribers.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Assinantes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">R$ {marketingData.emailMarketing.revenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Receita</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Taxa de abertura</span>
                  <span className="font-medium">{marketingData.emailMarketing.openRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de clique</span>
                  <span className="font-medium">{marketingData.emailMarketing.clickRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de descadastro</span>
                  <span className="font-medium">{marketingData.emailMarketing.unsubscribeRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance de Conteúdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketingData.contentPerformance.map((content, index) => (
                <div key={index} className="border-b pb-3 last:border-b-0">
                  <div className="font-medium text-sm mb-2">{content.title}</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {content.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-3 w-3" />
                      {content.shares}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {content.leads} leads
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recomendações de Marketing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Oportunidades</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2" />
                  <div>
                    <div className="font-medium">Aumentar investimento no Google Ads</div>
                    <div className="text-muted-foreground">ROAS de 4.2x indica boa performance</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <div className="font-medium">Otimizar palavras-chave de cauda longa</div>
                    <div className="text-muted-foreground">Menor concorrência e maior conversão</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">Reativar campanha LinkedIn</div>
                    <div className="text-muted-foreground">Melhor ROAS entre todas as campanhas</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Alertas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2" />
                  <div>
                    <div className="font-medium">CAC aumentando</div>
                    <div className="text-muted-foreground">Revisar segmentação das campanhas</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium">Taxa de abertura de email baixa</div>
                    <div className="text-muted-foreground">Testar novos assuntos e horários</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2" />
                  <div>
                    <div className="font-medium">Posição SEO caindo</div>
                    <div className="text-muted-foreground">Atualizar conteúdo e backlinks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}