'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: isSessionLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSessionLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isSessionLoading, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

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
      <main className="flex min-h-screen items-center justify-center">
        <LoaderCircle
          className="size-8 animate-spin"
          aria-label="A carregar"
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            APCM
          </div>

          <CardTitle className="text-2xl">
            Atlantica Padel Club Manager
          </CardTitle>

          <CardDescription>
            Introduz as tuas credenciais para aceder à aplicação.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="utilizador@exemplo.pt"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Palavra-passe</Label>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Introduz a palavra-passe"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <LoaderCircle className="animate-spin" />
              )}

              {isSubmitting ? 'A iniciar sessão...' : 'Iniciar sessão'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}