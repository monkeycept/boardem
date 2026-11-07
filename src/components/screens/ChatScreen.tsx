import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useFlightStore } from '../../stores/flightStore'
import { useUserStore } from '../../stores/userStore'
import { MessageCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ChatScreen() {
  const { messages, addMessage } = useFlightStore()
  const { userName, userAvatar } = useUserStore()
  const [inputText, setInputText] = useState('')

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      senderName: userName || 'You',
      senderAvatar: userAvatar || '👤',
      text: inputText,
      timestamp: Date.now(),
      isSystemMessage: false,
    }

    addMessage(newMessage)
    setInputText('')
    toast.success('Message sent!', { icon: '💬' })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-slate-700/50 p-4 flex items-center gap-2"
      >
        <MessageCircle className="w-5 h-5 text-cyan-400" />
        <div>
          <h2 className="font-bold text-cyan-300">Flight Chat</h2>
          <p className="text-xs text-slate-400">Everyone on your flight</p>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-full text-center"
          >
            <div>
              <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No messages yet</p>
              <p className="text-xs text-slate-500 mt-1">Say hello to other passengers!</p>
            </div>
          </motion.div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex gap-2"
            >
              {/* Avatar */}
              <div className="text-2xl flex-shrink-0">{msg.senderAvatar}</div>

              {/* Message */}
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-sm text-cyan-300">{msg.senderName}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="glass rounded-lg p-3 text-sm text-slate-100">
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-t border-slate-700/50 p-4 space-y-3"
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Say hello..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input-base flex-1"
          />
          <button
            onClick={handleSendMessage}
            className="btn-primary flex items-center justify-center w-10 h-10 p-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
