
import { Server, Socket } from "socket.io";
import { MessageUseCase } from "../../../app/MessageUseCase";

export const chatHandler = (socket: Socket, io: Server, messageUseCase: MessageUseCase) => {
    // 1. 방 입장 (채팅창을 열었을 때 호출)
  socket.on("join room", async (roomId: number) => {
    socket.join(`room_${roomId}`);
    
    // [비즈니스 로직] 유저가 방에 들어왔으므로 '안 읽은 메시지'를 0으로 초기화
    await messageUseCase.markAsRead(roomId, socket.data.userId); 
    
    console.log(`User ${socket.data.userId} joined room_${roomId}`);
  });

  // 2. 메시지 전송
  socket.on("chat message", async (payload: { roomId: number; content: string, targetId: string, postId: string}) => {
    const { roomId, content, targetId, postId } = payload;
    const userId = socket.data.userId; // 소켓 인증 단계에서 저장된 유저 ID

    // [비즈니스 로직 실행]
    // 1) Message 저장
    // 2) ChatRoom의 lastMessageContent, lastMessageAt 업데이트
    // 3) 나를 제외한 모든 멤버의 unreadCount + 1 증가
    
    const newMessage = await messageUseCase.sendMessage(roomId, postId, userId, targetId, content);

    // 해당 방에 속한 모든 사람에게 메시지 전송
    io.to(`room_${roomId}`).emit("chat message", newMessage);

    // (옵션) 방 목록에 있는 사람들에게 '새 메시지 알림' 전송
    // 전체 공지가 아니라, 해당 방 멤버들에게만 '목록 갱신' 신호를 보낼 수 있습니다.
    io.to(`room_${roomId}`).emit("update room list", {
        roomId,
        lastMessage: content,
        lastMessageAt: newMessage.createdAt
    });
  });

  // 3. 방 나가기
  socket.on("leave room", (roomId: number) => {
    socket.leave(`room_${roomId}`);
  });
};
export const notificationHandler = (socket: Socket, io: Server) => {};
        