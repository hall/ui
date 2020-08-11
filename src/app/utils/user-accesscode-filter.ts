import { ClrDatagridStringFilterInterface } from '@clr/angular';
import { User } from '../user/user';

export class UserAccessCodeFilter implements ClrDatagridStringFilterInterface<User>{
    accepts(item: User, search: string) {
        return item.access_codes.findIndex(el => el.includes(search)) == -1 ? false : true;
    }
}
