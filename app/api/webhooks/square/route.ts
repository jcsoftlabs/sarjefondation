import { NextResponse } from "next/server";
import { WebhooksHelper } from "square";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!signatureKey) {
    return NextResponse.json({ error: "Square non configuré." }, { status: 503 });
  }

  const signature = request.headers.get("x-square-hmacsha256-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  const body = await request.text();

  // L'URL de notification doit correspondre exactement à celle déclarée
  // dans le tableau de bord développeur Square pour cet abonnement webhook.
  const notificationUrl = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL ?? request.url;

  const isValid = await WebhooksHelper.verifySignature({
    requestBody: body,
    signatureHeader: signature,
    signatureKey,
    notificationUrl,
  });
  if (!isValid) {
    console.error("Webhook Square : signature invalide");
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.type === "payment.updated") {
    const payment = event.data?.object?.payment;
    if (payment?.id && payment?.status) {
      const status =
        payment.status === "COMPLETED"
          ? "SUCCEEDED"
          : payment.status === "FAILED" || payment.status === "CANCELED"
            ? "FAILED"
            : "PENDING";

      await prisma.donation.updateMany({
        where: { squarePaymentId: payment.id },
        data: { status },
      });
    }
  }

  return NextResponse.json({ received: true });
}
