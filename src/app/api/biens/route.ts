import { NextResponse } from "next/server";
import { serializeBien, validateBienInput } from "@/lib/biens";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const biens = await prisma.bien.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json(biens.map(serializeBien));
  } catch (error) {
    console.error("GET /api/biens", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les biens. Vérifiez la connexion à la base de données." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = validateBienInput(body);

    if (!input) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }

    const bien = await prisma.bien.create({ data: input });
    return NextResponse.json(serializeBien(bien), { status: 201 });
  } catch (error) {
    console.error("POST /api/biens", error);
    return NextResponse.json(
      { error: "Impossible de créer le bien." },
      { status: 500 }
    );
  }
}
