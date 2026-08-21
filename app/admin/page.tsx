"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import AddImprovementForm from "../components/AddImprovementForm";

type Improvement = {
  id?: number;
  title: string;
  category: string;
  date: string;
  materialCost: number;
  laborCost: number;
  paidBy: string;
  notes: string;
  images: File[];
};

type ImprovementRow = {
  id: number;
  title: string;
  category: string;
  date: string;
  material_cost: number;
  labor_cost: number;
  paid_by: string;
  notes: string;
  improvement_images: {
    id: number;
    image_url: string;
    is_deleted: boolean;
  }[];
};

export default function AdminPage() {
  const [improvements, setImprovements] = useState<ImprovementRow[]>([]);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [editingImprovement, setEditingImprovement] =
    useState<ImprovementRow | null>(null);

  useEffect(() => {
    loadImprovements();
  }, []);

  async function loadImprovements() {
    const { data, error } = await supabase
      .from("improvements")
      .select(
        `
    *,
    improvement_images (
      id,
      image_url,
      is_deleted
    )
  `,
      )
      .order("date", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setImprovements(data ?? []);
  }

  async function deleteImage(imageId: number) {
    const { error } = await supabase
      .from("improvement_images")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq("id", imageId);

    if (error) {
      console.error(error);
      alert("Error eliminando imagen");
      return;
    }

    setEditingImprovement((current) => {
      if (!current) return null;

      return {
        ...current,
        improvement_images: current.improvement_images.map((img) =>
          img.id === imageId
            ? {
                ...img,
                is_deleted: true,
              }
            : img,
        ),
      };
    });

    await loadImprovements();
  }

  async function saveImprovement(improvement: Improvement) {
    let improvementId: number;

    if (editingImprovement) {
      const { error } = await supabase
        .from("improvements")
        .update({
          title: improvement.title,
          category: improvement.category,
          date: improvement.date,
          material_cost: improvement.materialCost,
          labor_cost: improvement.laborCost,
          paid_by: improvement.paidBy,
          notes: improvement.notes,
        })
        .eq("id", editingImprovement.id);

      if (error) {
        console.error(error);
        alert("Error actualizando la mejora");
        return;
      }

      improvementId = editingImprovement.id!;
    } else {
      const { data, error } = await supabase
        .from("improvements")
        .insert({
          title: improvement.title,
          category: improvement.category,
          date: improvement.date,
          material_cost: improvement.materialCost,
          labor_cost: improvement.laborCost,
          paid_by: improvement.paidBy,
          notes: improvement.notes,
        })
        .select()
        .single();

      if (error || !data) {
        console.error(error);
        alert("Error guardando la mejora");
        return;
      }

      improvementId = data.id;
    }

    // Subir todas las imágenes
    if (improvement.images.length > 0) {
      for (const file of improvement.images) {
        const fileName = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("improvements")
          .upload(fileName, file);

        if (uploadError) {
          console.error(uploadError);
          continue;
        }

        const { data } = supabase.storage
          .from("improvements")
          .getPublicUrl(fileName);

        const { error: imageError } = await supabase
          .from("improvement_images")
          .insert({
            improvement_id: improvementId,
            image_url: data.publicUrl,
          });

        if (imageError) {
          console.error(imageError);
        }
      }
    }

    alert(
      editingImprovement
        ? "Mejora actualizada correctamente"
        : "Mejora creada correctamente",
    );

    setEditingImprovement(null);

    await loadImprovements();
  }

  return (
    <main className="container">
      <h1 className="improvements-title">Panel de administración</h1>

      {editingImprovement && (
        <button
          className="cancel-edit-button"
          onClick={() => setEditingImprovement(null)}
        >
          ← Agregar nueva mejora
        </button>
      )}

      <AddImprovementForm
        onAdd={saveImprovement}
        isEditing={!!editingImprovement}
        initialData={
          editingImprovement
            ? {
                title: editingImprovement.title,
                category: editingImprovement.category,
                date: editingImprovement.date,
                materialCost: editingImprovement.material_cost,
                laborCost: editingImprovement.labor_cost,
                paidBy: editingImprovement.paid_by,
                notes: editingImprovement.notes,
                images: [],
              }
            : undefined
        }
      />

      {editingImprovement &&
        editingImprovement.improvement_images?.filter((img) => !img.is_deleted)
          .length > 0 && (
          <div
            style={{
              marginTop: "1rem",
              marginBottom: "2rem",
            }}
          >
            <h3 className="section-title">📷 Fotos actuales</h3>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              {editingImprovement.improvement_images
                .filter((img) => !img.is_deleted)
                .map((image) => (
                  <div
                    key={image.id}
                    style={{
                      position: "relative",
                    }}
                  >
                    <img
                      src={image.image_url}
                      alt=""
                      className="current-image"
                    />

                    <button
                      onClick={() => setImageToDelete(image.id)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        background: "#fff",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

      <h2
        style={{
          marginTop: "2rem",
          marginBottom: "1rem",
        }}
        className="section-title"
      >
        🏚️ Mejoras existentes
      </h2>

      <div className="improvements">
        {improvements.map((item) => (
          <div key={item.id} className="improvement-card">
            <h3>{item.title}</h3>

            <p>{item.category}</p>

            <p
              style={{
                fontSize: ".9rem",
                color: "#777",
              }}
            >
              {item.date}
            </p>

            <strong>
              ${(item.material_cost + item.labor_cost).toLocaleString()}
            </strong>
            <p style={{ color: "#777", fontSize: ".85rem", marginBottom: ".9rem" }}>
              📷{" "}
              {item.improvement_images.filter((img) => !img.is_deleted).length}{" "}
              fotos
            </p>
            <p>
              <button
                className="cancel-edit-button"
                onClick={() => setEditingImprovement(item)}
              >
                ✏️ Editar
              </button>
            </p>
          </div>
        ))}
      </div>

      {imageToDelete && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Eliminar fotografía</h3>

            <p>
              La fotografía se ocultará del historial, pero podrá recuperarse
              después.
            </p>

            <div className="confirm-actions">
              <button
                className="secondary-button"
                onClick={() => setImageToDelete(null)}
              >
                Cancelar
              </button>

              <button
                className="danger-button"
                onClick={async () => {
                  await deleteImage(imageToDelete);
                  setImageToDelete(null);
                }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
