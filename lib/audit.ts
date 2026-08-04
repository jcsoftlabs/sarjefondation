import { prisma } from "@/lib/db";

type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "PUBLISH" | "LOGIN";

export async function logAudit(params: {
  userId: string;
  action: AuditAction;
  entity: string;
  entityId?: string;
}) {
  await prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
    },
  });
}
