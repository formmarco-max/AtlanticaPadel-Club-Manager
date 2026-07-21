import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  active: boolean;
}

export function StatusBadge({
  active,
}: StatusBadgeProps) {
  if (active) {
    return (
      <Badge className="gap-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Ativo
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="gap-1.5"
    >
      <XCircle className="h-3.5 w-3.5" />
      Inativo
    </Badge>
  );
}