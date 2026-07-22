import { BookOpen } from 'lucide-react';

import { UnderDevelopment } from '@/components/common/UnderDevelopment';

export default function LessonsPage() {
  return (
    <UnderDevelopment
      title="Aulas"
      description="Este módulo permitirá planear e gerir as aulas de padel disponibilizadas pelo clube."
      icon={BookOpen}
      features={[
        'Criação e edição de aulas.',
        'Definição de horários e níveis de dificuldade.',
        'Associação de treinadores.',
        'Inscrição e gestão de participantes.',
        'Controlo da capacidade de cada aula.',
      ]}
    />
  );
}