import { NextResponse } from "next/server";
import { serializeBien, validateBienInput } from "@/lib/biens";
import { ensureBiensTable, getDatabaseErrorMessage } from "@/lib/ensure-db";
import { getPrisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

function parseId(id: string) {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const bienId = parseId(id);

  if (!bienId) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  try {
    await ensureBiensTable();
    const bien = await getPrisma().bien.findUnique({ where: { id: bienId } });

    if (!bien) {
      return NextResponse.json({ error: "Bien introuvable." }, { status: 404 });
    }

    return NextResponse.json(serializeBien(bien));
  } catch (error) {
    console.error(`GET /api/biens/${id}`, error);
    return NextResponse.json({ error: getDatabaseErrorMessage(error) }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const bienId = parseId(id);

  if (!bienId) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  try {
    await ensureBiensTable();
    const body = await request.json();
    const input = validateBienInput(body);

    if (!input) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }

    const bien = await getPrisma().bien.update({
      where: { id: bienId },
      data: input,
    });

    return NextResponse.json(serializeBien(bien));
  } catch (error) {
    console.error(`PUT /api/biens/${id}`, error);
    return NextResponse.json({ error: getDatabaseErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const bienId = parseId(id);

  if (!bienId) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  try {
    await ensureBiensTable();
    await getPrisma().bien.delete({ where: { id: bienId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/biens/${id}`, error);
    return NextResponse.json({ error: getDatabaseErrorMessage(error) }, { status: 500 });
  }
}
