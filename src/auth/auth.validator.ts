import _ from 'lodash';
import validator from 'validator';
import { IUserWithoutId } from '../user';

const authFields: Array<keyof IUserWithoutId> = ['email', 'password'];

class AuthValidate {
  auth = (payload: IUserWithoutId): IUserWithoutId => {
    if (!payload.email) {
      throw new TypeError(`Payload atribute: [email] doesn't exist!`);
    }

    if (!_.isString(payload.email)) {
      throw new TypeError(
        `Payload atribute: [email] type isn't equal to string!`
      );
    }

    if (!validator.isEmail(payload.email)) {
      throw new TypeError(`Payload atribute: [email] isn't correct!`);
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
