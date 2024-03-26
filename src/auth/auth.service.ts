import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid) {
        const { password, ...result } = user.toJSON();
        return result;
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };
    const refresh_token = this.createRefreshToken(payload);

    await this.usersService.updateRefreshToken(_id, refresh_token);

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  async register(register: RegisterUserDto) {
    const newUser = await this.usersService.register(register);

    return {
      _id: newUser?._id,
      createdAd: newUser?.createdAt,
    };
  }

  createRefreshToken(payload) {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')) / 1000,
    });
    return refresh_token;
  }

  async refreshToken(refreshToken: string, response: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.usersService.findUserByToken(refreshToken);

      if (!user) {
        throw new BadGatewayException(
          'Refresh token không hợp lệ. Vui lòng đăng nhập lại!',
        );
      }

      const { _id, name, email, role } = user;
      const payload = {
        sub: 'token login',
        iss: 'from server',
        _id,
        name,
        email,
        role,
      };
      const refresh_token = this.createRefreshToken(payload);

      await this.usersService.updateRefreshToken(_id.toString(), refresh_token);

      response.clearCookie('refresh_token');
      response.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')),
      });

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          _id,
          name,
          email,
          role,
        },
      };
    } catch (error) {
      throw new BadGatewayException(
        'Refresh token không hợp lệ. Vui lòng đăng nhập lại!',
      );
    }
  }

  async logout(response: Response, user: IUser) {
    await this.usersService.updateRefreshToken(user._id, null);
    response.clearCookie('refresh_token');
    return 'Logout success!';
  }
}
