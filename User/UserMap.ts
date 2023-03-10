import {User} from "./UserInterface";

export default class UserMap {
    private userMap: Map<string, User>;

    constructor() {
        this.userMap = new Map();
    }

    add(k: string, v: User) {
        if (!this.userMap.has(k)) {
            this.userMap.set(k, v)
        }
    }

    remove(k: string) {
        if (this.userMap.has(k)) {
            this.userMap.delete(k)
        }
    }

    get(k: string) {
        return this.userMap.get(k);
    }

}
