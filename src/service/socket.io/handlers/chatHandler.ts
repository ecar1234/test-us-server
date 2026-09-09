
import { Server, Socket } from "socket.io";
import { MessageUseCase } from "../../../app/MessageUseCase.js";
import { MessageControlService } from "../messageControlService.js";
import { FirebaseRepositoryImpl } from "../../../infrastructure/repositories/FirebaseRepositoryImpl.js";
import { Redis } from "ioredis";

export const chatHandler = (socket: Socket, io: Server, messageUseCase: MessageUseCase, cacheClient: Redis) => {

  // 1. 방 입장 (채팅창을 열었을 때 호출)
  socket.on("join_room", async (roomId: number) => {
    socket.join(`room_${roomId}`);
    console.log(`[Socket] joined room_${roomId}`);
    // [비즈니스 로직] 유저가 방에 들어왔으므로 '안 읽은 메시지'를 0으로 초기화
    await messageUseCase.markAsRead(roomId, socket.data.userId);
  });

  socket.on("join_user", (userId: string) => {
    socket.join(`user_${userId}`);
    console.log(`[Socket] joined user_${userId}`);
  });

  // 2. 메시지 전송
  socket.on("chat_message", async (payload: { roomId: number | null; content: string, targetId: string, postId: string }) => {
    const { roomId, content, targetId, postId } = payload;
    const userId = socket.data.userId; // 소켓 인증 단계에서 저장된 유저 ID
    console.log('[Socket] chat_message received');
    // [비즈니스 로직 실행]
    // 1) Message 저장
    // 2) ChatRoom의 lastMessageContent, lastMessageAt 업데이트
    // 3) 나를 제외한 모든 멤버의 unreadCount + 1 증가

    const newMessage = await messageUseCase.sendMessage(roomId, postId, userId, targetId, content);

    console.log(`[Socket] message saved: ${newMessage}`);
    const fmcRepo = new FirebaseRepositoryImpl();
    const delivery = new MessageControlService(fmcRepo, cacheClient, io);

    if (!roomId) {
      await delivery.firstMessage(newMessage, targetId);
    } else {
      await delivery.messageDelivery(newMessage, targetId);
    }
  });

  // 3. 방 나가기
  socket.on("leave room", async (roomId: number) => {
    socket.leave(`room_${roomId}`);
    console.log(`[Socket] left room_${roomId}`);
    await cacheClient.del(`online${socket.data.userId}`);
    console.log(`[Socket] cache_del_${socket.data.userId}`);
  });
};

