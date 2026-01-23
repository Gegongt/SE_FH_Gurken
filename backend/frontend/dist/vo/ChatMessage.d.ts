export declare class ChatMessage {
    private id;
    private userId;
    private subcategoryId;
    private name;
    private message;
    private createdAt;
    constructor(id: number, userId: string, subcategoryId: number, name: string, message: string, createdAt: any);
    getId(): number;
    setId(id: number): void;
    getUserId(): string;
    setUserId(userId: string): void;
    getSubcategoryId(): number;
    setSubcategoryId(subcategoryId: number): void;
    getName(): string;
    setName(name: string): void;
    getMessage(): string;
    setMessage(message: string): void;
    getCreatedAt(): any;
    setCreatedAt(createdAt: any): void;
}
//# sourceMappingURL=ChatMessage.d.ts.map