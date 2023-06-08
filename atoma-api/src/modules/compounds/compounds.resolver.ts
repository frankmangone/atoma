import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Compound } from '@schemas/compound.schema';
import { CompoundsService } from './compounds.service';
import { CreateCompoundInput } from './inputs/create-compound.input';
import { Payload } from '@common/decorators';

@Resolver(() => Compound)
export class CompoundsResolver {
  constructor(private readonly _compoundsService: CompoundsService) {}

  /**
   * findManyCompounds
   *
   * Queries for multiple compounds.
   *
   * @returns {Promise<Compound[]>}
   */
  @Query(() => [Compound])
  async findManyCompounds(): Promise<Compound[]> {
    return this._compoundsService.findAll();
  }

  @Query(() => Compound)
  async findOneCompound() {
    //@Args('id', { type: () => Int }) id: number) {
    return {
      name: 'water',
      reducedFormula: 'H2O',
      alternativeNames: [],
    };
    // this.authorsService.findOneById(id);
  }

  /**
   * createCompound
   *
   * Creates a compound in the database.
   *
   * @returns
   */
  @Mutation(() => Compound)
  async createCompound(
    @Payload() payload: CreateCompoundInput,
  ): Promise<Compound> {
    console.log(payload);

    const compounds = await this._compoundsService.findAll();
    return compounds[0];
  }

  // @ResolveField()
  // async posts(@Parent() author: Author) {
  //   const { id } = author;
  //   return this.postsService.findAll({ authorId: id });
  // }
}
