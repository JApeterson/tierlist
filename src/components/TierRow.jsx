import { useRef } from 'react';
import ItemCard from './ItemCard';

export default function TierRow({
  tier,
  color,
  itemIds,
  items,
  onDragStart,
  onDragEnd,
  onDrop,
  onRemove,
  isPool,
}) {
  const dropRef = useRef(null);
  const dragCounter = useRef(0);

  const handleDragEnter = () => {
    dragCounter.current++;
    dropRef.current?.classList.add('drop-active');
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      dropRef.current?.classList.remove('drop-active');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    dropRef.current?.classList.remove('drop-active');
    onDrop(tier);
  };

  return (
    <div className={`tier-row${isPool ? ' tier-row--pool' : ''}`}>
      {!isPool && (
        <div className="tier-label" style={{ backgroundColor: color }}>
          {tier}
        </div>
      )}
      <div
        ref={dropRef}
        className={`tier-items${isPool ? ' tier-items--pool' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {itemIds.map((id) =>
          items[id] ? (
            <ItemCard
              key={id}
              id={id}
              src={items[id].src}
              name={items[id].name}
              tier={tier}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onRemove={onRemove}
            />
          ) : null
        )}
        {itemIds.length === 0 && !isPool && (
          <span className="tier-empty-hint">Drop items here</span>
        )}
      </div>
    </div>
  );
}
