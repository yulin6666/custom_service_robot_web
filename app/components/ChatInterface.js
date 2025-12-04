'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './ChatInterface.module.css'

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [debugLogs, setDebugLogs] = useState([])
  const [showDebug, setShowDebug] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('在线')
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 创建会话
  const createSession = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: `web_user_${Date.now()}` }),
      })
      const data = await response.json()
      setSessionId(data.session_id)
      setConnectionStatus('在线')
      return data.session_id
    } catch (error) {
      console.error('创建会话失败:', error)
      setConnectionStatus('离线')
      return null
    }
  }

  // 发送消息
  const sendMessage = async (text) => {
    if (!text.trim()) return

    // 添加用户消息到界面
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // 如果没有session_id，先创建会话
      let currentSessionId = sessionId
      if (!currentSessionId) {
        currentSessionId = await createSession()
      }

      // 发送消息到API
      const response = await fetch(`${API_URL}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          session_id: currentSessionId,
        }),
      })

      const data = await response.json()

      // 保存debug日志
      if (data.logs) {
        setDebugLogs(data.logs)
      }

      // 添加机器人回复到界面
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response || '抱歉，我现在无法回答您的问题。',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botMessage])
      setConnectionStatus('在线')
    } catch (error) {
      console.error('发送消息失败:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: '抱歉，连接服务器失败，请稍后重试。',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMessage])
      setConnectionStatus('离线')
    } finally {
      setIsLoading(false)
    }
  }

  // 处理发送按钮点击
  const handleSend = () => {
    sendMessage(inputValue)
  }

  // 处理回车发送
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 快速回复
  const handleQuickReply = (text) => {
    sendMessage(text)
  }

  // 自动调整textarea高度
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue])

  return (
    <div className={styles.chatContainer}>
      {/* 头部 */}
      <div className={styles.chatHeader}>
        <div className={styles.headerContent}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>🤖</div>
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.headerTitle}>智能客服助手</h1>
            <p className={styles.headerStatus}>
              <span className={`${styles.statusDot} ${connectionStatus === '在线' ? styles.online : styles.offline}`}></span>
              <span>{connectionStatus}</span>
            </p>
          </div>
        </div>
        <button
          className={styles.debugToggle}
          onClick={() => setShowDebug(true)}
          title="查看Debug信息"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v8m-4-4h8" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          Debug
        </button>
      </div>

      {/* 消息区域 */}
      <div className={styles.chatMessages}>
        {messages.length === 0 ? (
          <div className={styles.welcomeMessage}>
            <div className={styles.botAvatar}>🤖</div>
            <div className={styles.welcomeContent}>
              <h3>欢迎使用智能客服系统</h3>
              <p>我是您的专属智能助手，有什么可以帮助您的吗？</p>
              <div className={styles.quickReplies}>
                <button className={styles.quickReplyBtn} onClick={() => handleQuickReply('你好')}>
                  问候
                </button>
                <button className={styles.quickReplyBtn} onClick={() => handleQuickReply('查询订单ORD001')}>
                  查询订单
                </button>
                <button className={styles.quickReplyBtn} onClick={() => handleQuickReply('退货流程是什么？')}>
                  退货咨询
                </button>
                <button className={styles.quickReplyBtn} onClick={() => handleQuickReply('如何联系客服？')}>
                  联系客服
                </button>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageWrapper} ${message.type === 'user' ? styles.userWrapper : styles.botWrapper}`}
            >
              {message.type === 'bot' && <div className={styles.messageAvatar}>🤖</div>}
              <div className={`${styles.messageBubble} ${message.type === 'user' ? styles.userBubble : styles.botBubble}`}>
                <div className={styles.messageContent}>{message.content}</div>
                <div className={styles.messageTime}>{message.timestamp}</div>
              </div>
              {message.type === 'user' && <div className={styles.messageAvatar}>👤</div>}
            </div>
          ))
        )}
        {isLoading && (
          <div className={styles.messageWrapper}>
            <div className={styles.messageAvatar}>🤖</div>
            <div className={styles.loadingBubble}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className={styles.chatInputWrapper}>
        <div className={styles.chatInputContainer}>
          <textarea
            ref={textareaRef}
            className={styles.chatInput}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            rows="1"
            disabled={isLoading}
          />
          <button className={styles.sendButton} onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Debug模态框 */}
      {showDebug && (
        <div className={styles.debugModal} onClick={() => setShowDebug(false)}>
          <div className={styles.debugContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.debugHeader}>
              <h2>LangGraph执行日志</h2>
              <button className={styles.closeDebug} onClick={() => setShowDebug(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.debugBody}>
              {debugLogs.length === 0 ? (
                <p className={styles.debugEmpty}>暂无日志信息</p>
              ) : (
                <pre className={styles.debugLogs}>{debugLogs.join('\n')}</pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
