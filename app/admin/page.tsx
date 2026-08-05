"use client";

import { Improvement } from "@/types";
import { supabase } from "@/utils/supabase";
import AddImprovementForm from "../components/AddImprovementForm";

export default function AdminPage() {
  async function addImprovement(improvement: Improvement) {
    const { error } = await supabase.from("improvements").insert({
      title: improvement.title,
      category: improvement.category,
      date: improvement.date,
      material_cost: improvement.materialCost,
      labor_cost: improvement.laborCost,
      paid_by: improvement.paidBy,
      notes: improvement.notes,
    });

    if (error) {
      console.error(error);
      alert("Error al guardar la mejora");
      return;
    }

    alert("Mejora guardada correctamente");
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Panel de administración</h1>

      <AddImprovementForm onAdd={addImprovement} />
    </main>
  );
}