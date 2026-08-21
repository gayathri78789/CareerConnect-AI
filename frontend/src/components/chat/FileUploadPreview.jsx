export function FileUploadPreview({ attachments = [], onRemove }) {
  if (attachments.length === 0) return null;

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  };

  const getFileIcon = (mimeType, name = '') => {
    const ext = name.split('.').pop().toLowerCase();
    if (mimeType?.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) {
      return '🖼️';
    }
    if (mimeType === 'application/pdf' || ext === 'pdf') {
      return '📕';
    }
    if (['doc', 'docx'].includes(ext) || mimeType?.includes('word')) {
      return '📘';
    }
    return '📄';
  };

  return (
    <div className="file-preview-container">
      <div className="file-preview-list">
        {attachments.map((file, index) => {
          const isImage = file.mimeType?.startsWith('image/') || file.type?.startsWith('image/');
          return (
            <div key={file.id || index} className="file-preview-chip">
              <div className="file-preview-chip__thumb">
                {isImage && file.base64 ? (
                  <img src={file.base64} alt={file.name} className="file-preview-chip__img" />
                ) : (
                  <span className="file-preview-chip__icon">{getFileIcon(file.mimeType, file.name)}</span>
                )}
              </div>

              <div className="file-preview-chip__info">
                <span className="file-preview-chip__name" title={file.name}>
                  {file.name}
                </span>
                <span className="file-preview-chip__size">{formatFileSize(file.size)}</span>
              </div>

              {file.uploading ? (
                <div className="file-preview-chip__progress">
                  <div className="file-preview-chip__bar" style={{ width: `${file.progress || 60}%` }} />
                </div>
              ) : (
                <button
                  type="button"
                  className="file-preview-chip__remove"
                  onClick={() => onRemove(index)}
                  title="Remove attachment"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
