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
};

export default function AdminPage() {
  const [improvements, setImprovements] = useState<ImprovementRow[]>([]);
  const [editingImprovement, setEditingImprovement] =
    useState<ImprovementRow | null>(null);

  useEffect(() => {
    loadImprovements();
  }, []);

  async function loadImprovements() {
    const { data, error } = await supabase
      .from("improvements")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setImprovements(data ?? []);
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

      // Borramos las imágenes anteriores
      await supabase
        .from("improvement_images")
        .delete()
        .eq("improvement_id", improvementId);
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

    alert(
      editingImprovement
        ? "Mejora actualizada correctamente"
        : "Mejora creada correctamente",
    );

    setEditingImprovement(null);

    loadImprovements();
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

      <h2
        style={{
          marginTop: "2rem",
          marginBottom: "1rem",
        }}
      >
        Mejoras existentes
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

            <button
              className="edit-button"
              onClick={() => setEditingImprovement(item)}
            >
              ✏️ Editar
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
