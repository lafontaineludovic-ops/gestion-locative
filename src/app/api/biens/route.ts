import { NextResponse } from "next/server";
import { serializeBien, validateBienInput } from "@/lib/biens";
import { ensureBiensTable, getDatabaseErrorMessage } from "@/lib/ensure-db";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    await ensureBiensTable();
    const biens = await getPrisma().bien.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json(biens.map(serializeBien));
  } catch (error) {
    console.error("GET /api/biens", error);
    return NextResponse.json({ error: getDatabaseErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureBiensTable();
    const body = await request.json();
    const input = validateBienInput(body);

    if (!input) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }

    const bien = await getPrisma().bien.create({ data: input });
    return NextResponse.json(serializeBien(bien), { status: 201 });
  } catch (error) {
    console.error("POST /api/biens", error);
    return NextResponse.json({ error: getDatabaseErrorMessage(error) }, { status: 500 });
  }
}
