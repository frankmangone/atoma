import { Query, Resolver } from '@nestjs/graphql';
import { Compound } from '@schemas/compound.schema';

@Resolver(() => Compound)
export class CompoundsResolver {
  // constructor(
  //   private authorsService: AuthorsService,
  //   private postsService: PostsService,
  // ) {}

  @Query(() => Compound)
  async author() {
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
