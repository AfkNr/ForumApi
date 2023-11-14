const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
      body: 'Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 12345,
      body: true,
      date: 2323,
      owner: 123.45,
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
      body: 'Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert',
      date: '2023-10-28:13:00',
      owner: 'user-1234567890',
    };

    // Action
    const {
      title, body, owner, date,
    } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(owner).toEqual(payload.owner);
  });
});
