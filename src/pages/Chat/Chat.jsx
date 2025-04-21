import React, { useState, useEffect, useRef} from 'react';
// import { useCallback, use } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import conversationService from '../../services/api/conversationService';
import messageService from '../../services/api/messageService';
import './Chat.css';
import { useLocation } from 'react-router';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [isLoadingMore, setIsLoadingMore] = useState(false);
  // const [hasMore, setHasMore] = useState(true);
  // const [page, setPage] = useState(1);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();
  const isLoggedIn = location.state?.isLoggedIn || false; // Kiểm tra trạng thái đăng nhập từ location.state
  const username = location.state?.username || ''; // Lấy username từ location.state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isSidebarOpen){
      const chatMain = document.querySelector('.chat-main');
      chatMain.classList.remove('sidebar-open');
    }else{
      const chatMain = document.querySelector('.chat-main');
      chatMain.classList.toggle('sidebar-open');
    }
  };

  // Load conversations khi vào trang Chat
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoading(true);
        const data = await conversationService.getConversations(username);
        setConversations(data);
        if (data.length > 0) {
          setCurrentConversation(data[0]);
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConversations();
  }, [username]);

  // Load messages khi conversation thay đổi
  useEffect(() => {
    if (!currentConversation) return;
    
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        setMessages([]);
        // setPage(1);
        // setHasMore(true);

        const newMessages = await messageService.getMessages(currentConversation.id);
        
        // const { messages: newMessages, hasMore } = await messageService.getMessages(
        //   currentConversation.id,
        //   1,
        //   20
        // );
        
        setMessages(newMessages);
        // setHasMore(hasMore);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [currentConversation]);

  // Lazy load khi scroll lên
  // const handleScroll = useCallback(() => {
  //   if (!messagesContainerRef.current || isLoadingMore || !hasMore) return;
    
  //   const { scrollTop } = messagesContainerRef.current;
  //   if (scrollTop < 100) { // Khi scroll gần lên đầu
  //     loadMoreMessages();
  //   }
  // }, [isLoadingMore, hasMore]);

  // const loadMoreMessages = async () => {
  //   if (isLoadingMore || !hasMore) return;
    
  //   try {
  //     setIsLoadingMore(true);
  //     const nextPage = page + 1;
      
  //     const mess = await messageService.getMessages(
  //       currentConversation.id,
  //       nextPage,
  //       20
  //     );
  //     setMessages(mess);
      
  //     setMessages(prev => [...newMessages, ...prev]);
  //     setHasMore(more);
  //     setPage(nextPage);
      
  //     // Giữ vị trí scroll sau khi load thêm
  //     if (messagesContainerRef.current) {
  //       const { scrollHeight, clientHeight } = messagesContainerRef.current;
  //       messagesContainerRef.current.scrollTop = scrollHeight - clientHeight - 100;
  //     }
  //   } catch (error) {
  //     console.error('Failed to load more messages:', error);
  //   } finally {
  //     setIsLoadingMore(false);
  //   }
  // };

  // Tạo conversation mới
  
  const handleNewChat = async () => {
    try {
      // Nếu chưa có tin nhắn nào thì không cần tạo mới
      // if (currentConversation){
        
      // }

      setIsLoading(true);
      const newConversation = await conversationService.createConversation(
        `Cuộc trò chuyện mới ${conversations.length + 1}`,
        username
      );
      
      // Đặt conversation mới làm active
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      
      // Đóng sidebar trên mobile
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gửi tin nhắn
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    try {
      let newMessage;
      
      // Các phần tử trong mảng đang là mảng các object gồm thuộc tinh request và response, cho nên nếu gửi mỗi text thì sẽ lỗi
      setMessages(prev => [...prev, {request: text, requestTime: new Date().toISOString}]); // Chuyển thành request + requestTime
      setIsLoading(true);
      if (currentConversation) {
        newMessage = await messageService.sendMessage(
          currentConversation.id,
          text
        );
      } else {
        newMessage = await messageService.sendGuestMessage(
          text
        );
      }
      setIsLoading(false);
      setMessages(prev => [...prev, {response: newMessage, responseTime: new Date().toISOString}]); // Chuyển thành response + responseTime
      
      // Giả lập phản hồi từ AI sau 1 giây
      // setTimeout(async () => {
      //   const aiMessage = {
      //     id: Date.now(),
      //     text: `Đây là phản hồi tự động cho: "${text}"`,
      //     isUser: false,
      //     createdAt: new Date().toISOString()
      //   };
      //   setMessages(prev => [...prev, aiMessage]);
      // }, 1000);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Auto scroll xuống dưới cùng khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-page">

      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onNewChat={handleNewChat}
        onSelectConversation={setCurrentConversation}
        isOpen={isSidebarOpen} // Thêm prop này
        toggleSidebar={toggleSidebar} // Thêm prop này
        isLoggedIn={isLoggedIn} // Truyền prop isLoggedIn vào Sidebar
      />
      
      <div className="chat-main">
        {(currentConversation || !isLoggedIn) ? (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            // isLoadingMore={isLoadingMore}
            messagesContainerRef={messagesContainerRef}
            // onScroll={handleScroll}
            messagesEndRef={messagesEndRef}
            isLoggedIn={isLoggedIn} // Truyền prop isLoggedIn vào ChatInterface
            username={username} // Truyền prop username vào ChatInterface
          />
        ) : (
          <div className="empty-chat">
            <p>Chọn hoặc tạo cuộc trò chuyện mới</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatInterface = ({
  messages,
  onSendMessage,
  isLoading,
  // isLoadingMore,
  messagesContainerRef,
  // onScroll,
  messagesEndRef,
  isLoggedIn,
  username
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <>
      <Navbar 
        isLoggedIn={isLoggedIn}
        username={username}
      />
      <div className="messages" 
      ref={messagesContainerRef}
      //  onScroll={onScroll}
       >
        {/* {isLoadingMore && (
          <div className="loading-more">
            <div className="spinner"></div>
          </div>
        )} */}
        
        {
        messages.map((message, index) => (
          <Message 
            // key={message.id} 
            message={message} 
            index ={index}
          />
        
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-area">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          rows="1"
        />
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <span className="spinner"></span>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"></path>
            </svg>
          )}
        </button>
      </div>
    </>
  );
};

const Message = ({ message, index }) => (
  <>
    {
      index % 2 === 0 ? (
        <div className={`message user-message`}>
          <div className="message-content">
            {message.request.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
          <div className="message-time">
            {new Date(message.requestTime).toLocaleTimeString()}
          </div>
        </div>
      ) : (
        <div className={`message ai-message`}>
          <div className="message-content">
            {message.response.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
          <div className="message-time">
            {new Date(message.responseTime).toLocaleTimeString()}
          </div>
        </div>
      )
    }
    

    


    {/* <div className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}>
    <div className="message-content">
      {message.text.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </div>
    <div className="message-time">
      {new Date(message.createdAt).toLocaleTimeString()}
    </div>
    </div> */}
  </>
);

export default ChatPage;