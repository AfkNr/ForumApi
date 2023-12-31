const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
      body: 'Yuk belajar bersama Dicoding dan DBS Foundation Program 2023 di Kelas Backend Expert',
      date: '2023-10-28:13:00',
      owner: 'user-1234567890',
    };

    const expectedAddedThread = new AddedThread({
      id: 'thread-1234567890',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new AddedThread({
          id: 'thread-1234567890',
          title: 'DBS Foundation Program 2023 - Kelas Backend Expert',
          owner: 'user-1234567890',
        }),
      ));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
      date: useCasePayload.date,
    }));
  });
});
