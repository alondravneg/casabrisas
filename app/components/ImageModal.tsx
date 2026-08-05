"use client";

type Props = {
  imageUrl: string;
  onClose: () => void;
};

export default function ImageModal({
  imageUrl,
  onClose,
}: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-close">✕</button>

      <img
        className="modal-image"
        src={imageUrl}
        alt="Imagen completa"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}