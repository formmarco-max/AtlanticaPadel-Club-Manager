import { Settings } from 'lucide-react';

import { UnderDevelopment } from '@/components/common/UnderDevelopment';

export default function SettingsPage() {
  return (
    <UnderDevelopment
      title="Definições"
      description="Este módulo permitirá configurar os principais parâmetros de funcionamento da aplicação e do clube."
      icon={Settings}
      features={[
        'Configuração dos dados do clube.',
        'Gestão de horários de funcionamento.',
        'Definição de regras de reserva.',
        'Configuração de notificações.',
        'Personalização de preferências da aplicação.',
      ]}
    />
  );
}