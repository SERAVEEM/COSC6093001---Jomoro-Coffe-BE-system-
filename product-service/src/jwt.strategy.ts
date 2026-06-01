import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || 'JomoroKoffeeV2SecretKeyForAuthService',
        });
    }

    async validate(payload: any) {
        //ini cuman return payload doang, tapi nnti bisa di ganti kalau mau 
        return payload;
    }
}