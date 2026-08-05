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
  image: File | null;
  imageUrl?: string;
};

export default function AdminPage() {
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [editingImprovement, setEditingImprovement] =
    useState<Improvement | null>(null);

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

    setImprovements(
      data.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        date: item.date,
        materialCost: item.material_cost,
        laborCost: item.labor_cost,
        paidBy: item.paid_by,
        notes: item.notes,
        image: null,
        imageUrl: item.image_url,
      })),
    );
  }

  async function saveImprovement(improvement: Improvement) {
    let imageUrl = editingImprovement?.imageUrl ?? "";

    if (improvement.image) {
      const fileName = `${Date.now()}-${improvement.image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("improvements")
        .upload(fileName, improvement.image);

      if (uploadError) {
        alert("Error subiendo la imagen");
        return;
      }

      const { data } = supabase.storage
        .from("improvements")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

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
          image_url: imageUrl,
        })
        .eq("id", editingImprovement.id);

      if (error) {
        console.error(error);
        alert("Error actualizando");
        return;
      }

      alert("Mejora actualizada");
      setEditingImprovement(null);
    } else {
      const { error } = await supabase.from("improvements").insert({
        title: improvement.title,
        category: improvement.category,
        date: improvement.date,
        material_cost: improvement.materialCost,
        labor_cost: improvement.laborCost,
        paid_by: improvement.paidBy,
        notes: improvement.notes,
        image_url: imageUrl,
      });

      if (error) {
        console.error(error);
        alert("Error guardando");
        return;
      }

      alert("Mejora creada");
    }

    loadImprovements();
  }

  return (
    <main className="container">
      <h1 className="improvements-title">Panel de administración</h1>

      {editingImprovement && (
        <button
          style={{
            marginBottom: "1rem",
            backgroundColor: "#c2e1e1ff",
            color: "#6d6d6dff",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            borderRadius: "20px"
          }}
          onClick={() => setEditingImprovement(null)}
        >
          ← Salir de edición
        </button>
      )}
      <AddImprovementForm
        onAdd={saveImprovement}
        initialData={editingImprovement ?? undefined}
        isEditing={!!editingImprovement}
      />

      <h2 style={{ marginTop: "2rem" }}>Mejoras existentes</h2>

      <div className="improvements">
        {improvements.map((item) => (
          <div key={item.id} className="improvement-card">
            <h3>{item.title}</h3>

            <p>{item.category}</p>

            <strong>
              ${(item.materialCost + item.laborCost).toLocaleString()}
            </strong>

            <button
              style={{
                marginBottom: "1rem",
                backgroundColor: "#c2e1e1ff",
                color: "#6d6d6dff",
                border: "none",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                borderRadius: "20px"
              }}
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
