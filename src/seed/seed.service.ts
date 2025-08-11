import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { axiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel('Pokemon')
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: axiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=50',
    );

    const pokemonToInsert: { name: string; no: number }[] = [];
    // const insertPromisesArray: Promise<Pokemon>[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      pokemonToInsert.push({ name, no });
      // insertPromisesArray.push(this.pokemonModel.create({name, no}));
    });

    await this.pokemonModel.insertMany(pokemonToInsert);
    // const newArray = await Promise.all(insertPromisesArray);

    return 'Seed executed successfully';
  }
}
