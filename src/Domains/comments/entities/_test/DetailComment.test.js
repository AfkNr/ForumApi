const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-1234567890',
      username: 'dicoding',
      date: '2023-10-28:13:10',
      content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 12345,
      username: 123.45,
      date: 2323,
      content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
      isDelete: 'tidak',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment object is Deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-1234567890',
      username: 'dicoding',
      date: '2023-10-28:13:10',
      content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
      isDelete: true,
    };

    // Action
    const {
      id, content, date, username,
    } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**komentar telah dihapus**');
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });

  it('should create DetailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-1234567890',
      username: 'dicoding',
      date: '2023-10-28:13:10',
      content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
      isDelete: false,
    };

    // Action
    const {
      id, content, date, username,
    } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
