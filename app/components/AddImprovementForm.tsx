"use client";

import { useState } from "react";

export default function AddImprovementForm() {
  const [form, setForm] = useState({
    title: "",
    materialCost: "",
    laborCost: "",
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

    console.log({
      ...form,
      total:
        Number(form.materialCost) + Number(form.laborCost),
    });

    alert("Mejora guardada");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Nombre de la mejora"
        onChange={handleChange}
      />

      <input
        name="materialCost"
        type="number"
        placeholder="Costo del material"
        onChange={handleChange}
      />

      <input
        name="laborCost"
        type="number"
        placeholder="Costo de mano de obra"
        onChange={handleChange}
      />

      <textarea
        name="notes"
        placeholder="Notas"
        onChange={handleChange}
      />

      <button type="submit">
        Guardar mejora
      </button>
    </form>
  );
}