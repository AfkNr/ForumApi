const AddThread = require('../../Domains/threads/entities/AddThread');

class AddedThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(addThreadPayload) {
    const addThread = new AddThread(addThreadPayload);
    return this._threadRepository.addThread(addThread);
  }
}

module.exports = AddedThreadUseCase;
