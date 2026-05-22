"use client";

import { useEffect, useState } from "react";
import {
  BIEN_STATUTS,
  BIEN_TYPES,
  type BienInput,
  type BienRecord,
} from "@/lib/biens";

type FormMode = "create" | "edit";

const emptyForm: BienInput = {
  nom: "",
  type: "Appartement",
  adresse: "",
  loyer: 0,
  statut: "Vacant",
};

function statusClass(statut: string) {
  if (statut === "Vacant" || statut === "En travaux") return " status-pill--warning";
  if (statut === "Archivé") return " status-pill--muted";
  return " status-pill--success";
}

export default function BiensManager() {
  const [biens, setBiens] = useState<BienRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [formData, setFormData] = useState<BienInput>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadBiens() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/biens");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erreur lors du chargement.");
      }

      setBiens(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBiens();
  }, []);

  function openCreateForm() {
    setFormMode("create");
    setEditingId(null);
    setFormData(emptyForm);
    setFormOpen(true);
  }

  function openEditForm(bien: BienRecord) {
    setFormMode("edit");
    setEditingId(bien.id);
    setFormData({
      nom: bien.nom,
      type: bien.type,
      adresse: bien.adresse ?? "",
      loyer: bien.loyer,
      statut: bien.statut,
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
      adresse: formData.adresse?.trim() ? formData.adresse.trim() : null,
    };

    try {
      const url = formMode === "create" ? "/api/biens" : `/api/biens/${editingId}`;
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
      await loadBiens();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number, nom: string) {
    const confirmed = window.confirm(`Supprimer le bien « ${nom} » ?`);
    if (!confirmed) return;

    setError(null);

    try {
      const response = await fetch(`/api/biens/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erreur lors de la suppression.");
      }

      await loadBiens();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Biens</h1>
          <p className="page-subtitle">Gérez votre parc immobilier</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreateForm}>
          + Nouveau bien
        </button>
      </div>

      {error ? <div className="alert alert--error">{error}</div> : null}

      <div className="table-card">
        {loading ? (
          <p className="table-empty">Chargement...</p>
        ) : biens.length === 0 ? (
          <p className="table-empty">Aucun bien enregistré. Ajoutez votre premier bien.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Adresse</th>
                <th>Loyer</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {biens.map((bien) => (
                <tr key={bien.id}>
                  <td className="cell-strong">{bien.nom}</td>
                  <td>{bien.type}</td>
                  <td>{bien.adresse ?? "—"}</td>
                  <td>{bien.loyer > 0 ? `${bien.loyer} €` : "—"}</td>
                  <td>
                    <span className={`status-pill${statusClass(bien.statut)}`}>
                      {bien.statut}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => openEditForm(bien)}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="btn-ghost btn-ghost--danger"
                        onClick={() => handleDelete(bien.id, bien.nom)}
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
            aria-labelledby="bien-form-title"
          >
            <div className="modal-header">
              <h2 id="bien-form-title">
                {formMode === "create" ? "Nouveau bien" : "Modifier le bien"}
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
                  placeholder="Ex. Appartement T3 — Lyon 3e"
                />
              </label>

              <label className="form-field">
                <span>Type *</span>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  {BIEN_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Adresse</span>
                <input
                  type="text"
                  value={formData.adresse ?? ""}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  placeholder="Ex. 12 rue Garibaldi, Lyon"
                />
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
                  {BIEN_STATUTS.map((statut) => (
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
