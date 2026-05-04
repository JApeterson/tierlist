import { useState, useRef, useCallback } from 'react';
import TierRow from './components/TierRow';
import UploadZone from './components/UploadZone';
import './App.css';

const TIER_CONFIG = [
  { tier: 'S', color: '#ff7f7f' },
  { tier: 'A', color: '#ffbf7f' },
  { tier: 'B', color: '#ffdf7f' },
  { tier: 'C', color: '#ffff7f' },
  { tier: 'D', color: '#bfff7f' },
  { tier: 'F', color: '#7fbfff' },
];

const MAX_ITEMS = 20;

const initialPlacements = { S: [], A: [], B: [], C: [], D: [], F: [], unranked: [] };

export default function App() {
  const [items, setItems] = useState({});
  const [placements, setPlacements] = useState(initialPlacements);
  const dragInfo = useRef(null);

  const uploadCount = Object.keys(items).length;

  const handleUpload = useCallback((files) => {
    setItems((prevItems) => {
      const remaining = MAX_ITEMS - Object.keys(prevItems).length;
      const toProcess = Array.from(files).slice(0, remaining);
      const newItems = { ...prevItems };
      const newIds = [];

      toProcess.forEach((file) => {
        const id = crypto.randomUUID();
        newIds.push(id);
        const reader = new FileReader();
        reader.onload = (e) => {
          setItems((p) => ({ ...p, [id]: { src: e.target.result, name: file.name } }));
          setPlacements((p) => ({ ...p, unranked: [...p.unranked, id] }));
        };
        reader.readAsDataURL(file);
      });

      return newItems;
    });
  }, []);

  const onDragStart = useCallback((itemId, fromTier) => {
    dragInfo.current = { itemId, fromTier };
  }, []);

  const onDragEnd = useCallback(() => {
    dragInfo.current = null;
  }, []);

  const onDrop = useCallback((toTier) => {
    if (!dragInfo.current) return;
    const { itemId, fromTier } = dragInfo.current;
    dragInfo.current = null;
    if (fromTier === toTier) return;

    setPlacements((prev) => ({
      ...prev,
      [fromTier]: prev[fromTier].filter((id) => id !== itemId),
      [toTier]: [...prev[toTier], itemId],
    }));
  }, []);

  const onRemove = useCallback((itemId) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setPlacements((prev) => {
      const next = {};
      for (const tier of Object.keys(prev)) {
        next[tier] = prev[tier].filter((id) => id !== itemId);
      }
      return next;
    });
  }, []);

  const handleClearAll = () => {
    setItems({});
    setPlacements(initialPlacements);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">Tier List Maker</h1>
          <span className="upload-count">{uploadCount} / {MAX_ITEMS} items</span>
        </div>
        {uploadCount > 0 && (
          <button className="clear-btn" onClick={handleClearAll}>
            Clear All
          </button>
        )}
      </header>

      <main className="app-main">
        <div className="tier-list">
          {TIER_CONFIG.map(({ tier, color }) => (
            <TierRow
              key={tier}
              tier={tier}
              color={color}
              itemIds={placements[tier]}
              items={items}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
              onRemove={onRemove}
            />
          ))}
        </div>

        {uploadCount < MAX_ITEMS && (
          <UploadZone onUpload={handleUpload} remaining={MAX_ITEMS - uploadCount} />
        )}

        {uploadCount > 0 && (
          <div className="pool-section">
            <div className="pool-header">
              <span>Unranked</span>
              {placements.unranked.length === 0 && (
                <span className="pool-hint">All items ranked!</span>
              )}
            </div>
            <TierRow
              tier="unranked"
              color="#444"
              itemIds={placements.unranked}
              items={items}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
              onRemove={onRemove}
              isPool
            />
          </div>
        )}
      </main>
    </div>
  );
}
