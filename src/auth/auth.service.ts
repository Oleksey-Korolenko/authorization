import crypto from 'crypto';
import { IResponse } from '../common/interface';
import { IUserInfo, IUserWithoutId } from '../user';
import UserService from '../user/user.service';
import { IAuthTokens, IMeResponse } from './interface';

export default class AuthService {
  private _tokenKey;

  private _cryptoPrivateKey;

  private _cryptoPublicKey;

  private _cryptoPhrase;

  private _userService;

  constructor() {
    this._tokenKey = process.env.TOKEN_KEY ?? '';
    this._cryptoPhrase = process.env.CRYPTO_PHRASE ?? '';
    this._cryptoPrivateKey = Buffer.from(
      process.env.CRYPTO_PRIVATE_KEY ?? '',
      'base64'
    ).toString('ascii');
    this._cryptoPublicKey = Buffer.from(
      process.env.CRYPTO_PUBLIC_KEY ?? '',
      'base64'
    ).toString('ascii');
    this._userService = new UserService();
  }

  public signUp = async (
    reqData: IUserWithoutId
  ): Promise<IResponse<undefined>> => {
    const { email, password } = reqData;

    const encryptPassword = this.passwordEncryption(password);

    const user = await this._userService.insertOne({
      email,
      password: encryptPassword,
    });

    if (user === null) {
      throw new Error(`Can't create user [${email}]`);
    }

    return {
      message: `User [${email}] successfully added`,
    };
  };

  public me = async (
    email: string,
    queryPath: string
  ): Promise<IResponse<IMeResponse>> => {
    const user = await this._userService.findOne(email);

    if (user === null) {
      throw new Error(`Can't find user [${email}]`);
    }

    return {
      message: 'Everithing is correct!',
      data: {
        request_num: +queryPath[queryPath.length - 1],
        data: {
          username: user.email,
        },
      },
    };
  };

  public logIn = async (
    reqData: IUserWithoutId
  ): Promise<IResponse<IAuthTokens>> => {
    const { email, password } = reqData;

    const user = await this._userService.findOne(email);

    if (user === null) {
      throw new Error(`Can't find user [${email}]`);
    }

    const decryptPassword = this.passwordDecryption(user.password);

    if (decryptPassword !== password) {
      throw new Error('Password or email have incorrect data');
    }

    const exp = this.randomInteger(30, 60) * 1000 + new Date().getTime();

    const accessTokenHead = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'jwt' })
    ).toString('base64');
    const accessTokenBody = Buffer.from(
      JSON.stringify({ email: user.email, exp })
    ).toString('base64');
    const accessTokenSignature = crypto
      .createHmac('SHA256', this._tokenKey)
      .update(`${accessTokenHead}.${accessTokenBody}`)
      .digest('base64');

    const refreshTokenHead = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'jwt' })
    ).toString('base64');
    const refreshTokenBody = Buffer.from(
      JSON.stringify({ email: user.email })
    ).toString('base64');
    const refreshTokenSignature = crypto
      .createHmac('SHA256', this._tokenKey)
      .update(`${accessTokenHead}.${accessTokenBody}`)
      .digest('base64');

    return {
      message: 'Everithing is correct!',
      data: {
        access_token: `${accessTokenHead}.${accessTokenBody}.${accessTokenSignature}`,
        refresh_token: `${refreshTokenHead}.${refreshTokenBody}.${refreshTokenSignature}`,
      },
    };
  };

  private passwordEncryption(password: string): string {
    try {
      const encryptToken = crypto.privateEncrypt(
        {
          key: this._cryptoPrivateKey,
          passphrase: this._cryptoPhrase,
        },
        Buffer.from(password)
      );

      return encryptToken.toString('base64');
    } catch (e) {
      console.error(e);
      throw new Error("Can't encrypt password");
    }
  }

  private passwordDecryption(password: string): string {
    try {
      const decryptToken = crypto.publicDecrypt(
        this._cryptoPublicKey,
        Buffer.from(password, 'base64')
      );

      return decryptToken.toString('utf-8');
    } catch (e) {
      console.error(e);
      throw new Error("Can't decrypt password");
    }
  }

  private randomInteger = (min: number, max: number) => {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
  };
}
