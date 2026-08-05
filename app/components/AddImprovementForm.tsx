"use client";

import { useEffect, useState } from "react";

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

type Props = {
  onAdd: (improvement: Improvement) => void;
  initialData?: Improvement & {
    id?: number;
  };
  isEditing?: boolean;
};

export default function AddImprovementForm({
  onAdd,
  initialData,
  isEditing,
}: Props) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    date: "",
    materialCost: "",
    laborCost: "",
    paidBy: "",
    notes: "",
    image: null as File | null,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        category: initialData.category,
        date: initialData.date,
        materialCost: initialData.materialCost.toString(),
        laborCost: initialData.laborCost.toString(),
        paidBy: initialData.paidBy,
        notes: initialData.notes,
        image: null,
      });
    } else {
      setForm({
        title: "",
        category: "",
        date: "",
        materialCost: "",
        laborCost: "",
        paidBy: "",
        notes: "",
        image: null,
      });
    }
  }, [initialData]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));
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
      image: form.image,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="improvement-form">
      <div className="field">
        <label>Nombre</label>

        <input
          name="title"
          value={form.title}
          placeholder="Ej. Cocina integral"
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label>Categoría</label>

        <input
          name="category"
          value={form.category}
          placeholder="Ej. Cocina"
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label>Fecha</label>

        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label>Material</label>

        <input
          name="materialCost"
          type="number"
          step="0.01"
          inputMode="decimal"
          value={form.materialCost}
          placeholder="$0"
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label>Mano de obra</label>

        <input
          name="laborCost"
          type="number"
          step="0.01"
          inputMode="decimal"
          value={form.laborCost}
          placeholder="$0"
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label>Pagado por</label>

        <input
          name="paidBy"
          value={form.paidBy}
          placeholder="Alondra"
          onChange={handleChange}
        />
      </div>

      <div className="field field-full">
        <label>Notas</label>

        <textarea
          name="notes"
          value={form.notes}
          placeholder="Detalles adicionales..."
          onChange={handleChange}
        />
      </div>

      <div className="field field-full">
        <label>Fotografía</label>

        <input type="file" onChange={handleFileChange} />
      </div>

      <button type="submit" className="save-button">
        {isEditing ? "Guardar cambios" : "Guardar mejora"}
      </button>
    </form>
  );
}
