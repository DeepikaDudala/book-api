import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const findUser = await this.UserModel.findOne({ email: signUpDto.email });
    if (findUser) throw new UnauthorizedException(`User already Exists`);

    const { password, ...details } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.UserModel.create({
      ...details,
      password: hashedPassword,
    });
    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.UserModel.findOne({ email });

    if (!user) throw new UnauthorizedException(`User not Exists`);

    const isPasswordMatched = bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      throw new UnauthorizedException(`Password doesn't match`);

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }
}
