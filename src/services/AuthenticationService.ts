import bcrypt from "bcryptjs";

export default class AuthenticationService {
    private static readonly SALT_ROUNDS = 10;

    async hashPassword(password: string) {
        return await bcrypt.hash(password, AuthenticationService.SALT_ROUNDS);
    }
}
