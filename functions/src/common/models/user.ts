/**
 * User model
 * @class User
 * @property {string} email - User's email
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} dateOfBirth - User's date of birth
 * @property {string} userId - User's id
 */
export class User {
    constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public userId: string,
        public dateOfBirth?: string
    ) {}
}
