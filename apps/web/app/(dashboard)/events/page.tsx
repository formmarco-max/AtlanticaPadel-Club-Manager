import { Trophy } from 'lucide-react';

import { UnderDevelopment } from '@/components/common/UnderDevelopment';

export default function EventsPage() {
  return (
    <UnderDevelopment
      title="Eventos"
      description="Este módulo permitirá organizar torneios, competições e outros eventos promovidos pelo clube."
      icon={Trophy}
      features={[
        'Criação e divulgação de eventos.',
        'Gestão de torneios e categorias.',
        'Inscrição de participantes.',
        'Definição de datas, horários e campos.',
        'Consulta dos resultados das competições.',
      ]}
    />
  );
}