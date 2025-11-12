import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Image as ImageIcon,
  DollarSign,
  MoreVertical,
  ArrowLeft,
} from 'lucide-react';
import { chatAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import socketService from '../services/socket';
import { Card } from '../components/Cards';
import Avatar from '../components/Avatar';
import { InlineMessage } from '../components/InlineForm';
import Button, { IconButton } from '../components/Button';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const ChatPage = () => {
  const { id: chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const messagesEndRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchChats();
    
    // Socket listeners
    socketService.onNewMessage(handleNewMessage);
    socketService.onUserTyping(handleUserTyping);
    socketService.onUserStopTyping(handleUserStopTyping);

    return () => {
      socketService.removeAllListeners('new-message');
      socketService.removeAllListeners('user-typing');
      socketService.removeAllListeners('user-stop-typing');
      if (currentChat) {
        socketService.leaveChat(currentChat._id);
      }
    };
  }, []);

  useEffect(() => {
    if (chatId) {
      fetchChatById(chatId);
    } else if (chats.length > 0) {
      selectChat(chats[0]);
    }
  }, [chatId, chats.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getAll();
      setChats(response.data.data.chats);
    } catch (error) {
      toast.error('Failed to load chats');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatById = async (id) => {
    try {
      const response = await chatAPI.getById(id);
      const chat = response.data.data.chat;
      setCurrentChat(chat);
      setMessages(chat.messages || []);
      
      // Join socket room
      socketService.joinChat(id);
      
      // Mark as read
      await chatAPI.markAsRead(id);
    } catch (error) {
      toast.error('Failed to load chat');
    }
  };

  const selectChat = (chat) => {
    if (currentChat) {
      socketService.leaveChat(currentChat._id);
    }
    navigate(`/chat/${chat._id}`);
  };

  const handleNewMessage = (data) => {
    if (data.chatId === currentChat?._id) {
      setMessages((prev) => [...prev, data.message]);
      chatAPI.markAsRead(data.chatId);
    }
    
    // Update chat list
    setChats((prev) =>
      prev.map((chat) =>
        chat._id === data.chatId
          ? { ...chat, lastMessage: data.message }
          : chat
      )
    );
  };

  const handleUserTyping = ({ userId }) => {
    if (userId !== user.id) {
      setTypingUsers((prev) => new Set(prev).add(userId));
    }
  };

  const handleUserStopTyping = ({ userId }) => {
    setTypingUsers((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  };

  const handleTyping = () => {
    if (currentChat) {
      socketService.startTyping(currentChat._id, user.id);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds
      typingTimeoutRef.current = setTimeout(() => {
        socketService.stopTyping(currentChat._id, user.id);
      }, 2000);
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || !currentChat) return;

    setIsSending(true);
    
    try {
      await chatAPI.sendMessage(currentChat._id, {
        content: content.trim(),
        type: 'text',
      });
      
      setMessageInput('');
      socketService.stopTyping(currentChat._id, user.id);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find((p) => p._id !== user.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-16">
        <MessageCircle className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
        <h3 className="text-xl font-display font-semibold mb-2">
          No conversations yet
        </h3>
        <p className="text-text-secondary mb-6">
          Start browsing listings to connect with sellers
        </p>
        <Button variant="accent" onClick={() => navigate('/listings')}>
          Browse Listings
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Chat List */}
      <Card elevated className="p-0 overflow-hidden flex flex-col lg:col-span-1">
        <div className="p-4 border-b border-neutral-200 dark:border-ground-700">
          <h2 className="text-xl font-display font-bold">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const otherUser = getOtherParticipant(chat);
            const isActive = currentChat?._id === chat._id;
            const unreadCount = chat.unreadCount?.get(user.id) || 0;

            return (
              <motion.button
                key={chat._id}
                onClick={() => selectChat(chat)}
                className={clsx(
                  'w-full p-4 flex items-start gap-3 hover:bg-neutral-50 dark:hover:bg-ground-800 transition-colors border-l-4',
                  isActive
                    ? 'border-accent-500 bg-gradient-subtle'
                    : 'border-transparent'
                )}
                whileHover={{ x: 4 }}
              >
                <Avatar
                  src={otherUser?.avatar}
                  name={otherUser?.name}
                  size="md"
                  status={otherUser?.lastActive ? 'online' : 'offline'}
                />
                
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold truncate">{otherUser?.name}</p>
                    {chat.lastMessage && (
                      <span className="text-xs text-text-tertiary">
                        {formatDistanceToNow(new Date(chat.lastMessage.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-text-secondary truncate flex-1">
                      {chat.listing?.title}
                    </p>
                    {unreadCount > 0 && (
                      <span className="flex-shrink-0 px-2 py-0.5 bg-accent-500 text-white text-xs rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Chat Window */}
      <Card elevated className="p-0 overflow-hidden flex flex-col lg:col-span-2">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-neutral-200 dark:border-ground-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconButton
                  icon={ArrowLeft}
                  variant="ghost"
                  onClick={() => navigate('/chat')}
                  className="lg:hidden"
                />
                <Avatar
                  src={getOtherParticipant(currentChat)?.avatar}
                  name={getOtherParticipant(currentChat)?.name}
                  size="md"
                />
                <div>
                  <p className="font-semibold">
                    {getOtherParticipant(currentChat)?.name}
                  </p>
                  <button
                    onClick={() => navigate(`/listings/${currentChat.listing._id}`)}
                    className="text-sm text-accent-600 hover:text-accent-700"
                  >
                    {currentChat.listing?.title}
                  </button>
                </div>
              </div>
              
              <IconButton icon={MoreVertical} variant="ghost" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => {
                  const isOwn = message.sender._id === user.id;
                  const showAvatar =
                    index === 0 ||
                    messages[index - 1].sender._id !== message.sender._id;

                  return (
                    <motion.div
                      key={message._id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={clsx(
                        'flex gap-2',
                        isOwn ? 'flex-row-reverse' : 'flex-row'
                      )}
                    >
                      {showAvatar ? (
                        <Avatar
                          src={message.sender.avatar}
                          name={message.sender.name}
                          size="sm"
                        />
                      ) : (
                        <div className="w-8" />
                      )}

                      <div
                        className={clsx(
                          'max-w-[70%] rounded-lg px-4 py-2',
                          isOwn
                            ? 'bg-gradient-accent text-white'
                            : 'bg-surface-elevated'
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p
                          className={clsx(
                            'text-xs mt-1',
                            isOwn ? 'text-white/70' : 'text-text-tertiary'
                          )}
                        >
                          {format(new Date(message.createdAt), 'p')}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Typing Indicator */}
              {typingUsers.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <Avatar
                    src={getOtherParticipant(currentChat)?.avatar}
                    size="sm"
                  />
                  <div className="flex gap-1 px-4 py-2 rounded-lg bg-surface-elevated">
                    <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce delay-75" />
                    <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce delay-150" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-neutral-200 dark:border-ground-700">
              <InlineMessage
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                onSubmit={handleSendMessage}
                disabled={isSending}
                placeholder="Type a message..."
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
              <p className="text-text-secondary">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatPage;