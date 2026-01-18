export class UserViewHandler {
    constructor(view, userService, favouritesService, fileService) {
        this.view = view;
        this.userService = userService;
        this.favouritesService = favouritesService;
        this.fileService = fileService;
        this.currentUser = null;
        this.favouriteFileIds = [];
        this.favourites = [];
    }
    init() {
        this.userService.getCurrentUser((u) => {
            if (!u) {
                window.location.href = "../login/login.html";
                return;
            }
            this.currentUser = u;
            this.view.renderUser(u);
            this.loadFavourites();
            this.userService.getProfilePicture((url) => this.view.setProfileImage(url), (_e) => this.view.setProfileImage(null));
            this.view.bindReportedFileActions((action, fileId, uploaderId, fileName, uploaderName, uploaderPic) => {
                this.onReportedAction(action, fileId, uploaderId, fileName, uploaderName, uploaderPic);
            });
            this.view.bindBlockedUserActions((action, userId, userName, userPic) => {
                this.onBlockedAction(action, userId, userName, userPic);
            });
            this.view.bindFavouriteAction((fileId, action) => {
                if (action === "download")
                    this.onDownload(fileId);
                if (action === "unfavourite")
                    this.onUnfavourite(fileId);
            });
            this.view.bindChangeProfilePicClick();
            this.view.bindProfilePicSelected((file) => this.onProfilePicSelected(file));
            this.view.bindDeleteAccountClick(() => this.onDeleteAccountClicked());
            const isAdmin = u.getIsAdmin?.() ?? false;
            this.view.showAdminPanel(isAdmin);
            if (u.getIsAdmin()) {
                this.loadAdminData();
            }
        }, (status) => this.view.showError(`getCurrentUser failed: ${String(status)}`));
    }
    onProfilePicSelected(file) {
        this.view.showProfilePicturePreview(file);
        this.userService.updateProfilePicture(file, () => {
            this.userService.getProfilePicture((url) => this.view.setProfileImage(url), (_e) => this.view.setProfileImage(null));
        }, (err) => this.view.showError(String(err)));
    }
    onUnfavourite(fileId) {
        const uid = this.currentUser ? String(this.currentUser.getId()) : null;
        if (!uid) {
            this.view.showError("Not logged in.");
            return;
        }
        this.favouritesService.removeFavourite(uid, fileId, () => {
            this.favourites = this.favourites.filter(x => x.fileId !== fileId);
            this.view.renderFavourites(this.favourites);
        }, (e) => this.view.showError(`Unfavourite failed: ${String(e)}`));
    }
    onDownload(fileId) {
        this.fileService.downloadFile(fileId, (_filename) => { }, (e) => this.view.showError(`Download failed: ${String(e)}`));
    }
    loadAdminData() {
        this.userService.getBlockedUsers(true, (users) => this.view.renderBlockedUsers(users), (err) => this.view.showError(`Failed to load blocked users`));
        this.fileService.getReportedFiles((files) => this.view.renderReportedFiles(files), (err) => this.view.showError(`Failed to load reported files: ${String(err)}`));
    }
    loadFavourites() {
        const uid = this.currentUser ? String(this.currentUser.getId()) : null;
        if (!uid)
            return;
        this.favouritesService.getFavourites(uid, (rows) => {
            const favIds = rows.map(r => Number(r.fileid));
            this.fileService.getAllFiles((allFiles) => {
                const nameById = new Map();
                for (const f of allFiles)
                    nameById.set(f.getId(), f.getName());
                this.favourites = favIds.map(id => ({
                    fileId: id,
                    name: nameById.get(id) ?? `File #${id}`
                }));
                this.view.renderFavourites(this.favourites);
            }, (_e) => {
                this.favourites = favIds.map(id => ({ fileId: id, name: `File #${id}` }));
                this.view.renderFavourites(this.favourites);
            });
        }, (e) => this.view.showError(`Failed to load favourites: ${String(e)}`));
    }
    onReportedAction(action, fileId, uploaderId, fileName, uploaderName, uploaderPic) {
        if (action === "unreport") {
            this.fileService.reportFile(fileId, fileName, false, () => this.loadAdminData(), (s) => this.view.showError(`Unreport failed: ${String(s)}`));
            return;
        }
        if (action === "delete") {
            const ok = confirm("Delete this file?");
            if (!ok)
                return;
            this.fileService.deleteFile(fileId, () => this.loadAdminData(), (s) => this.view.showError(`Delete failed: ${String(s)}`));
            return;
        }
        if (action === "block") {
            const ok = confirm(`Block this user (${uploaderId})?`);
            if (!ok)
                return;
            this.userService.setBlocked(uploaderId, true, uploaderName, uploaderPic || null, () => this.loadAdminData(), (e) => this.view.showError(`Block failed: ${String(e)}`));
        }
    }
    onBlockedAction(action, userId, userName, userPic) {
        this.userService.setBlocked(userId, false, userName, userPic, () => this.loadAdminData(), (e) => this.view.showError(`Unblock failed: ${String(e)}`));
    }
    onDeleteAccountClicked() {
        const ok = confirm("Really delete your account? This cannot be undone.");
        if (!ok)
            return;
        this.userService.deleteOwnUser(() => {
            window.location.href = "../login/login.html";
        }, (err) => this.view.showError(`Delete failed: ${String(err)}`));
    }
}
//# sourceMappingURL=UserViewHandler.js.map