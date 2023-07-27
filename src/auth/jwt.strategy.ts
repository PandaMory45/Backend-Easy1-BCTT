import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor( 
    private configService: ConfigService,
    private authService: AuthService){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreEpiration: false,
      secretOrKey: configService.get('SECRET_KEY')  
    })
  }
  
  async validate(payload: {sub:number; email: string}){
    const user = await this.authService.findUserByIdAndEmail(payload.sub, payload.email)
    const {password, ...result} =user
    return result;
  }
}