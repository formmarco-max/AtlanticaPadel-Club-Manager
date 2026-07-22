import { BarChart3 } from 'lucide-react';

import { UnderDevelopment } from '@/components/common/UnderDevelopment';

export default function ReportsPage() {
  return (
    <UnderDevelopment
      title="Relatórios"
      description="Este módulo disponibilizará indicadores operacionais e informação de apoio à gestão do clube."
      icon={BarChart3}
      features={[
        'Relatórios de ocupação dos campos.',
        'Análise da evolução do número de sócios.',
        'Indicadores de reservas e cancelamentos.',
        'Relatórios financeiros e de mensalidades.',
        'Exportação de informação para formatos externos.',
      ]}
    />
  );
}