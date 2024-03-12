import { UpdateUsersController } from '../../../src/controllers/users/update'
import { logger } from '../../mocks/logger'
import { usersRepositoryMock } from '../../mocks/users_repository'
import { Book, NewBook, NewUser, User } from '../../../src/controllers/models'
import { fakerEN } from '@faker-js/faker'
import { Request, Response } from 'express'

describe('UpdateUsersController', ()=> {
  function makeSut() {
    const controller = new UpdateUsersController(logger, usersRepositoryMock)
    
    const newBookMock: NewBook = {
      title: fakerEN.word.words(),
      subtitle: fakerEN.word.words(),
      publishing_company: fakerEN.company.name(),
      published_at: fakerEN.date.anytime(),
      authors: fakerEN.internet.userName(),
    }

    //Inclusão
    const newUserMock: NewUser = {
      name: fakerEN.word.words(),
      email: fakerEN.word.words()
    }

    const bookMock: Book = {
      id: fakerEN.string.uuid(),
      ...newBookMock
    }

    // Inclusão
    const userMock: User = {
      id: fakerEN.string.uuid(),
      ...newUserMock
    }

    const requestMock = { 
      body: newBookMock,
      params: { id: bookMock.id } as any
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
      controller, newBookMock, bookMock, requestMock, responseMock, usersRepositoryMock, userMock
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it.todo('should update and return user if the user was funded and if there is no other user with the same email')

  // it.todo('should return 404 statusCode and not update the user if there is no user with the id provided')
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

  // it.todo('should return 409 statusCode and not update the user if there is an user with the same email')
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

  // it.todo('should return 500 if some error occur')
  // Não consegui trocar o bookMock.id pelo userMock.id (?)
  it('should return 500 if some error occur', async () => {
    const { controller, bookMock, userMock, requestMock, responseMock } = makeSut()
    jest.spyOn(usersRepositoryMock, 'getById').mockRejectedValueOnce(new Error('some error'))

    const promise = controller.update(requestMock, responseMock)

    await expect(promise).resolves.not.toThrow()
    expect(usersRepositoryMock.getById).toHaveBeenCalledWith(bookMock.id)
    expect(responseMock.statusCode).toEqual(500)
  })
})