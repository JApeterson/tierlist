import { useRef } from 'react';

export default function UploadZone({ onUpload, remaining }) {
  const inputRef = useRef(null);
  const zoneRef = useRef(null);
  const dragCounter = useRef(0);

  const handleFiles = (files) => {
    const images = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (images.length > 0) onUpload(images);
  };

  const handleDragEnter = (e) => {
    // Only react to file drags, not internal item drags
    if (!e.dataTransfer.types.includes('Files')) return;
    dragCounter.current++;
    zoneRef.current?.classList.add('upload-zone--active');
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      zoneRef.current?.classList.remove('upload-zone--active');
    }
  };

  const handleDragOver = (e) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
    }
  };

  const handleDrop = (e) => {
    if (!e.dataTransfer.types.includes('Files')) return;
    e.preventDefault();
    dragCounter.current = 0;
    zoneRef.current?.classList.remove('upload-zone--active');
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      ref={zoneRef}
      className="upload-zone"
      onClick={() => inputRef.current.click()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="upload-icon">⬆</div>
      <p className="upload-text">Click to browse or drag images here</p>
      <p className="upload-sub">
        {remaining} slot{remaining !== 1 ? 's' : ''} remaining · JPG, PNG, GIF, WebP
      </p>
    </div>
  );
}
