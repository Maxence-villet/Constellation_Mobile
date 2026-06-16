// src/Http/Controllers/useMemberController.ts
import { useState } from "react";
import { AcceptInvitationAction } from "@/src/Actions/AcceptInvitationAction";
import { DeclineInvitationAction } from "@/src/Actions/DeclineInvitationAction";
import { FetchInvitationsAction } from "@/src/Actions/FetchInvitationsAction";
import { InviteMemberAction } from "@/src/Actions/InviteMemberAction";
import { SendInvitationDTO } from "@/src/DTOs/SendInvitationDTO";
import { Invitation } from "@/src/Models/Invitation";

export function useMemberController() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);

  const loadInvitations = async () => {
    try {
      setIsLoadingInvitations(true);
      const action = new FetchInvitationsAction();
      const data = await action.execute();
      setInvitations(data);
    } catch (error: any) {
      // On ignore silencieusement les erreurs de chargement (ex: 404 si aucune invitation trouvée)
      setInvitations([]);
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  const inviteMember = async (
    dto: SendInvitationDTO,
    constellationId: string,
  ): Promise<void> => {
    const action = new InviteMemberAction();
    await action.execute(dto, constellationId);
  };

  const acceptInvitation = async (memberId: string): Promise<void> => {
    const action = new AcceptInvitationAction();
    await action.execute(memberId);
    await loadInvitations();
  };

  const declineInvitation = async (memberId: string): Promise<void> => {
    const action = new DeclineInvitationAction();
    await action.execute(memberId);
    await loadInvitations();
  };

  return {
    invitations,
    isLoadingInvitations,
    loadInvitations,
    inviteMember,
    acceptInvitation,
    declineInvitation,
  };
}
