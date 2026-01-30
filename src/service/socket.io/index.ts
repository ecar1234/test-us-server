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
        path: "/socket.io",
        connectionStateRecovery: {
            maxDisconnectionDuration: 10000,
        },
    });

    // Socket.IO 미들웨어: 연결 전 인증 처리
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            console.log('[Socket] Authentication error: Token not provided');
            return next(new Error("Authentication error: Token not provided"));
        }

        const decoded = verifyToken(token);
        socket.data.userId = decoded.userId;
        console.log('[Socket] Token Verified: OK');
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
