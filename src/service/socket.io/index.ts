import { Server } from "socket.io";
import { Server as httpServer } from "http";
import { chatHandler } from "./handlers/chatHandler";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis, { ClusterOptions } from "ioredis";
import { MessageUseCase } from "../../app/MessageUseCase";
import { MessageRepositoryImpl } from "../../infrastructure/repositories/Message/MessageRepositoryImpl";
import { RoomRepositoryImpl } from "../../infrastructure/repositories/Message/RoomRepositoryImpl";
import { RoomMemberRepositoryImpl } from "../../infrastructure/repositories/Message/RoomMemberRepositoryImpl";
import { TypeOrmUnitOfWork } from "../../infrastructure/repositories/Message/UnitOfWorkImpl";
import { AppDataSource } from "../../config/DataSource";
import { verifyToken } from "../../utils/jwt";

export const initSocket = async (server: httpServer) => {
    
    const pubClient = new Redis({
        port: 6379,
        host: '127.0.0.1',
        family: 4,
    });
    const subClient = pubClient.duplicate();

    pubClient.on("error", (err) => {
        console.error("Socket.IO Redis Pub Error:", err);
    });

    subClient.on("error", (err) => {
        console.error("Socket.IO Redis Sub Error:", err);
    });
    
    const messageUseCase = new MessageUseCase(
        new MessageRepositoryImpl(), 
        new RoomRepositoryImpl(),
        new RoomMemberRepositoryImpl(),
        new TypeOrmUnitOfWork(AppDataSource)
    );
    const io = new Server(server, {
        adapter: createAdapter(pubClient, subClient),
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
        connectionStateRecovery: {
            maxDisconnectionDuration: 10000,
        },
    });

    // Socket.IO 미들웨어: 연결 전 인증 처리
    io.use((socket, next) => {
        // 클라이언트에서 보낸 토큰 확인 (예: socket.handshake.auth.token)
        const token = socket.handshake.auth.token;

        if (!token) {
            // 토큰이 없으면 연결 거부
            return next(new Error("Authentication error: Token not provided"));
        }

        // TODO: 실제 토큰 검증 로직 추가 (예: jwt.verify)
        const decoded = verifyToken(token);
        socket.data.userId = decoded.userId;
        
        // 임시: 토큰이 있으면 userId를 설정한다고 가정 (실제 구현 시 위 검증 로직으로 대체 필요)
        // socket.data.userId = "temp_user_id"; 
        next();
    });

    io.on("connection", (socket) => {
        console.log(`[Socket] Connected: ${socket.id}`);
        chatHandler(socket, io, messageUseCase);
        // notificationHandler(socket, io);

        socket.on("disconnect", () => {
            console.log(`[Socket] Disconnected: ${socket.id}`);
        });
    });

    return io;

};
