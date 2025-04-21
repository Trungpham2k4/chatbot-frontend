import http from '../http';

const messageService = {
  /**
   * Lấy tin nhắn theo conversationId với lazy loading
   * @param {number} conversationId 
   * @param {number} page - Trang hiện tại
   * @param {number} limit - Số lượng tin nhắn mỗi trang
   * @returns {Promise<Object>} { messages: Array, hasMore: boolean }
   */
  async getMessages(conversationId) {
    try {
      const response = await http.get(`api/getMessages/${conversationId}`, {
        // params: { 
        //   conversationId,
        //   _page: page,
        //   _limit: limit,
        //   _sort: 'createdAt',
        //   _order: 'desc'
        // }
      });
      // console.log('Messages:', response);
      const responseArray = Array.isArray(response.data) ? (
        response.data.flatMap(item => ([
          {
            request: item.request,
            requestTime: item.requestTime,
          },
          {
            response: item.response,
            responseTime: item.responseTime,
          }
        ]))
      )
         : [];
      console.log('Messages:', responseArray);
      // Đoạn này cần sửa lại thành array of object của request và response riêng
      return responseArray;
      
      // return {
      //   messages: response,
      //   hasMore: response.length === limit
      // };
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  },

  /**
   * Gửi tin nhắn mới
   * @param {number} conversationId 
   * @param {string} message 
   * @returns {Promise<Object>} Tin nhắn đã gửi
   */
  async sendMessage(conversationId, message) {
    try {
      const response = await http.post(`api/request/${conversationId}`, {
        message,
      });
      // const response = await http.post(`api/test`);
      console.log('Response:', response.data);
      return response.data.reply;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },

  async sendGuestMessage(text) {
    try {
      const response = await http.post(`api/guest`, {
        text,
      });
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
};

export default messageService;