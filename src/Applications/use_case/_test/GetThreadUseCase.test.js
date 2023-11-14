const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-1234567890';

    const valueThread = {
      id: 'thread-1234567890',
      title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
      body: 'Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert',
      date: 'user-1234567890',
      username: 'dicoding',
    };

    const comments = [];

    const expectedThread = new DetailThread({
      id: 'thread-1234567890',
      title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
      body: 'Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert',
      date: 'user-1234567890',
      username: 'dicoding',
      comments: [],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(valueThread));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getThreadResult = await getThreadUseCase.execute(threadId);

    // Assert
    expect(getThreadResult).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById)
      .toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId)
      .toBeCalledWith(threadId);
  });

  it('should orchestrating the get thread with comment correctly', async () => {
    // Arrange
    const threadId = 'thread-1234567890';

    const valueThread = {
      id: 'thread-1234567890',
      title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
      body: 'Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert',
      date: 'user-1234567890',
      username: 'dicoding',
    };

    const valueComment = new DetailComment({
      id: 'comment-1234567890',
      username: 'dicoding1',
      date: '2023-10-28:13:10',
      content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
      isDelete: false,
    });

    const comments = [];
    comments.push(valueComment);

    const expectedThread = new DetailThread({
      id: 'thread-1234567890',
      title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
      body: 'Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert',
      date: 'user-1234567890',
      username: 'dicoding',
      comments: [
        new DetailComment({
          id: 'comment-1234567890',
          username: 'dicoding1',
          date: '2023-10-28:13:10',
          content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
          isDelete: false,
        }),
      ],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(valueThread));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getThreadResult = await getThreadUseCase.execute(threadId);

    // Assert
    expect(getThreadResult).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById)
      .toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId)
      .toBeCalledWith(threadId);
  });

  it('should orchestrating the get thread with comment deleted correctly', async () => {
    // Arrange
    const threadId = 'thread-1234567890';

    const valueThread = {
      id: 'thread-1234567890',
      title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
      body: 'Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert',
      date: 'user-1234567890',
      username: 'dicoding',
    };

    const valueComment1 = new DetailComment({
      id: 'comment-1234567890',
      username: 'dicoding1',
      date: '2023-10-28:13:10',
      content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases klasnya?',
      isDelete: true,
    });

    const valueComment2 = new DetailComment({
      id: 'comment-1234567891',
      username: 'dicoding1',
      date: '2023-10-28:13:11',
      content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
      isDelete: false,
    });

    const comments = [];
    comments.push(valueComment1);
    comments.push(valueComment2);

    const expectedThread = new DetailThread({
      id: 'thread-1234567890',
      title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
      body: 'Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert',
      date: 'user-1234567890',
      username: 'dicoding',
      comments: [
        new DetailComment({
          id: 'comment-1234567890',
          username: 'dicoding1',
          date: '2023-10-28:13:10',
          content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases klasnya?',
          isDelete: true,
        }),
        new DetailComment({
          id: 'comment-1234567891',
          username: 'dicoding1',
          date: '2023-10-28:13:11',
          content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
          isDelete: false,
        }),
      ],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(valueThread));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getThreadResult = await getThreadUseCase.execute(threadId);

    // Assert
    expect(getThreadResult).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById)
      .toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId)
      .toBeCalledWith(threadId);
  });
});
