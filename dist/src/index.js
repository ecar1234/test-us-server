"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DataSource_1 = require("./config/DataSource");
const AuthRoute_1 = __importDefault(require("./interface/routes/AuthRoute"));
const UserRoute_1 = __importDefault(require("./interface/routes/UserRoute"));
const PostRoute_1 = __importDefault(require("./interface/routes/PostRoute"));
const ApplicationRoute_1 = __importDefault(require("./interface/routes/ApplicationRoute"));
const ReviewRoute_1 = __importDefault(require("./interface/routes/ReviewRoute"));
const MessageRoute_1 = __importDefault(require("./interface/routes/MessageRoute"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
DataSource_1.AppDataSource.initialize()
    .then(() => {
    console.log("DB 연결 성공!!");
    app.listen(port, "0.0.0.0", () => {
        console.log(`서버 실행 중: http://localhost:${port}`);
        // API 라우트 설정
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
