import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Construction,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

interface UnderDevelopmentProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
}

export function UnderDevelopment({
  title,
  description,
  icon: Icon,
  features,
}: UnderDevelopmentProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-5xl items-center justify-center">
      <div className="relative w-full overflow-hidden rounded-3xl border bg-background shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0f4c81] via-cyan-500 to-emerald-400" />

        <div className="grid gap-8 p-6 md:grid-cols-[1fr_0.85fr] md:p-10 lg:p-12">
          <div className="flex flex-col justify-center">
            <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#0f4c81]/10 text-[#0f4c81]">
              <Icon className="size-8" />
            </div>

            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700">
              <Construction className="size-3.5" />
              Módulo em desenvolvimento
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              {description}
            </p>

            <div className="mt-8">
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0f4c81] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#163a5f]"
              >
                <ArrowLeft className="size-4" />
                Voltar ao Dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border bg-muted/30 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Sparkles className="size-5" />
              </div>

              <div>
                <p className="font-semibold">Funcionalidades previstas</p>
                <p className="text-sm text-muted-foreground">
                  Planeadas para uma versão futura
                </p>
              </div>
            </div>

            <ul className="space-y-4">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm leading-6"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-2 border-t pt-5 text-xs text-muted-foreground">
              <Clock3 className="size-4" />
              Funcionalidade incluída no roadmap do APCM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}