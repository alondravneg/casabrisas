"use client";

import { useState } from "react";
import ImageModal from "./ImageModal";

type Props = {
  item: {
    id: number;
    title: string;
    category: string;
    date: string;
    material_cost: number;
    labor_cost: number;
    image_url?: string;
  };
};

export default function ImprovementCard({ item }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="improvement-card">
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.title}
            className="improvement-image"
            onClick={() => setShowModal(true)}
          />
        )}

        <h3>{item.title} | {item.category}</h3>

        <p className="date-text">{item.date}</p>

        <p>Mano de obra: ${item.labor_cost.toLocaleString()}</p>

        <p>Materiales: ${item.material_cost.toLocaleString()}</p>

        <strong>
          ${(item.material_cost + item.labor_cost).toLocaleString()}
        </strong>
      </div>

      {showModal && item.image_url && (
        <ImageModal
          imageUrl={item.image_url}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
