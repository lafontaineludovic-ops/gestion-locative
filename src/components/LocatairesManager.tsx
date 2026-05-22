"use client";

import { useEffect, useState } from "react";
import {
  LOCATAIRE_STATUTS,
  type LocataireInput,
  type LocataireRecord,
} from "@/lib/locataires";
import type { BienRecord } from "@/lib/biens";

type FormMode = "create" | "edit";

const emptyForm: LocataireInput = {
  nom: "",
  bien: "",
  loyer: 0,
  statut: "À jour",
};

function statusClass(statut: string) {
  if (statut === "Retard") return " status-pill--danger";
  if (statut === "Archivé") return " status-pill--muted";
  return " status-pill--success";
}

export default function LocatairesManager() {
  const [locataires, setLocataires] = useState<LocataireRecord[]>([]);
  const [biens, setBiens] = useState<BienRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [formData, setFormData] = useState<LocataireInput>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadLocataires() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/locataires");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erreur lors du chargement.");
      }

      setLocataires(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  async function loadBiens() {
    try {
      const response = await fetch("/api/biens");
      const data = await response.json();

      if (response.ok) {
        setBiens(data);
      }
    } catch {
      // Liste des biens optionnelle pour le formulaire
    }
  }

  useEffect(() => {
    loadLocataires();
    loadBiens();
  }, []);

  function openCreateForm() {
    setFormMode("create");
    setEditingId(null);
    setFormData(emptyForm);
    setFormOpen(true);
  }

  function openEditForm(locataire: LocataireRecord) {
    setFormMode("edit");
    setEditingId(locataire.id);
    setFormData({
      nom: locataire.nom,
      bien: locataire.bien ?? "",
      loyer: locataire.loyer,
      statut: locataire.statut,
    });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...formData,
      bien: formData.bien?.trim() ? formData.bien.trim() : null,
    };

    try {
      const url =
        formMode === "create" ? "/api/locataires" : `/api/locataires/${editingId}`;
      const method = formMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erreur lors de l'enregistrement.");
      }

      closeForm();
      await loadLocataires();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number, nom: string) {
    const confirmed = window.confirm(`Supprimer le locataire « ${nom} » ?`);
    if (!confirmed) return;

    setError(null);

    try {
      const response = await fetch(`/api/locataires/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erreur lors de la suppression.");
      }

      await loadLocataires();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Locataires</h1>
          <p className="page-subtitle">Suivez vos locataires et leurs paiements</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreateForm}>
          + Nouveau locataire
        </button>
      </div>

      {error ? <div className="alert alert--error">{error}</div> : null}

      <div className="table-card">
        {loading ? (
          <p className="table-empty">Chargement...</p>
        ) : locataires.length === 0 ? (
          <p className="table-empty">
            Aucun locataire enregistré. Ajoutez votre premier locataire.
          </p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Bien</th>
                <th>Loyer</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locataires.map((locataire) => (
                <tr key={locataire.id}>
                  <td className="cell-strong">{locataire.nom}</td>
                  <td>{locataire.bien ?? "—"}</td>
                  <td>{locataire.loyer > 0 ? `${locataire.loyer} €` : "—"}</td>
                  <td>
                    <span className={`status-pill${statusClass(locataire.statut)}`}>
                      {locataire.statut}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => openEditForm(locataire)}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="btn-ghost btn-ghost--danger"
                        onClick={() => handleDelete(locataire.id, locataire.nom)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {formOpen ? (
        <div className="modal-overlay" onClick={closeForm}>
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="locataire-form-title"
          >
            <div className="modal-header">
              <h2 id="locataire-form-title">
                {formMode === "create" ? "Nouveau locataire" : "Modifier le locataire"}
              </h2>
              <button type="button" className="modal-close" onClick={closeForm} aria-label="Fermer">
                ×
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <label className="form-field">
                <span>Nom *</span>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Ex. Martin Dupont"
                />
              </label>

              <label className="form-field">
                <span>Bien</span>
                <select
                  value={formData.bien ?? ""}
                  onChange={(e) => {
                    const selectedBien = biens.find((b) => b.nom === e.target.value);
                    setFormData({
                      ...formData,
                      bien: e.target.value,
                      loyer: selectedBien?.loyer ?? formData.loyer,
                    });
                  }}
                >
                  <option value="">— Aucun —</option>
                  {biens.map((bien) => (
                    <option key={bien.id} value={bien.nom}>
                      {bien.nom}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Loyer (€) *</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.loyer}
                  onChange={(e) =>
                    setFormData({ ...formData, loyer: Number(e.target.value) || 0 })
                  }
                />
              </label>

              <label className="form-field">
                <span>Statut *</span>
                <select
                  required
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                >
                  {LOCATAIRE_STATUTS.map((statut) => (
                    <option key={statut} value={statut}>
                      {statut}
                    </option>
                  ))}
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeForm}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
