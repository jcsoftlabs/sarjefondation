import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const alt = formData.get("alt");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Fichier manquant." }, { status: 400 });
  }
  if (typeof alt !== "string" || alt.trim().length === 0) {
    return NextResponse.json(
      { ok: false, error: "Le texte alternatif est requis." },
      { status: 400 },
    );
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: "Format non pris en charge (jpeg, png, webp uniquement)." },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Le fichier dépasse la taille maximale de 5 Mo." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const regeneratedName = randomUUID();

  const uploadResult = await new Promise<{
    secure_url: string;
    width: number;
    height: number;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { public_id: regeneratedName, folder: "sarje-fondation" },
        (error, result) => {
          if (error || !result) reject(error ?? new Error("Échec de l'upload."));
          else resolve(result);
        },
      )
      .end(buffer);
  });

  const media = await prisma.media.create({
    data: {
      url: uploadResult.secure_url,
      alt: alt.trim(),
      width: uploadResult.width,
      height: uploadResult.height,
      mimeType: file.type,
      sizeBytes: file.size,
    },
  });

  return NextResponse.json({ ok: true, media });
}
