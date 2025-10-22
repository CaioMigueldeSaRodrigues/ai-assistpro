import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  Users, 
  Eye, 
  MousePointer, 
  Smartphone, 
  Monitor,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TrafficAnalytics() {
  const [timeRange, setTimeRange] = useState("7d");

  const trafficData = {
    totalVisitors: 12847,
    uniqueVisitors: 8934,
    pageViews: 45621,
    bounceRate: 34.2,
    avgSessionDuration: "3m 42s",
    conversionRate: 2.8,
    topPages: [
      { page: "/", views: 15234, change: 12.5 },
      { page: "/pricing", views: 8967, change: 8.3 },
      { page: "/checkout/pro", views: 3421, change: -2.1 },
      { page: "/about", views: 2156, change: 15.7 }
    ],
    trafficSources: [
      { source: "Busca Orgânica", visitors: 5234, percentage: 58.6 },
      { source: "Direto", visitors: 1876, percentage: 21.0 },
      { source: "Redes Sociais", visitors: 987, percentage: 11.0 },
      { source: "Referências", visitors: 543, percentage: 6.1 },
      { source: "Email", visitors: 294, percentage: 3.3 }
    ],
    devices: [
      { device: "Desktop", users: 4567, percentage: 51.1 },
      { device: "Mobile", users: 3654, percentage: 40.9 },
      { device: "Tablet", users: 713, percentage: 8.0 }
    ],
    topCountries: [
      { country: "Brasil", flag: "🇧🇷", visitors: 6789, percentage: 76.0 },
      { country: "Estados Unidos", flag: "🇺🇸", visitors: 1234, percentage: 13.8 },
      { country: "Portugal", flag: "🇵🇹", visitors: 456, percentage: 5.1 },
      { country: "Argentina", flag: "🇦🇷", visitors: 289, percentage: 3.2 },
      { country: "Outros", flag: "🌍", visitors: 166, percentage: 1.9 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics de Tráfego</h2>
          <p className="text-muted-foreground">Análise detalhada do comportamento dos visitantes</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Hoje</SelectItem>
            <SelectItem value="7d">7 dias</SelectItem>
            <SelectItem value="30d">30 dias</SelectItem>
            <SelectItem value="90d">90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitantes Totais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trafficData.totalVisitors.toLocaleString()}</div>
              <div className="flex items-center text-xs text-success">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% vs período anterior
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
              <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trafficData.pageViews.toLocaleString()}</div>
              <div className="flex items-center text-xs text-success">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.3% vs período anterior
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
              <CardTitle className="text-sm font-medium">Taxa de Rejeição</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trafficData.bounceRate}%</div>
              <div className="flex items-center text-xs text-destructive">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.1% vs período anterior
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
              <CardTitle className="text-sm font-medium">Duração da Sessão</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trafficData.avgSessionDuration}</div>
              <div className="flex items-center text-xs text-success">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15s vs período anterior
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Páginas Mais Visitadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trafficData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{page.page}</div>
                  <div className="text-sm text-muted-foreground">
                    {page.views.toLocaleString()} visualizações
                  </div>
                </div>
                <Badge variant={page.change > 0 ? "default" : "destructive"}>
                  {page.change > 0 ? "+" : ""}{page.change}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Fontes de Tráfego</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trafficData.trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{source.source}</div>
                  <div className="text-sm text-muted-foreground">
                    {source.visitors.toLocaleString()} visitantes
                  </div>
                </div>
                <Badge variant="outline">{source.percentage}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Dispositivos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trafficData.devices.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {device.device === "Desktop" && <Monitor className="h-4 w-4" />}
                  {device.device === "Mobile" && <Smartphone className="h-4 w-4" />}
                  {device.device === "Tablet" && <Smartphone className="h-4 w-4" />}
                  <div>
                    <div className="font-medium">{device.device}</div>
                    <div className="text-sm text-muted-foreground">
                      {device.users.toLocaleString()} usuários
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{device.percentage}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Geographic Data */}
        <Card>
          <CardHeader>
            <CardTitle>Principais Países</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trafficData.topCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{country.flag}</span>
                  <div>
                    <div className="font-medium">{country.country}</div>
                    <div className="text-sm text-muted-foreground">
                      {country.visitors.toLocaleString()} visitantes
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{country.percentage}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            Atividade em Tempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-success">47</div>
              <div className="text-sm text-muted-foreground">Usuários online agora</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">156</div>
              <div className="text-sm text-muted-foreground">Visualizações na última hora</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Conversões hoje</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}