import { CreditCard } from 'lucide-react';

import { UnderDevelopment } from '@/components/common/UnderDevelopment';

export default function MembershipsPage() {
  return (
    <UnderDevelopment
      title="Mensalidades"
      description="Este módulo permitirá acompanhar os planos, pagamentos e situações financeiras dos sócios."
      icon={CreditCard}
      features={[
        'Criação de planos de mensalidade.',
        'Associação de planos aos sócios.',
        'Registo e consulta de pagamentos.',
        'Identificação de mensalidades em atraso.',
        'Histórico financeiro por sócio.',
      ]}
    />
  );
}