export class Messages{
    constructor(
        public id: number,
        public content: string,
        public senderId: number,
        public receiverId: number,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {}

    // 메시지 정보를 반환하는 메서드
    getMessageInfo() {
        return {
            id: this.id,
            content: this.content,
            senderId: this.senderId,
            receiverId: this.receiverId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
    // 메시지 내용을 수정하는 메서드
    updateContent(newContent: string) {
        this.content = newContent;
        this.updatedAt = new Date();
    }
    // 메시지 전송 메서드
    sendMessage() {
        // 메시지 전송 로직 구현
        console.log(`Message sent from ${this.senderId} to ${this.receiverId}: ${this.content}`);
    }
    // 메시지 수신 메서드
    receiveMessage() {
        // 메시지 수신 로직 구현
        console.log(`Message received by ${this.receiverId}: ${this.content}`);
    }
    // 메시지 삭제 메서드
    deleteMessage() {
        // 메시지 삭제 로직 구현
        console.log(`Message with ID ${this.id} deleted`);
    }
    // 메시지 검색 메서드
    static searchMessages(messages: Messages[], keyword: string): Messages[] {
        return messages.filter(message => 
            message.content.includes(keyword) || 
            message.senderId.toString().includes(keyword) || 
            message.receiverId.toString().includes(keyword)
        );
    }
    // 메시지 목록 정렬 메서드
    static sortMessages(messages: Messages[], order: 'asc' | 'desc' = 'asc'): Messages[] {
        return messages.sort((a, b) => {
            return order === 'asc' ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime();
        });
    }
    // 메시지 목록 필터링 메서드
    static filterMessagesBySender(messages: Messages[], senderId: number): Messages[] {
        return messages.filter(message => message.senderId === senderId);
    }
    // 메시지 목록 필터링 메서드
    static filterMessagesByReceiver(messages: Messages[], receiverId: number): Messages[] {
        return messages.filter(message => message.receiverId === receiverId);
    }
    // 메시지 목록 필터링 메서드
    static filterMessagesByDate(messages: Messages[], startDate: Date, endDate: Date): Messages[] {
        return messages.filter(message => 
            message.createdAt >= startDate && 
            message.createdAt <= endDate
        );
    }
}