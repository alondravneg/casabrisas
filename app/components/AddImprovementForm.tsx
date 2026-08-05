"use client";

import { useState } from "react";

type Improvement = {
  title: string;
  category: string;
  date: string;
  materialCost: number;
  laborCost: number;
  paidBy: string;
  notes: string;
};

type Props = {
  onAdd: (improvement: Improvement) => void;
};

export default function AddImprovementForm({ onAdd }: Props) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    date: "",
    materialCost: "",
    laborCost: "",
    paidBy: "",
    notes: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onAdd({
      title: form.title,
      category: form.category,
      date: form.date,
      materialCost: Number(form.materialCost),
      laborCost: Number(form.laborCost),
      paidBy: form.paidBy,
      notes: form.notes,
    });

    setForm({
      title: "",
      category: "",
      date: "",
      materialCost: "",
      laborCost: "",
      paidBy: "",
      notes: "",
    });
  }

return (
  <form
    onSubmit={handleSubmit}
    style={{
      display: "grid",
      gap: "12px",
      maxWidth: "600px",
      marginTop: "20px",
    }}
  >
    <input
      name="title"
      placeholder="Nombre de la mejora"
      value={form.title}
      onChange={handleChange}
      style={{ padding: "10px" }}
    />

    <input
      name="category"
      placeholder="Categoría"
      value={form.category}
      onChange={handleChange}
      style={{ padding: "10px" }}
    />

    <input
      name="date"
      type="date"
      value={form.date}
      onChange={handleChange}
      style={{ padding: "10px" }}
    />

    <input
      name="materialCost"
      type="number"
      placeholder="Costo del material"
      value={form.materialCost}
      onChange={handleChange}
      style={{ padding: "10px" }}
    />

    <input
      name="laborCost"
      type="number"
      placeholder="Costo de mano de obra"
      value={form.laborCost}
      onChange={handleChange}
      style={{ padding: "10px" }}
    />

    <input
      name="paidBy"
      placeholder="Pagado por"
      value={form.paidBy}
      onChange={handleChange}
      style={{ padding: "10px" }}
    />

    <textarea
      name="notes"
      placeholder="Notas"
      value={form.notes}
      onChange={handleChange}
      style={{ padding: "10px", minHeight: "100px" }}
    />

    <button
      type="submit"
      style={{
        padding: "12px",
        cursor: "pointer",
      }}
    >
      Guardar mejora
    </button>
  </form>
);
}