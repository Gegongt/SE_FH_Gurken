import { NamedEntity } from "./NamedEntity.js";
export class File extends NamedEntity {
    constructor(id, name, isReported, uploader, ratings = []) {
        super(id, name);
        this.isReported = isReported;
        this.uploader = uploader;
        this.ratings = ratings;
    }
    getUploader() {
        return this.uploader;
    }
    getIsReported() {
        return this.isReported;
    }
    setIsReported(isReported) {
        this.isReported = isReported;
    }
    getRatings() {
        return this.ratings;
    }
    getRatingSummary() {
        return this.ratingSummary;
    }
    setRatingSummary(summary) {
        this.ratingSummary = summary;
    }
}
//# sourceMappingURL=File.js.map