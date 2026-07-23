'use client';

import { UserPlus, UserRoundPen } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MemberForm } from '@/features/members/components/MemberForm';
import type { Member } from '@/types/member';

interface MemberDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  member?: Member | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: (member: Member) => void;
}

export function MemberDialog({
  open,
  mode,
  member,
  onOpenChange,
  onSuccess,
}: MemberDialogProps) {
  const isEditMode = mode === 'edit';

  function handleSuccess(savedMember: Member) {
    onSuccess(savedMember);
    onOpenChange(false);
  }

  function handleCancel() {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {isEditMode ? (
                <UserRoundPen className="size-5" />
              ) : (
                <UserPlus className="size-5" />
              )}
            </div>

            <div className="space-y-1">
              <DialogTitle>
                {isEditMode ? 'Editar sócio' : 'Novo sócio'}
              </DialogTitle>

              <DialogDescription>
                {isEditMode
                  ? 'Atualiza os dados do sócio selecionado.'
                  : 'Preenche os dados necessários para registar um novo sócio no clube.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="pt-2">
          <MemberForm
            key={
              isEditMode && member
                ? `edit-${member.id}`
                : 'create-member'
            }
            mode={mode}
            member={member}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}