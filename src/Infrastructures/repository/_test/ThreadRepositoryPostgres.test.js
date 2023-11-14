const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1234567890' });

      const addThread = new AddThread({
        title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
        body: 'Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert',
        date: '2023-10-28:13:00',
        owner: 'user-1234567890',
      });

      const fakeIdGenerator = () => '12345'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-12345');

      expect(thread).toHaveLength(1);

      expect(thread[0].id).toStrictEqual('thread-12345');
      expect(thread[0].title).toStrictEqual('DBS Foundation Program 2023 - Kelas Backend Expert');
      expect(thread[0].body).toStrictEqual('Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert');
      expect(thread[0].date).toStrictEqual('2023-10-28:13:00');
      expect(thread[0].owner).toStrictEqual('user-1234567890');
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1234567890' });

      const addThread = new AddThread({
        title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
        body: 'Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert',
        date: '2023-10-28:13:00',
        owner: 'user-1234567890',
      });

      const fakeIdGenerator = () => '12345'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-12345',
        title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
        owner: 'user-1234567890',
      }));
    });
  });

  describe('verifyThread function', () => {
    it('should throw NotFoundError when not id available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThread('thread-12345')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when id available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1234567890' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-12345', owner: 'user-1234567890' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThread('thread-12345')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when  id not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-12345')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when id available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1234567890' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-12345', date: '2023-11-12T18:06:25.977Z' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const getThreadById = await threadRepositoryPostgres.getThreadById('thread-12345');
      // Assert
      expect(getThreadById).toHaveProperty('id');
      expect(getThreadById).toHaveProperty('title');
      expect(getThreadById).toHaveProperty('body');
      expect(getThreadById).toHaveProperty('date');
      expect(getThreadById).toHaveProperty('username');

      expect(getThreadById).toStrictEqual(
        {
          id: 'thread-12345',
          title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
          body: 'Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert',
          date: '2023-11-12T18:06:25.977Z',
          username: 'dicoding',
        },
      );
      await expect(threadRepositoryPostgres.getThreadById('thread-12345')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
