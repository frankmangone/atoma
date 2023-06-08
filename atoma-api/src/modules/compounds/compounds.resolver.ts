import { Query, Resolver } from '@nestjs/graphql';
import { Compound } from '@schemas/compound.schema';
import { CompoundsService } from './compounds.service';

@Resolver(() => Compound)
export class CompoundsResolver {
  constructor(private readonly _compoundsService: CompoundsService) {}

  /**
   * findManyCompounds
   *
   * Queries for multiple compounds.
   *
   * @returns
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

  // @ResolveField()
  // async posts(@Parent() author: Author) {
  //   const { id } = author;
  //   return this.postsService.findAll({ authorId: id });
  // }
}
