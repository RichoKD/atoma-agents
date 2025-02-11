import ConversationRepository from '../repositories/conversation.repository';
import { Types } from 'mongoose';

class ConversationService {
  private conversationRepository: ConversationRepository;

  constructor() {
    this.conversationRepository = new ConversationRepository();
  }

  async startConversation(walletAddress: string) {
    return await this.conversationRepository.create({ walletAddress });
  }

  async endConversation(sessionId: Types.ObjectId) {
    return await this.conversationRepository.endConversation(sessionId);
  }

  public async getUserConversations(walletAddress: string) {
    const encryptedConversations =
      await this.conversationRepository.getByWalletAddress(walletAddress);
    return encryptedConversations.map((convo) => ({
      ...convo.toObject(),
      messages: convo.messages.map((msg) =>
        msg && typeof msg=== 'object' && 'message' in msg
          ? { ...msg.toObject(), message: msg.getDecryptedMessage() }
          : msg
      )
    }));
  }

  public async getConversation(sessionId: Types.ObjectId) {
    const conversation = await this.conversationRepository.getBySessionId(sessionId);
    if (!conversation) return null;
    return {
      ...conversation.toObject(),
      messages: conversation.messages.map((msg) =>
        msg && typeof msg === 'object' && 'message' in msg
          ? { ...msg.toObject(), message: msg.getDecryptedMessage(), hi: 'hello' }
          : msg
      )
    };
  }
}

export default ConversationService;
