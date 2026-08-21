"use client";

import { useState } from "react";
import ImageModal from "./ImageModal";
import Image from "next/image";

type Props = {
  item: {
    id: number;
    title: string;
    category: string;
    date: string;
    material_cost: number;
    labor_cost: number;

    improvement_images: {
      image_url: string;
    }[];
  };
};

export default function ImprovementCard({ item }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="improvement-card">
        {item.improvement_images?.length > 0 && (
          <Image
            src={item.improvement_images[0].image_url}
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

        <strong>
          ${(item.material_cost + item.labor_cost).toLocaleString()}
        </strong>
      </div>

      {showModal && (
        <ImageModal
          images={item.improvement_images}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
