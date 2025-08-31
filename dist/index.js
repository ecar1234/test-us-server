"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const dotenvResult = dotenv.config(); // dotenv.config()의 결과를 변수에 저장
console.log('--- Diagnostics from index.ts ---');
console.log('Dotenv load result:', dotenvResult);
console.log('process.env.DATA_BASE_USER_NAME:', process.env.DATA_BASE_USER_NAME);
console.log('---------------------------------');
const express_1 = __importDefault(require("express"));
const DataSource_1 = require("./config/DataSource");
const AuthRoute_1 = __importDefault(require("./interface/routes/AuthRoute"));
const UserRoute_1 = __importDefault(require("./interface/routes/UserRoute"));
const PostRoute_1 = __importDefault(require("./interface/routes/PostRoute"));
const ApplicationRoute_1 = __importDefault(require("./interface/routes/ApplicationRoute"));
const ReviewRoute_1 = __importDefault(require("./interface/routes/ReviewRoute"));
const MessageRoute_1 = __importDefault(require("./interface/routes/MessageRoute"));
const app = (0, express_1.default)();
const port = parseInt(process.env.SERVER_PORT);
app.use(express_1.default.json());
DataSource_1.AppDataSource.initialize()
    .then(() => {
    console.log("DB 연결 성공!!");
    app.listen(port, '0.0.0.0', () => {
        console.log(`서버 실행 중: 0.0.0.0:${port}`);
        // API 라우트 설정
        // app.use('/', (res: Response)=>{res.send("Hello World!")});
        app.use('/api/v1/auth', AuthRoute_1.default);
        app.use('/api/v1/user', UserRoute_1.default);
        app.use('/api/v1/post', PostRoute_1.default);
        app.use('/api/v1/application', ApplicationRoute_1.default);
        app.use('/api/v1/review', ReviewRoute_1.default);
        app.use('/api/v1/message', MessageRoute_1.default);
        // 중앙 에러 처리 미들웨어
        app.use((err, req, res, next) => {
            console.error(err); // 서버 로그에 에러 기록
            if (err.message.includes('already exists')) {
                res.status(409).json({ status: 409, message: 'data is already exists' });
                return;
            }
            res.status(500).json({
                status: 500,
                message: 'An unexpected error occurred'
            });
            return;
        });
    });
})
    .catch((error) => console.error("DB 연결 실패:", error));
exports.default = app;
