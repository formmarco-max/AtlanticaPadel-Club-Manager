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
  GraduationCap,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 py-8 backdrop-blur-sm"
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
        className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_28px_80px_-24px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950"
      >
        <button
          type="button"
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={onClose}
        >
          <X className="size-4" />
        </button>

        <div className="border-b bg-gradient-to-br from-cyan-500/10 via-primary/[0.04] to-background px-6 py-7">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
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
                  className="h-12 rounded-xl pl-10"
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
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600">
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
      <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(500px,0.88fr)]">
        <section className="relative hidden min-h-screen overflow-hidden border-r border-white/10 text-white lg:flex lg:flex-col lg:justify-between">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/images/padel-login.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-slate-950/68" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.92)_0%,rgba(2,6,23,0.68)_48%,rgba(2,6,23,0.38)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_85%_75%,rgba(16,185,129,0.12),transparent_38%)]" />
          <div className="absolute left-0 top-[18%] h-[48%] w-[78%] bg-gradient-to-r from-slate-950/65 via-slate-950/30 to-transparent blur-2xl" />

          <div className="relative z-10 flex min-h-[calc(100vh-96px)] flex-col px-10 py-10 xl:px-14 xl:py-12">
            <div className="flex items-center gap-4">
              <span className="h-0.5 w-7 rounded-full bg-cyan-400" />

              <p className="text-[15px] font-extrabold uppercase tracking-[0.12em] text-white">
                Atlantica Padel Club Manager
              </p>
            </div>

            <div className="my-auto max-w-3xl py-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-slate-950/35 px-3 py-1.5 text-xs font-medium text-cyan-200 shadow-lg backdrop-blur-md">
                <Sparkles className="size-3.5" />
                Gestão centralizada e eficiente
              </div>

              <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-white xl:text-5xl 2xl:text-6xl">
                Gere o clube com uma visão clara de toda a operação.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 xl:text-lg">
                Uma plataforma moderna para centralizar a gestão de
                clubes de padel, reunindo sócios, reservas, campos,
                torneios, pagamentos e indicadores operacionais numa
                única aplicação.
              </p>

              <div className="mt-12 grid max-w-3xl gap-4 xl:grid-cols-3">
                {productFeatures.map(
                  ({ icon: Icon, title, description }) => (
                    <div
                      key={title}
                      className="rounded-3xl border border-white/15 bg-slate-950/35 p-5 shadow-[0_18px_45px_-18px_rgba(0,0,0,0.75)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-slate-950/45 hover:shadow-[0_24px_60px_-22px_rgba(34,211,238,0.35)]"
                    >
                      <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-cyan-300">
                        <Icon className="size-5" />
                      </div>

                      <h2 className="mt-5 text-sm font-semibold text-white xl:text-base">
                        {title}
                      </h2>

                      <p className="mt-2 text-xs leading-relaxed text-slate-300 xl:text-sm">
                        {description}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <footer className="relative z-10 flex items-end justify-between gap-8 border-t border-white/10 px-10 py-7 text-xs text-slate-300 backdrop-blur-sm xl:px-14">
            <div className="flex items-start gap-3">
              <GraduationCap className="mt-0.5 size-5 text-cyan-300" />

              <div>
                <p className="font-medium text-white">
                  Projeto Final de Licenciatura
                </p>
                <p className="mt-1">
                  Universidade Atlântica · 2026
                </p>
              </div>
            </div>

            <p>Versão 1.0.0</p>
          </footer>
        </section>

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.06),transparent_34%)]" />

          <div className="relative z-10 w-full max-w-[31rem]">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <span className="h-0.5 w-7 rounded-full bg-cyan-500" />

              <p className="font-extrabold uppercase tracking-[0.08em]">
                Atlantica Padel Club Manager
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200/90 bg-white/95 p-7 shadow-[0_28px_80px_-30px_rgba(15,23,42,0.42)] backdrop-blur-xl sm:p-9">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                  <ShieldCheck className="size-3.5 text-cyan-600" />
                  Área reservada
                </div>

                <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-[2rem]">
                  Bem-vindo de volta
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Introduz as tuas credenciais para aceder à
                  plataforma de gestão.
                </p>
              </div>

              <form
                className="mt-8 space-y-5"
                onSubmit={handleSubmit}
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-800">
                    Email
                  </Label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="utilizador@exemplo.pt"
                      autoComplete="email"
                      className="h-12 rounded-xl border-slate-200 bg-white pl-10 shadow-sm transition focus-visible:ring-cyan-500"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (errorMessage) {
                          setErrorMessage('');
                        }
                      }}
                      disabled={isSubmitting}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label
                      htmlFor="password"
                      className="text-slate-800"
                    >
                      Palavra-passe
                    </Label>

                    <button
                      type="button"
                      className="text-xs font-medium text-slate-600 transition-colors hover:text-cyan-700 hover:underline"
                      onClick={() => setIsRecoveryOpen(true)}
                    >
                      Esqueceu-se da palavra-passe?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Introduz a palavra-passe"
                      autoComplete="current-password"
                      className="h-12 rounded-xl border-slate-200 bg-white px-10 shadow-sm transition focus-visible:ring-cyan-500"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (errorMessage) {
                          setErrorMessage('');
                        }
                      }}
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
                      className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
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
                      className="peer size-5 appearance-none rounded-md border border-slate-300 bg-white transition-colors checked:border-slate-950 checked:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      checked={rememberSession}
                      onChange={(event) =>
                        setRememberSession(event.target.checked)
                      }
                      disabled={isSubmitting}
                    />

                    <Check className="pointer-events-none absolute size-3.5 text-white opacity-0 peer-checked:opacity-100" />
                  </span>

                  <span className="text-slate-600">
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
                  className="h-12 w-full rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-lg shadow-slate-950/10 transition-all hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl disabled:hover:translate-y-0 disabled:hover:brightness-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <ArrowRight className="size-4 text-cyan-300" />
                  )}

                  {isSubmitting
                    ? 'A iniciar sessão...'
                    : 'Iniciar sessão'}
                </Button>
              </form>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <div className="flex items-start gap-3 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-emerald-50/70 px-4 py-4">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-slate-700" />

                  <p className="text-xs leading-relaxed text-slate-600">
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