const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-1234567890',
      title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
      body: 'Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert',
      date: '2023-10-28:13:00',
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123.45,
      title: 12345,
      body: true,
      date: 2323,
      username: 123.45,
      comments: [],
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-1234567890',
      title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
      body: 'Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert',
      date: '2023-10-28:13:00',
      username: 'dicoding',
      comments: [{
        id: 'comment-1234567891',
        username: 'dicoding1',
        date: '2023-10-28:13:10',
        content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
      }],
    };

    // Action
    const {
      id, title, body, date, username, comments,
    } = new DetailThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);

    expect(comments[0].id).toEqual(payload.comments[0].id);
    expect(comments[0].username).toEqual(payload.comments[0].username);
    expect(comments[0].date).toEqual(payload.comments[0].date);
    expect(comments[0].content).toEqual(payload.comments[0].content);
  });
});
