import http from '../http';

const conversationService = {
  async getConversations(username) {
    try {
      console.log('Fetching conversations for user:', username);
      const response = await http.post('/conversations/getAll', {
        username
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  },

  async createConversation(title, username) {
    try {
      const response = await http.post('/conversations/create', { 
        title,
        username
      });
      console.log('Conversation created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  },

  async updateConversation(id, title) {
    try {
      const response = await http.put(`/conversations/update/${id}`, { title });
      return response;
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  },

};

export default conversationService;