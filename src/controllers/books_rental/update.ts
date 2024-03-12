import { Request, Response } from "express";
import { IBooksRentalRepository } from "../interfaces";
import { Logger } from "winston";
import { NewBooksRental } from "../models";

export class UpdateBooksRentalController {
  constructor(
    private readonly logger: Logger,
    private readonly booksRentalRepository: IBooksRentalRepository
  ) {}

  public async update(req: Request<any, any, NewBooksRental>, res: Response): Promise<void> {
    const { id } = req.params
    const body = req.body

    try {
      const booksRental = await this.booksRentalRepository.getById(id)
      if(!booksRental){
        res.status(404).json({ message: 'no books rental with the id provided was founded' })
        return
      }

      await this.booksRentalRepository.update(id, body)

      res.status(200).json({...booksRental, ...body,})
      return
    }catch(err){ 
      this.logger.error({ message: 'error to update books rental', error: err })
      res.status(500).json({ message: 'something went wrong, try again latter!' })
      return
    }
  }
}