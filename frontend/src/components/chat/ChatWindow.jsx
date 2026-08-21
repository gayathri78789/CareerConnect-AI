import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatSidebar } from './ChatSidebar.jsx';
import { ChatHeader } from './ChatHeader.jsx';
import { ChatEmptyState } from './ChatEmptyState.jsx';
import { MessageBubble } from './MessageBubble.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';
import { SuggestionChips } from './SuggestionChips.jsx';
import { QuickActionsPanel } from './QuickActionsPanel.jsx';
import { ChatInput } from './ChatInput.jsx';

import { API_BASE_URL } from '../../services/api.js';

function getAuthHeaders() {
  const token = localStorage.getItem('careerprep_token') || '';
  const userId = localStorage.getItem('careerprep_userid') || '';
  const userName = localStorage.getItem('careerprep_username') || '';
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
    'x-user-id': userId,
    'x-user-name': encodeURIComponent(userName),
  };
}

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// All AI responses come exclusively from the backend (Gemini API).
// There is no client-side fallback — failures show a user-friendly error message.

export function ChatWindow({ user }) {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [targetCompany, setTargetCompany] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickPanelCollapsed, setIsQuickPanelCollapsed] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const streamingMsgIdRef = useRef(null);

  const candidateName = user?.name || 'User';
  const userInitials = candidateName.trim().split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  // Fetch coach data & chat sessions on mount or session change
  const loadCoachSessionData = useCallback(async (sessionId = null) => {
    try {
      const url = sessionId ? `${API_BASE_URL}/coach?sessionId=${sessionId}` : `${API_BASE_URL}/coach`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
        setActiveSessionId(data.activeSessionId || null);
        setTargetRole(data.targetRole || 'Software Engineer');
        setTargetCompany(data.targetCompany || '');

        if (data.history && Array.isArray(data.history)) {
          setMessages(
            data.history.map((m, i) => ({
              id: m.id || `msg-${i}-${Date.now()}`,
              role: m.role,
              time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Earlier',
              text: m.content || m.text || '',
              attachments: m.attachments || [],
            }))
          );
        } else {
          setMessages([]);
        }
      }
    } catch (err) {
      console.error('[CHAT LOAD ERROR]:', err);
    } finally {
      setHistoryLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadCoachSessionData();
  }, [loadCoachSessionData]);

  // Session Management Actions
  const handleSelectSession = (sessionId) => {
    if (isStreaming) return;
    setActiveSessionId(sessionId);
    loadCoachSessionData(sessionId);
  };

  const handleCreateSession = useCallback(async () => {
    if (isStreaming) return;
    try {
      const res = await fetch(`${API_BASE_URL}/chat/sessions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: 'New Conversation' }),
      });
      if (res.ok) {
        const newSession = await res.json();
        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        setMessages([]);
        setSuggestions(['Review my resume', 'Practice interview questions', 'Create study plan']);
      }
    } catch (err) {
      console.error('[CREATE SESSION ERROR]:', err);
    }
  }, [isStreaming]);

  const handleUpdateSession = async (sessionId, patch) => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, ...patch } : s))
        );
      }
    } catch (err) {
      console.error('[UPDATE SESSION ERROR]:', err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const remaining = sessions.filter((s) => s.id !== sessionId);
        setSessions(remaining);
        if (remaining.length > 0) {
          const nextSessionId = remaining[0].id;
          setActiveSessionId(nextSessionId);
          loadCoachSessionData(nextSessionId);
        } else {
          handleCreateSession();
        }
      }
    } catch (err) {
      console.error('[DELETE SESSION ERROR]:', err);
    }
  };

  // Sending message with real-time SSE streaming & resilience
  const handleSend = useCallback(async (text, attachments = []) => {
    if ((!text.trim() && attachments.length === 0) || isStreaming) return;

    setSuggestions([]);

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      time: formatTime(),
      text: text.trim(),
      attachments,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setIsStreaming(true);

    const botMsgId = `bot-${Date.now()}`;
    streamingMsgIdRef.current = botMsgId;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let streamedSuccess = false;

    // Stream Strategy: SSE Stream
    try {
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          message: text.trim(),
          attachments,
          sessionId: activeSessionId,
        }),
        signal: controller.signal,
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let firstChunk = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);

              if (event.type === 'chunk') {
                if (!firstChunk) {
                  firstChunk = true;
                  streamedSuccess = true;
                  setIsThinking(false);
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: botMsgId,
                      role: 'assistant',
                      time: formatTime(),
                      text: event.content,
                    },
                  ]);
                } else {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === botMsgId ? { ...m, text: m.text + event.content } : m
                    )
                  );
                }
              } else if (event.type === 'suggestions') {
                setSuggestions(event.suggestions || []);
              }
            } catch {
              // Ignore malformed lines
            }
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setIsThinking(false);
        setIsStreaming(false);
        return;
      }
      console.warn('[SSE STREAM FAIL]: Falling back to standard POST /chat handler...', err.message);
    }

    // Standard POST /chat Fallback if SSE Stream failed
    if (!streamedSuccess && !controller.signal.aborted) {
      try {
        const res = await fetch(`${API_BASE_URL}/chat`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            message: text.trim(),
            attachments,
            sessionId: activeSessionId,
          }),
          signal: controller.signal,
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.reply || data.response || data.text;
          if (reply) {
            streamedSuccess = true;
            setIsThinking(false);
            setMessages((prev) => [
              ...prev,
              {
                id: botMsgId,
                role: 'assistant',
                time: formatTime(),
                text: reply,
              },
            ]);
            setSuggestions(data.suggestions || ['Review my resume', 'Practice interview', 'Find skill gaps']);
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          setIsThinking(false);
          setIsStreaming(false);
          return;
        }
        console.error('[CHAT POST FAIL]:', err.message);
      }
    }

    // If both stream and POST failed, show a user-friendly error message
    if (!streamedSuccess && !controller.signal.aborted) {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: 'assistant',
          time: formatTime(),
          text: "Sorry, I'm having trouble connecting to the AI service. Please try again in a moment.",
          isError: true,
        },
      ]);
    }

    setIsStreaming(false);
    setIsThinking(false);
    abortControllerRef.current = null;
    streamingMsgIdRef.current = null;

    // Refresh sessions list
    loadCoachSessionData(activeSessionId);
  }, [activeSessionId, isStreaming, loadCoachSessionData]);

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const handleRegenerate = useCallback(() => {
    const userMessages = messages.filter((m) => m.role === 'user');
    if (userMessages.length === 0) return;

    const lastUserMsg = userMessages[userMessages.length - 1];

    setMessages((prev) => {
      const lastBotIndex = prev.findLastIndex((m) => m.role === 'assistant');
      if (lastBotIndex > -1) {
        return prev.filter((_, i) => i !== lastBotIndex);
      }
      return prev;
    });

    setSuggestions([]);
    setTimeout(() => handleSend(lastUserMsg.text, lastUserMsg.attachments || []), 100);
  }, [messages, handleSend]);

  const handleClearChat = useCallback(async () => {
    try {
      if (activeSessionId) {
        await fetch(`${API_BASE_URL}/chat/sessions/${activeSessionId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
      }
      await fetch(`${API_BASE_URL}/chat/clear`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error('[CLEAR CHAT ERROR]:', err);
    }

    setMessages([]);
    setSuggestions([]);
    setShowClearDialog(false);

    const remaining = sessions.filter((s) => s.id !== activeSessionId);
    setSessions(remaining);
    if (remaining.length > 0) {
      const nextSessionId = remaining[0].id;
      setActiveSessionId(nextSessionId);
      loadCoachSessionData(nextSessionId);
    } else {
      handleCreateSession();
    }
  }, [activeSessionId, sessions, loadCoachSessionData, handleCreateSession]);

  const isEmpty = historyLoaded && messages.length === 0;

  return (
    <div className="chat-layout-wrapper">
      {/* Sessions Sidebar */}
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onCreateSession={handleCreateSession}
        onUpdateSession={handleUpdateSession}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Content */}
      <div className="chat-container">
        <ChatHeader
          userInitials={userInitials}
          targetRole={targetRole}
          targetCompany={targetCompany}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onToggleQuickActions={() => setIsQuickPanelCollapsed((prev) => !prev)}
          onClearChat={() => setShowClearDialog(true)}
        />

        <div className="chat-messages-area">
          {isEmpty ? (
            <ChatEmptyState onSendPrompt={(p) => handleSend(p, [])} />
          ) : (
            <div className="chat-messages-list">
              {messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id || i}
                  message={msg}
                  userInitials={userInitials}
                  isLast={i === messages.length - 1 && msg.role === 'assistant'}
                  onRegenerate={!isStreaming ? handleRegenerate : null}
                />
              ))}

              {isThinking && <TypingIndicator />}

              {!isStreaming && suggestions.length > 0 && (
                <SuggestionChips suggestions={suggestions} onSelect={(p) => handleSend(p, [])} />
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <ChatInput
          onSend={handleSend}
          isStreaming={isStreaming}
          onStop={handleStop}
        />
      </div>

      {/* Quick Actions Panel */}
      <QuickActionsPanel
        onSelectAction={(prompt) => handleSend(prompt, [])}
        isCollapsed={isQuickPanelCollapsed}
        onToggleCollapse={() => setIsQuickPanelCollapsed((prev) => !prev)}
      />

      {/* Clear Chat Confirmation Modal Overlay (Global Fixed Portal Level) */}
      {showClearDialog && (
        <div className="chat-dialog-overlay" onClick={() => setShowClearDialog(false)}>
          <div className="chat-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="chat-dialog__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>
            <h3 className="chat-dialog__title">Delete conversation?</h3>
            <p className="chat-dialog__text">
              Are you sure you want to delete this chat conversation? All messages will be permanently removed.
            </p>
            <div className="chat-dialog__actions">
              <button
                type="button"
                className="chat-dialog__btn chat-dialog__btn--cancel"
                onClick={() => setShowClearDialog(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="chat-dialog__btn chat-dialog__btn--confirm"
                onClick={handleClearChat}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                <span>Yes, Delete Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
