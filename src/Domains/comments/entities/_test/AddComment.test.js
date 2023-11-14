const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-1234567891',
      date: '2023-10-28:13:10',
      content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 12345,
      owner: 123.45,
      date: 2323,
      content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-1234567890',
      owner: 'user-1234567891',
      date: '2023-10-28:13:10',
      content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
    };

    // Action
    const {
      threadId, owner, date, content,
    } = new AddComment(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(date).toEqual(payload.date);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
