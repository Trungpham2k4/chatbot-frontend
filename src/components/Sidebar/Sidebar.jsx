import React from 'react';
import './Sidebar.css';
import '../../services/api/authService';

const Sidebar = ({ 
  conversations, 
  currentConversation,
  onNewChat, 
  onSelectConversation,
  isOpen, 
  toggleSidebar,
  isLoggedIn,
}) => {
  // Thêm hàm kiểm tra conversation active
  const isActive = (conversation) => {
    return currentConversation?.id === conversation.id;
  };
  const validConversations = Array.isArray(conversations) ? conversations : [];
  return (
    <>
        {isLoggedIn && (
          <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <button className="new-chat-btn" onClick={onNewChat}>
              <span>+</span> Cuộc trò chuyện mới
            </button>
            <button className="close-sidebar" onClick={toggleSidebar} aria-label="Đóng sidebar">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"></path>
              </svg>
            </button>
          </div>
          
          <div className="conversation-list">
            {validConversations.map(conversation => (
              <div 
                key={conversation.id}
                className={`conversation-item ${isActive(conversation) ? 'active' : ''}`}
                onClick={() => {
                  onSelectConversation(conversation);
                  // Đóng sidebar trên mobile
                  if (window.innerWidth <= 768) {
                    toggleSidebar();
                  }
                }}
              >
                {/* <svg viewBox="0 0 24 24" width="18" height="18" className="conversation-icon">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" fill="currentColor"></path>
                </svg> */}
                <span className="conversation-title">{conversation.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      
      {/* Nút mở sidebar khi đóng */}
      {isLoggedIn && !isOpen && (
        <button className="open-sidebar-btn" onClick={toggleSidebar}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"></path>
          </svg>
        </button>
      )}
    </>
  );
};

export default Sidebar;