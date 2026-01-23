export class ChatMessage {
    constructor(id, userId, subcategoryId, name, message, createdAt) {
        this.id = id;
        this.userId = userId;
        this.subcategoryId = subcategoryId;
        this.name = name;
        this.message = message;
        this.createdAt = createdAt;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getUserId() {
        return this.userId;
    }
    setUserId(userId) {
        this.userId = userId;
    }
    getSubcategoryId() {
        return this.subcategoryId;
    }
    setSubcategoryId(subcategoryId) {
        this.subcategoryId = subcategoryId;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getMessage() {
        return this.message;
    }
    setMessage(message) {
        this.message = message;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }
}
//# sourceMappingURL=ChatMessage.js.map