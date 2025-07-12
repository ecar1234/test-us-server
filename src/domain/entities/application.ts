export class Application {
    constructor(
        public name: string,
        public version: string,
        public description: string,
        public author: string,
        public license: string
    ) { }

    // 애플리케이션 정보를 반환하는 메서드
    getAppInfo() {
        return {
            name: this.name,
            version: this.version,
            description: this.description,
            author: this.author,
            license: this.license
        };
    }
}