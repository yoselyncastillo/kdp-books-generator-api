import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.booksRepository.find({
      select: ['id', 'title', 'status', 'config', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book #${id} not found`);
    }
    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(book);
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, updateBookDto);
    return this.booksRepository.save(book);
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);
    await this.booksRepository.remove(book);
  }

  async duplicate(id: string): Promise<Book> {
    const book = await this.findOne(id);

    const samplePuzzleData = [{
      title: 'Muestra 1',
      scripture: 'Este es un texto de muestra para visualizar el diseño heredado.',
      words: ['MUESTRA', 'DISEÑO', 'PRUEBA', 'PLANTILLA'],
      reflectionText: 'Texto de reflexión de muestra...',
      footerPrayer: 'Oración de muestra...'
    }];

    const duplicateData = {
      title: `Copia de ${book.title}`,
      config: book.config, // TypeORM clona por referencia, pero al guardar jsonb se serializa
      puzzleData: samplePuzzleData,
      status: 'draft',
    };

    const newBook = this.booksRepository.create(duplicateData);
    return this.booksRepository.save(newBook);
  }
}
