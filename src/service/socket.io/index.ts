import { Server } from "socket.io";
import { Redis } from "ioredis";
import { Server as httpServer } from "http";
import { chatHandler } from "./handlers/chatHandler.js";
import { createAdapter } from "@socket.io/redis-adapter";
import { MessageUseCase } from "../../app/MessageUseCase.js";
import { MessageRepositoryImpl } from "../../infrastructure/repositories/Message/MessageRepositoryImpl.js";
import { RoomRepositoryImpl } from "../../infrastructure/repositories/Message/RoomRepositoryImpl.js";
import { RoomMemberRepositoryImpl } from "../../infrastructure/repositories/Message/RoomMemberRepositoryImpl.js";
import { TypeOrmUnitOfWork } from "../../infrastructure/repositories/Message/UnitOfWorkImpl.js";
import { AppDataSource } from "../../config/DataSource.js";
import { verifyToken } from "../../utils/jwt.js";

export const initSocket = async (server: httpServer) => {
    const messageRepo = new MessageRepositoryImpl();
    const memberRepo = new RoomMemberRepositoryImpl();
    const roomRepo = new RoomRepositoryImpl(memberRepo, messageRepo);

    const messageUseCase = new MessageUseCase(
        messageRepo,
        roomRepo,
        memberRepo,
        new TypeOrmUnitOfWork(AppDataSource)
    );

    const pubClient = new Redis({
        port: 6379,
        host: '127.0.0.1',
        family: 4,
    });
    const subClient = pubClient.duplicate();

    const cacheClient = new Redis({
        port: 6379,
        host: '127.0.0.1',
        family: 4,
    });

    pubClient.on("error", (err) => {
        console.error("Socket.IO Redis Pub Error:", err);
    });

    subClient.on("error", (err) => {
        console.error("Socket.IO Redis Sub Error:", err);
    });


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

    io.on("connection", async (socket) => {
        console.log(`[Socket] Connected: ${socket.id}`);

        await cacheClient.set(`online${socket.data.userId}`, socket.id, "EX", 60);
        console.log(`[Socket] cache_set_${socket.data.userId}`);
        chatHandler(socket, io, messageUseCase, cacheClient);
        // notificationHandler(socket, io, fmcRepo);

        socket.on("disconnect", async () => {
            console.log(`[Socket] Disconnected: ${socket.id}`);
        });

    });

    return io;
};
