import { useState, useRef } from 'react';
import { FileUploadPreview } from './FileUploadPreview.jsx';

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'webp', 'gif'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_FILES = 10;

export function ChatInput({ onSend, isStreaming, onStop }) {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        reject(`Unsupported file format .${ext}. Allowed formats: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG, WEBP, GIF.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        reject(`File ${file.name} exceeds maximum limit of 20MB.`);
        return;
      }

      const reader = new FileReader();
      const isTextFile = ['txt', 'doc', 'docx'].includes(ext);

      if (isTextFile) {
        reader.readAsText(file);
        reader.onload = () => {
          resolve({
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            type: file.type || 'text/plain',
            mimeType: file.type || 'text/plain',
            size: file.size,
            extractedText: reader.result,
          });
        };
      } else {
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve({
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            type: file.type || (ext === 'pdf' ? 'application/pdf' : 'image/png'),
            mimeType: file.type || (ext === 'pdf' ? 'application/pdf' : 'image/png'),
            size: file.size,
            base64: reader.result,
          });
        };
      }
      reader.onerror = () => reject(`Failed to read file ${file.name}`);
    });
  };

  const handleFilesSelect = async (filesList) => {
    setErrorMessage('');
    const files = Array.from(filesList);

    if (attachments.length + files.length > MAX_FILES) {
      setErrorMessage(`Maximum limit of ${MAX_FILES} attachments per message.`);
      return;
    }

    try {
      const processed = await Promise.all(files.map(processFile));
      setAttachments((prev) => [...prev, ...processed]);
    } catch (err) {
      setErrorMessage(typeof err === 'string' ? err : 'Error processing upload');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelect(e.target.files);
    }
    e.target.value = '';
  };

  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if ((!input.trim() && attachments.length === 0) || isStreaming) return;
    onSend(input.trim(), attachments);
    setInput('');
    setAttachments([]);
    setErrorMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelect(e.dataTransfer.files);
    }
  };

  return (
    <div
      className={`chat-input-wrapper ${isDragging ? 'chat-input-wrapper--dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {errorMessage && (
        <div className="chat-input-error-banner">
          <span>⚠️ {errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage('')}>×</button>
        </div>
      )}

      {isDragging && (
        <div className="chat-drag-overlay">
          <div className="chat-drag-overlay__content">
            <span className="chat-drag-overlay__icon">📥</span>
            <strong>Drop files here to upload</strong>
            <span>PDF, DOC, DOCX, TXT, PNG, JPG, WEBP (Max 20MB)</span>
          </div>
        </div>
      )}

      <FileUploadPreview attachments={attachments} onRemove={handleRemoveAttachment} />

      <div className="chat-input-card">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.gif"
          style={{ display: 'none' }}
        />

        {/* Paperclip Upload Button */}
        <button
          type="button"
          className="chat-attach-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isStreaming || attachments.length >= MAX_FILES}
          title="Attach files (PDF, DOCX, TXT, Images)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
          {attachments.length > 0 && <span className="chat-attach-badge">{attachments.length}</span>}
        </button>

        {/* Text Area Input */}
        <textarea
          className="chat-input-field"
          placeholder="Ask me anything, or upload resumes, JDs, certificates..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isStreaming}
        />

        {/* Send / Stop Button */}
        {isStreaming ? (
          <button
            type="button"
            className="chat-stop-btn"
            onClick={onStop}
            title="Stop generating"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            <span>Stop</span>
          </button>
        ) : (
          <button
            type="button"
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim() && attachments.length === 0}
            title="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        )}
      </div>

      <div className="chat-disclaimer">
        <span className="chat-disclaimer-icon">ⓘ</span>
        <span>CareerPrep AI Coach can make mistakes. Verify important career information &amp; document analysis.</span>
      </div>
    </div>
  );
}
