const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1234567890' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1234567890' });

      const addComment = new AddComment({
        threadId: 'thread-1234567890',
        date: '2023-10-28:13:00',
        owner: 'user-1234567890',
        content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
      });

      const fakeIdGenerator = () => '12345'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentsById('comment-12345');

      expect(comment).toHaveLength(1);

      expect(comment[0].id).toStrictEqual('comment-12345');
      expect(comment[0].thread_id).toStrictEqual('thread-1234567890');
      expect(comment[0].owner).toStrictEqual('user-1234567890');
      expect(comment[0].date).toStrictEqual('2023-10-28:13:00');
      expect(comment[0].content).toStrictEqual('Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?');
      expect(comment[0].is_delete).toStrictEqual(false);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1234567890' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1234567890', owner: 'user-1234567890' });

      const addComment = new AddComment({
        threadId: 'thread-1234567890',
        date: '2023-10-28:13:00',
        owner: 'user-1234567890',
        content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
      });

      const fakeIdGenerator = () => '12345'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-12345',
        owner: 'user-1234567890',
        content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
      }));
    });
  });

  describe('verifyComment function', () => {
    it('should throw NotFoundError when not id available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment('comment-1234567890')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when owner is not Authorization', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1234567890' });
      await UsersTableTestHelper.addUser({ id: 'user-1234567891', username: 'dicoding1' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1234567890', owner: 'user-1234567890' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1234567890', owner: 'user-1234567891' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment('comment-1234567890', 'user-1234567890'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should throw InvariantError when comment is deleted', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1234567890' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1234567890', owner: 'user-1234567890' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1234567890', threadId: 'thread-1234567890', owner: 'user-1234567890', isDelete: true,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment('comment-1234567890', 'user-1234567890'))
        .rejects.toThrowError(InvariantError);
    });

    it('should not throw NotFoundError or InvariantError or AuthorizationError when id available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1234567890' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1234567890', owner: 'user-1234567890' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1234567890', threadId: 'thread-1234567890', owner: 'user-1234567890' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyComment('comment-1234567890', 'user-1234567890')).resolves.not.toThrowError(NotFoundError);
      await expect(commentRepositoryPostgres.verifyComment('comment-1234567890', 'user-1234567890')).resolves.not.toThrowError(AuthorizationError);
      await expect(commentRepositoryPostgres.verifyComment('comment-1234567890', 'user-1234567890')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('deleteComment function', () => {
    it('should persist Delete Comment when commentId correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1234567890' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1234567890' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1234567890' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.verifyComment('comment-1234567890', 'user-1234567890');
      await commentRepositoryPostgres.deleteComment('comment-1234567890');

      // Assert
      const findComments = await CommentsTableTestHelper.findCommentsById('comment-1234567890');

      expect(findComments).toHaveLength(1);
      expect(findComments[0]).toHaveProperty('is_delete');
      expect(findComments[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should throw NotFoundError when id not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-1234567890');

      expect(comments).toHaveLength(0);
    });

    it('should persist get Comment when threadId correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1234567890' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1234567890' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1234567890', date: '2023-11-12T18:06:25.977Z' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-1234567890');

      // Assert
      expect(comments).toHaveLength(1);

      expect(comments[0]).toHaveProperty('id');
      expect(comments[0]).toHaveProperty('username');
      expect(comments[0]).toHaveProperty('date');
      expect(comments[0]).toHaveProperty('content');

      expect(comments[0]).toStrictEqual(
        new DetailComment({
          id: 'comment-1234567890',
          username: 'dicoding',
          date: '2023-11-12T18:06:25.977Z',
          content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
          isDelete: false,
        }),
      );
    });

    it('should persist get deleted Comment when threadId correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1234567890' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1234567890' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1234567890', date: '2023-11-12T18:06:25.977Z', isDelete: true });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-1234567890');

      // Assert
      expect(comments).toHaveLength(1);

      expect(comments[0]).toHaveProperty('id');
      expect(comments[0]).toHaveProperty('username');
      expect(comments[0]).toHaveProperty('date');
      expect(comments[0]).toHaveProperty('content');

      expect(comments[0]).toStrictEqual(
        new DetailComment({
          id: 'comment-1234567890',
          username: 'dicoding',
          date: '2023-11-12T18:06:25.977Z',
          content: 'Apakah setelah saya menyelesaikan kelas DBS, saya tetap bisa mengkases kelasnya?',
          isDelete: true,
        }),
      );
    });
  });
});
