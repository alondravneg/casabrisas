"use client";

import { supabase } from "@/utils/supabase";
import AddImprovementForm from "../components/AddImprovementForm";

type Improvement = {
  title: string;
  category: string;
  date: string;
  materialCost: number;
  laborCost: number;
  paidBy: string;
  notes: string;
  image: File | null;
};

export default function AdminPage() {
  async function addImprovement(improvement: Improvement) {
    let imageUrl = "";

    if (improvement.image) {
      const fileName = `${Date.now()}-${improvement.image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("improvements")
        .upload(fileName, improvement.image);

      if (uploadError) {
        console.error(uploadError);
        alert("Error subiendo la imagen");
        return;
      }

      const { data } = supabase.storage
        .from("improvements")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

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
      alert("Error guardando la mejora");
      return;
    }

    alert("Mejora guardada correctamente");
  }

  return (
    <main className="container">
      <h1>Panel de administración</h1>

      <AddImprovementForm onAdd={addImprovement} />
    </main>
  );
}