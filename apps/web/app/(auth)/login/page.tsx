'use client';

import {
  useEffect,
  useId,
  useState,
  type FormEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  AlertCircle,
  ArrowRight,
  CalendarCheck2,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

type RecoveryStep = 'form' | 'success';

interface RecoveryModalProps {
  isOpen: boolean;
  defaultEmail: string;
  onClose: () => void;
}

function RecoveryModal({
  isOpen,
  defaultEmail,
  onClose,
}: RecoveryModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  const [recoveryEmail, setRecoveryEmail] = useState(defaultEmail);
  const [step, setStep] = useState<RecoveryStep>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setRecoveryEmail(defaultEmail);
    setStep('form');
    setIsSubmitting(false);
  }, [defaultEmail, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  async function handleRecoverySubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSubmitting(true);

    // Fluxo demonstrativo. Numa implementação completa, esta ação
    // deverá chamar o endpoint de recuperação de palavra-passe.
    await new Promise((resolve) => {
      window.setTimeout(resolve, 700);
    });

    setIsSubmitting(false);
    setStep('success');
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-background shadow-2xl"
      >
        <button
          type="button"
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={onClose}
        >
          <X className="size-4" />
        </button>

        <div className="border-b bg-gradient-to-br from-primary/12 via-primary/[0.04] to-background px-6 py-7">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {step === 'form' ? (
              <LockKeyhole className="size-6" />
            ) : (
              <CheckCircle2 className="size-6" />
            )}
          </div>

          <h2
            id={titleId}
            className="mt-5 text-2xl font-bold tracking-tight"
          >
            {step === 'form'
              ? 'Recuperar palavra-passe'
              : 'Pedido registado'}
          </h2>

          <p
            id={descriptionId}
            className="mt-2 text-sm leading-relaxed text-muted-foreground"
          >
            {step === 'form'
              ? 'Introduz o email associado à tua conta para receberes instruções de recuperação.'
              : 'O pedido de recuperação foi processado com sucesso.'}
          </p>
        </div>

        {step === 'form' ? (
          <form
            className="space-y-5 px-6 py-6"
            onSubmit={handleRecoverySubmit}
          >
            <div className="space-y-2">
              <Label htmlFor="recovery-email">Email</Label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="recovery-email"
                  name="recovery-email"
                  type="email"
                  autoComplete="email"
                  placeholder="utilizador@exemplo.pt"
                  className="h-11 pl-10"
                  value={recoveryEmail}
                  onChange={(event) =>
                    setRecoveryEmail(event.target.value)
                  }
                  disabled={isSubmitting}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/35 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              Esta funcionalidade encontra-se representada para efeitos
              de demonstração. A integração com email poderá ser
              adicionada numa fase posterior.
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Mail className="size-4" />
                )}

                {isSubmitting
                  ? 'A processar...'
                  : 'Enviar instruções'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-5 px-6 py-6">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/35 dark:text-emerald-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0" />

                <p className="leading-relaxed">
                  Caso exista uma conta associada a{' '}
                  <strong>{recoveryEmail}</strong>, serão enviadas
                  instruções para redefinir a palavra-passe.
                </p>
              </div>
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={onClose}
            >
              Voltar ao início de sessão
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

const productFeatures = [
  {
    icon: Users,
    title: 'Gestão de sócios',
    description:
      'Dados, estados e histórico centralizados.',
  },
  {
    icon: CalendarCheck2,
    title: 'Reservas e operação',
    description:
      'Acompanhamento diário de campos e reservas.',
  },
  {
    icon: ShieldCheck,
    title: 'Acesso protegido',
    description:
      'Sessões autenticadas e controlo de acesso.',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const {
    login,
    isAuthenticated,
    isLoading: isSessionLoading,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);

  useEffect(() => {
    if (!isSessionLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isSessionLoading, router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      // A persistência efetiva da sessão deverá ser tratada pelo
      // hook/useAuth ou pelo mecanismo de cookies/tokens do backend.
      // O estado é mantido para documentar a intenção funcional.
      void rememberSession;

      router.replace('/dashboard');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;

        if (typeof apiMessage === 'string') {
          setErrorMessage(apiMessage);
        } else if (Array.isArray(apiMessage)) {
          setErrorMessage(apiMessage.join(' '));
        } else {
          setErrorMessage(
            'Não foi possível iniciar sessão. Verifica os dados introduzidos.',
          );
        }
      } else {
        setErrorMessage(
          'Ocorreu um erro inesperado. Tenta novamente.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSessionLoading || isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LoaderCircle
              className="size-7 animate-spin"
              aria-label="A carregar"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            A validar sessão...
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-background lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(480px,0.95fr)]">
        <section className="relative hidden min-h-screen overflow-hidden border-r bg-slate-950 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.28),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.20),transparent_40%)]" />
          <div className="absolute -left-24 top-1/3 size-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -right-20 bottom-20 size-72 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 p-10 xl:p-14">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-bold tracking-tight shadow-xl backdrop-blur">
                APCM
              </div>

              <div>
                <p className="text-sm font-semibold tracking-wide text-white">
                  Atlantica Padel Club
                </p>
                <p className="text-xs text-slate-400">
                  Management Platform
                </p>
              </div>
            </div>

            <div className="mt-20 max-w-2xl xl:mt-24">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur">
                <Sparkles className="size-3.5 text-sky-300" />
                Gestão centralizada e eficiente
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                Gere o clube com uma visão clara de toda a operação.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                Uma plataforma académica desenvolvida para apoiar a
                gestão de sócios, reservas, campos, treinadores,
                pagamentos e indicadores operacionais.
              </p>
            </div>

            <div className="mt-14 grid max-w-2xl gap-4 xl:grid-cols-3">
              {productFeatures.map(
                ({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
                  >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-sky-300">
                      <Icon className="size-5" />
                    </div>

                    <h2 className="mt-4 text-sm font-semibold">
                      {title}
                    </h2>

                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      {description}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          <footer className="relative z-10 flex items-end justify-between gap-8 border-t border-white/10 px-10 py-7 text-xs text-slate-400 xl:px-14">
            <div>
              <p className="font-medium text-slate-300">
                Projeto Final de Licenciatura
              </p>
              <p className="mt-1">
                Universidade Atlântica · 2026
              </p>
            </div>

            <p>Versão 1.0.0</p>
          </footer>
        </section>

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-8 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.10),transparent_36%),radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.06),transparent_35%)]" />

          <div className="relative z-10 w-full max-w-md">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-lg">
                APCM
              </div>

              <div>
                <p className="font-semibold">
                  Atlantica Padel Club
                </p>
                <p className="text-xs text-muted-foreground">
                  Management Platform
                </p>
              </div>
            </div>

            <div className="rounded-3xl border bg-background/95 p-6 shadow-2xl shadow-slate-950/5 backdrop-blur sm:p-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-primary" />
                  Área reservada
                </div>

                <h2 className="mt-5 text-3xl font-bold tracking-tight">
                  Bem-vindo de volta
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Introduz as tuas credenciais para aceder à
                  plataforma de gestão.
                </p>
              </div>

              <form
                className="mt-8 space-y-5"
                onSubmit={handleSubmit}
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="utilizador@exemplo.pt"
                      autoComplete="email"
                      className="h-11 pl-10"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      disabled={isSubmitting}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="password">
                      Palavra-passe
                    </Label>

                    <button
                      type="button"
                      className="text-xs font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                      onClick={() => setIsRecoveryOpen(true)}
                    >
                      Esqueceu-se da palavra-passe?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Introduz a palavra-passe"
                      autoComplete="current-password"
                      className="h-11 px-10"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      disabled={isSubmitting}
                      required
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? 'Ocultar palavra-passe'
                          : 'Mostrar palavra-passe'
                      }
                      aria-pressed={showPassword}
                      className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <span className="relative flex size-5 shrink-0 items-center justify-center">
                    <input
                      type="checkbox"
                      className="peer size-5 appearance-none rounded-md border border-input bg-background transition-colors checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      checked={rememberSession}
                      onChange={(event) =>
                        setRememberSession(event.target.checked)
                      }
                      disabled={isSubmitting}
                    />

                    <Check className="pointer-events-none absolute size-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100" />
                  </span>

                  <span className="text-muted-foreground">
                    Manter sessão iniciada
                  </span>
                </label>

                {errorMessage && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />

                    <span className="leading-relaxed">
                      {errorMessage}
                    </span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="h-11 w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <ArrowRight className="size-4" />
                  )}

                  {isSubmitting
                    ? 'A iniciar sessão...'
                    : 'Iniciar sessão'}
                </Button>
              </form>

              <div className="mt-7 border-t pt-6">
                <div className="flex items-start gap-3 rounded-2xl bg-muted/40 px-4 py-3">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    O acesso é reservado a utilizadores autorizados.
                    As tentativas de autenticação podem ser registadas
                    para fins de segurança e auditoria.
                  </p>
                </div>
              </div>
            </div>

            <footer className="mt-8 text-center text-xs text-muted-foreground lg:hidden">
              <p>Projeto Final de Licenciatura</p>
              <p className="mt-1">
                Universidade Atlântica · 2026 · Versão 1.0.0
              </p>
            </footer>
          </div>
        </section>
      </main>

      <RecoveryModal
        isOpen={isRecoveryOpen}
        defaultEmail={email}
        onClose={() => setIsRecoveryOpen(false)}
      />
    </>
  );
}