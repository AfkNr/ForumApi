class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      threadId, owner, date, content,
    } = payload;

    this.threadId = threadId;
    this.date = date;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({
    threadId, owner, date, content,
  }) {
    if (!threadId || !owner || !date || !content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof owner !== 'string' || typeof date !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
