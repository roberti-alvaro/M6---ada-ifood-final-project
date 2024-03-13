import { UpdateUsersController } from '../../../src/controllers/users/update'
import { logger } from '../../mocks/logger'
import { usersRepositoryMock } from '../../mocks/users_repository'
import { NewUser, User } from '../../../src/controllers/models'
import { fakerEN } from '@faker-js/faker'
import { Request, Response } from 'express'

describe('UpdateUsersController', () => {
  function makeSut() {
    const controller = new UpdateUsersController(logger, usersRepositoryMock)

    const newUserMock: NewUser = {
      name: fakerEN.word.words(),
      email: fakerEN.word.words()
    }

    const userMock: User = {
      id: fakerEN.string.uuid(),
      ...newUserMock
    }

    const requestMock = {
      body: newUserMock,
      params: { id: userMock.id } as any
    } as Request

    const responseMock = {
      statusCode: 0,
      status: (status: number) => {
        responseMock.statusCode = status
        return {
          json: jest.fn(),
          send: jest.fn(),
        } as any
      },
    } as Response

    return {
      controller, requestMock, responseMock, usersRepositoryMock, userMock, newUserMock
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  
  // //  "and if there is no other user with the same email"? Testar e-mail duplicado deveria ser atribuição do "create"
  it('should update and return user if the user was funded and if there is no other user with the same email', async () => {
    const { controller, userMock, requestMock, responseMock } = makeSut()
    jest.spyOn(usersRepositoryMock, 'getById').mockResolvedValueOnce(userMock)
    jest.spyOn(usersRepositoryMock, 'update').mockResolvedValueOnce()

    const promise = controller.update(requestMock, responseMock)

    await expect(promise).resolves.not.toThrow()
    expect(usersRepositoryMock.getById).toHaveBeenCalledWith(userMock.id)
    expect(responseMock.statusCode).toEqual(200)
  })

  it('should return 404 statusCode and not update the user if there is no user with the id provided', async () => {
    const { controller, usersRepositoryMock, userMock, requestMock, responseMock } = makeSut()
    jest.spyOn(usersRepositoryMock, 'getById').mockRejectedValueOnce(null);

    try {
      await controller.update(requestMock, responseMock);
    } catch (error) {
      expect(usersRepositoryMock.getById).toHaveBeenCalledWith(userMock.id);
      expect(responseMock.statusCode).toEqual(404);
    }
  });

  it('should return 409 statusCode and not update the user if there is an user with the same email', async () => {
    const { controller, usersRepositoryMock, userMock, requestMock, responseMock } = makeSut()
    jest.spyOn(usersRepositoryMock, 'getByEmail').mockRejectedValueOnce(null);

    try {
      await controller.update(requestMock, responseMock);
    } catch (error) {
      expect(usersRepositoryMock.getByEmail).toHaveBeenCalledWith(userMock.email);
      expect(responseMock.statusCode).toEqual(409);
    }
  });

  it('should return 500 if some error occur', async () => {
    const { controller, userMock, requestMock, responseMock } = makeSut()
    jest.spyOn(usersRepositoryMock, 'getById').mockRejectedValueOnce(new Error('some error'))

    const promise = controller.update(requestMock, responseMock)

    await expect(promise).resolves.not.toThrow()
    expect(usersRepositoryMock.getById).toHaveBeenCalledWith(userMock.id)
    expect(responseMock.statusCode).toEqual(500)
  })
})