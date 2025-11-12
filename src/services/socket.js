import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(userId) {
    if (this.socket?.connected) return;

    const token = localStorage.getItem('accessToken');
    
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.connected = true;
      
      // Join user's personal room
      if (userId) {
        this.socket.emit('join', userId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Join chat room
  joinChat(chatId) {
    if (this.socket?.connected) {
      this.socket.emit('join-chat', chatId);
    }
  }

  // Leave chat room
  leaveChat(chatId) {
    if (this.socket?.connected) {
      this.socket.emit('leave-chat', chatId);
    }
  }

  // Typing indicators
  startTyping(chatId, userId) {
    if (this.socket?.connected) {
      this.socket.emit('typing', { chatId, userId });
    }
  }

  stopTyping(chatId, userId) {
    if (this.socket?.connected) {
      this.socket.emit('stop-typing', { chatId, userId });
    }
  }

  // Event listeners
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }

  onUserStopTyping(callback) {
    if (this.socket) {
      this.socket.on('user-stop-typing', callback);
    }
  }

  onNewOrder(callback) {
    if (this.socket) {
      this.socket.on('new-order', callback);
    }
  }

  onOrderStatusUpdate(callback) {
    if (this.socket) {
      this.socket.on('order-status-update', callback);
    }
  }

  onOrderCancelled(callback) {
    if (this.socket) {
      this.socket.on('order-cancelled', callback);
    }
  }

  onMeetupUpdated(callback) {
    if (this.socket) {
      this.socket.on('meetup-updated', callback);
    }
  }

  onOfferResponse(callback) {
    if (this.socket) {
      this.socket.on('offer-response', callback);
    }
  }

  // Remove event listener
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Remove all listeners for an event
  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
    }
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;