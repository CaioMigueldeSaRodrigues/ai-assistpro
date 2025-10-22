import { useState } from "react";
import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentMethodProps {
  onPayment: (data: any) => void;
  amount: number;
  isLoading: boolean;
}

export function PaymentMethod({ onPayment, amount, isLoading }: PaymentMethodProps) {
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '1'
  });

  const handleInputChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPayment({
      card: cardData,
      type: 'credit_card'
    });
  };

  const installmentOptions = [
    { value: '1', label: `1x R$ ${amount.toLocaleString('pt-BR')} (sem juros)` },
    { value: '2', label: `2x R$ ${(amount / 2).toLocaleString('pt-BR')} (sem juros)` },
    { value: '3', label: `3x R$ ${(amount / 3).toLocaleString('pt-BR')} (sem juros)` },
    { value: '6', label: `6x R$ ${(amount * 1.05 / 6).toLocaleString('pt-BR')} (com juros)` },
    { value: '12', label: `12x R$ ${(amount * 1.15 / 12).toLocaleString('pt-BR')} (com juros)` }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cardNumber">Número do Cartão *</Label>
        <div className="relative">
          <Input
            id="cardNumber"
            value={cardData.number}
            onChange={(e) => handleInputChange('number', formatCardNumber(e.target.value))}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            required
            className="pl-10"
          />
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div>
        <Label htmlFor="cardName">Nome no Cartão *</Label>
        <Input
          id="cardName"
          value={cardData.name}
          onChange={(e) => handleInputChange('name', e.target.value.toUpperCase())}
          placeholder="NOME COMO NO CARTÃO"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiry">Validade *</Label>
          <Input
            id="expiry"
            value={cardData.expiry}
            onChange={(e) => handleInputChange('expiry', formatExpiry(e.target.value))}
            placeholder="MM/AA"
            maxLength={5}
            required
          />
        </div>
        <div>
          <Label htmlFor="cvv">CVV *</Label>
          <div className="relative">
            <Input
              id="cvv"
              value={cardData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
              placeholder="123"
              maxLength={4}
              required
              className="pr-10"
            />
            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="installments">Parcelamento</Label>
        <Select value={cardData.installments} onValueChange={(value) => handleInputChange('installments', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o parcelamento" />
          </SelectTrigger>
          <SelectContent>
            {installmentOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processando...
          </div>
        ) : (
          `Pagar R$ ${amount.toLocaleString('pt-BR')}`
        )}
      </Button>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <img src="/stripe-logo.png" alt="Stripe" className="h-4 opacity-60" />
        <span>•</span>
        <img src="/mercadopago-logo.png" alt="Mercado Pago" className="h-4 opacity-60" />
        <span>•</span>
        <span>Pagamento seguro</span>
      </div>
    </form>
  );
}