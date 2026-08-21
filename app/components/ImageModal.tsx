"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  images: {
    image_url: string;
  }[];
  onClose: () => void;
};

export default function ImageModal({ images, onClose }: Props) {
  const [current, setCurrent] = useState(0);

  function previous() {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function next() {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {images.length > 1 && (
          <>
            <button className="modal-arrow left" onClick={previous}>
              ‹
            </button>

            <button className="modal-arrow right" onClick={next}>
              ›
            </button>
          </>
        )}

        <Image
          src={images[current].image_url}
          alt=""
          width={1200}
          height={900}
          className="modal-image"
        />

        <p className="modal-counter">
          {current + 1} / {images.length}
        </p>

        {images.length > 1 && (
          <div className="modal-thumbnails">
            {images.map((image, index) => (
              <Image
                key={index}
                src={image.image_url}
                alt=""
                width={80}
                height={80}
                className={`thumbnail ${current === index ? "active" : ""}`}
                onClick={() => setCurrent(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
