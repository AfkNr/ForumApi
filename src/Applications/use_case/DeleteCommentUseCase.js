class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(deleteCommentPayload) {
    const { threadId, commentId, owner } = deleteCommentPayload;
    await this._threadRepository.verifyThread(threadId);
    await this._commentRepository.verifyComment(commentId, owner);
    return this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
