export class Exam {
    constructor(id, name, questions, creator) {
        this.id = id;
        this.name = name;
        this.questions = questions;
        this.creator = creator;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getQuestions() {
        return this.questions;
    }
    setQuestions(questions) {
        this.questions = questions;
    }
    getCreator() {
        return this.creator;
    }
    setCreator(creator) {
        this.creator = creator;
    }
}
//# sourceMappingURL=Exam.js.map