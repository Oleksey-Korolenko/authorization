import crypto from 'crypto';

export default class AuthService {
  private _tokenKey;

  constructor() {
    this._tokenKey = process.env.TOKEN_KEY ?? '';
  }

  public login = (login: string, password: string): string => {
    const head = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'jwt' })
    ).toString('base64');
    const body = Buffer.from(JSON.stringify({ login, password })).toString(
      'base64'
    );
    const signature = crypto
      .createHmac('SHA256', this._tokenKey)
      .update(`${head}.${body}`)
      .digest('base64');

    return `Bearer ${head}.${body}.${signature}`;
  };
}
