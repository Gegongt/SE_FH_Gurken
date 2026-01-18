export class User {
    constructor(id, isAdmin, email, name, isBlocked, profilePictureName, favourites = []) {
        this.id = id;
        this.isAdmin = isAdmin;
        this.email = email;
        this.name = name;
        this.isBlocked = isBlocked;
        this.profilePictureName = profilePictureName;
        this.favourites = favourites;
    }
    getId() {
        return this.id;
    }
    getIsAdmin() {
        return this.isAdmin;
    }
    getEmail() {
        return this.email;
    }
    setEmail(email) {
        this.email = email;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getIsBlocked() {
        return this.isBlocked;
    }
    setIsBlocked(isBlocked) {
        this.isBlocked = isBlocked;
    }
    getFavourites() {
        return this.favourites;
    }
    isFavourite(fileId) {
        return this.favourites.some(f => f.getId() === fileId);
    }
    addFavourite(file) {
        if (!this.isFavourite(file.getId())) {
            this.favourites.push(file);
        }
    }
    removeFavourite(fileId) {
        this.favourites = this.favourites.filter(f => f.getId() !== fileId);
    }
    setFavourites(files) {
        this.favourites = files ?? [];
    }
    getProfilePictureName() {
        return this.profilePictureName;
    }
    setProfilePictureName(profilePictureName) {
        this.profilePictureName = profilePictureName;
    }
}
//# sourceMappingURL=User.js.map