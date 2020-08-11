import { User } from '../user/user';

export class UserIdFilter {
    accepts(item: User, search: string) {
        return item.id.search(search) == -1 ? false : true;
    }
}
