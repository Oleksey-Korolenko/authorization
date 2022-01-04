import _ from 'lodash';
import { IAuth } from './interface';
import validator from 'validator';

const authFields: Array<keyof IAuth> = ['login', 'password'];

class AuthValidate {
  auth = (payload: IAuth): IAuth => {
    if (!payload.login) {
      throw new TypeError(`Payload atribute: [login] doesn't exist!`);
    }

    if (!_.isString(payload.login)) {
      throw new TypeError(
        `Payload atribute: [login] type isn't equal to string!`
      );
    }

    if (!validator.isEmail(payload.login)) {
      throw new TypeError(`Payload atribute: [login] isn't correct!`);
    }

    if (!payload.password) {
      throw new TypeError(`Payload atribute: [password] doesn't exist!`);
    }

    if (!_.isString(payload.password)) {
      throw new TypeError(
        `Payload atribute: [password] type isn't equal to string!`
      );
    }

    if (!validator.isStrongPassword(payload.password)) {
      throw new TypeError(`Payload atribute: [password] isn't strong!`);
    }

    return _.pick(payload, authFields);
  };
}

export default {
  authValidate: new AuthValidate(),
  AuthValidate,
  authFields,
};
