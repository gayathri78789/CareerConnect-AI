import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MessageBubble({ message, userInitials, isLast, onRegenerate }) {
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  const isUser = message.role === 'user';

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const renderCodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeText = String(children).replace(/\n$/, '');
    const codeId = `code-${Math.random().toString(36).substring(2, 6)}`;

    if (!inline) {
      return (
        <div className="code-block-wrapper">
          <div className="code-block-header">
            <span className="code-block-lang">{match ? match[1] : 'code'}</span>
            <button
              type="button"
              className="code-block-copy-btn"
              onClick={() => handleCopyText(codeText, codeId)}
            >
              {copiedCodeId === codeId ? '✓ Copied' : '📋 Copy Code'}
            </button>
          </div>
          <pre className="code-block-pre">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    }
    return (
      <code className="inline-code" {...props}>
        {children}
      </code>
    );
  };

  return (
    <div className={`message-bubble-row ${isUser ? 'message-bubble-row--user' : 'message-bubble-row--assistant'}`}>
      <div className="message-avatar">
        {isUser ? (
          <div className="user-avatar-chip">{userInitials || 'U'}</div>
        ) : (
          <div className="bot-avatar-chip">✨</div>
        )}
      </div>

      <div className="message-content-wrapper">
        <div className="message-header-meta">
          <span className="message-author">{isUser ? 'You' : 'CareerPrep AI Coach'}</span>
          <span className="message-time">{message.time || 'Just now'}</span>
        </div>

        {/* User Attachments display */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="message-attachments-list">
            {message.attachments.map((file, i) => (
              <div key={file.id || i} className="message-attachment-chip">
                <span className="message-attachment-icon">
                  {file.mimeType?.startsWith('image/') ? '🖼️' : file.name?.endsWith('.pdf') ? '📕' : '📄'}
                </span>
                <span className="message-attachment-name">{file.name}</span>
                {file.size > 0 && (
                  <span className="message-attachment-size">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="message-bubble-body">
          {isUser ? (
            <div className="message-user-text">{message.text || message.content}</div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: renderCodeBlock,
              }}
            >
              {message.text || message.content || ''}
            </ReactMarkdown>
          )}
        </div>

        {/* Action toolbar for assistant response */}
        {!isUser && (
          <div className="message-actions-toolbar">
            <button
              type="button"
              className="btn-msg-action"
              onClick={() => handleCopyText(message.text || message.content, message.id)}
              title="Copy message text"
            >
              {copiedCodeId === message.id ? '✓ Copied' : '📋 Copy'}
            </button>
            {isLast && onRegenerate && (
              <button
                type="button"
                className="btn-msg-action"
                onClick={onRegenerate}
                title="Regenerate response"
              >
                🔄 Regenerate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
