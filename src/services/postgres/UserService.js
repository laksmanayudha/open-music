const BaseService = require('../BaseService');

class UserService extends BaseService {
  constructor() {
    super('users');
  }
}

module.exports = UserService;
