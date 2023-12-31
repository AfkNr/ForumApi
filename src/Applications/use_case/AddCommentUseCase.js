const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(addCommentPayload) {
    const addComment = new AddComment(addCommentPayload);
    await this._threadRepository.verifyThread(addComment.threadId);
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
