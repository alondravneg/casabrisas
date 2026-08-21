"use client";

import { useState } from "react";
import Image from "next/image";

import ImageModal from "./ImageModal";

type Props = {
  item: {
    id: number;
    title: string;
    category: string;
    date: string;
    material_cost: number;
    labor_cost: number;

    improvement_images: {
      id: number;
      image_url: string;
      is_deleted: boolean;
    }[];
  };
};

export default function ImprovementCard({ item }: Props) {
  const [showModal, setShowModal] = useState(false);

  const activeImages =
    item.improvement_images?.filter((image) => !image.is_deleted) ?? [];

  return (
    <>
      <div className="improvement-card">
        {activeImages.length > 0 && (
          <Image
            src={activeImages[0].image_url}
            alt={item.title}
            width={400}
            height={250}
            className="improvement-image"
            onClick={() => setShowModal(true)}
          />
        )}

        <h3>
          {item.title} | {item.category}
        </h3>

        <p className="date-text">{item.date}</p>

        <p>Mano de obra: ${item.labor_cost.toLocaleString()}</p>

        <p>Materiales: ${item.material_cost.toLocaleString()}</p>

        <p style={{ color: "#777", fontSize: ".85rem", marginBottom: ".9rem" }}>
          📷 {item.improvement_images.filter((img) => !img.is_deleted).length}{" "}
          fotos
        </p>

        <strong>
          ${(item.material_cost + item.labor_cost).toLocaleString()}
        </strong>
      </div>

      {showModal && activeImages.length > 0 && (
        <ImageModal
          images={item.improvement_images.filter((img) => !img.is_deleted)}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
