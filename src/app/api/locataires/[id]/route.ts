import { NextResponse } from "next/server";
import { serializeLocataire, validateLocataireInput } from "@/lib/locataires";
import { ensureLocatairesTable, getDatabaseErrorMessage } from "@/lib/ensure-db";
import { getPrisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

function parseId(id: string) {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const locataireId = parseId(id);

  if (!locataireId) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  try {
    await ensureLocatairesTable();
    const locataire = await getPrisma().locataire.findUnique({ where: { id: locataireId } });

    if (!locataire) {
      return NextResponse.json({ error: "Locataire introuvable." }, { status: 404 });
    }

    return NextResponse.json(serializeLocataire(locataire));
  } catch (error) {
    console.error(`GET /api/locataires/${id}`, error);
    return NextResponse.json({ error: getDatabaseErrorMessage(error) }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const locataireId = parseId(id);

  if (!locataireId) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  try {
    await ensureLocatairesTable();
    const body = await request.json();
    const input = validateLocataireInput(body);

    if (!input) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }

    const locataire = await getPrisma().locataire.update({
      where: { id: locataireId },
      data: input,
    });

    return NextResponse.json(serializeLocataire(locataire));
  } catch (error) {
    console.error(`PUT /api/locataires/${id}`, error);
    return NextResponse.json({ error: getDatabaseErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const locataireId = parseId(id);

  if (!locataireId) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  try {
    await ensureLocatairesTable();
    await getPrisma().locataire.delete({ where: { id: locataireId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/locataires/${id}`, error);
    return NextResponse.json({ error: getDatabaseErrorMessage(error) }, { status: 500 });
  }
}
