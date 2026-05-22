import { NextResponse } from "next/server";
import { serializeLocataire, validateLocataireInput } from "@/lib/locataires";
import { ensureLocatairesTable, getDatabaseErrorMessage } from "@/lib/ensure-db";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    await ensureLocatairesTable();
    const locataires = await getPrisma().locataire.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json(locataires.map(serializeLocataire));
  } catch (error) {
    console.error("GET /api/locataires", error);
    return NextResponse.json({ error: getDatabaseErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureLocatairesTable();
    const body = await request.json();
    const input = validateLocataireInput(body);

    if (!input) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }

    const locataire = await getPrisma().locataire.create({ data: input });
    return NextResponse.json(serializeLocataire(locataire), { status: 201 });
  } catch (error) {
    console.error("POST /api/locataires", error);
    return NextResponse.json({ error: getDatabaseErrorMessage(error) }, { status: 500 });
  }
}
