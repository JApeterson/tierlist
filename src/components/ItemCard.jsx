import { useState } from 'react';

export default function ItemCard({ id, src, name, tier, onDragStart, onDragEnd, onRemove }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="item-card"
      draggable
      onDragStart={() => onDragStart(id, tier)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={name}
    >
      <img src={src} alt={name} className="item-img" />
      {hovered && (
        <button
          className="item-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          title="Remove"
        >
          ×
        </button>
      )}
    </div>
  );
}
