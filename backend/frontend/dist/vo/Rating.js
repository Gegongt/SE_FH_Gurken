export class Rating {
    constructor(id, ratingIsBad, ratingIsMedium, ratingIsGood, user, file) {
        this.id = id;
        this.ratingIsBad = ratingIsBad;
        this.ratingIsMedium = ratingIsMedium;
        this.ratingIsGood = ratingIsGood;
        this.user = user;
        this.file = file;
    }
    getId() {
        return this.id;
    }
    getUser() {
        return this.user;
    }
    getFile() {
        return this.file;
    }
    getRatingIsBad() {
        return this.ratingIsBad;
    }
    getRatingIsMedium() {
        return this.ratingIsMedium;
    }
    getRatingIsGood() {
        return this.ratingIsGood;
    }
    setRatingIsBad(ratingIsBad) {
        this.ratingIsBad = ratingIsBad;
        return true;
    }
    setRatingIsMedium(ratingIsMedium) {
        this.ratingIsMedium = ratingIsMedium;
        return true;
    }
    setRatingIsGood(ratingIsGood) {
        this.ratingIsGood = ratingIsGood;
        return true;
    }
}
//# sourceMappingURL=Rating.js.map