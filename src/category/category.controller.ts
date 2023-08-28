import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, FilterCatDto, QueryCatDto, UpdateCategoryDto } from './dto/category.dto';
import { CategoryEntity } from './entities/category.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

export const CATEGORY_URL = 'http://localhost:3000/category'
// @ApiBearerAuth()
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ){}
  
  @ApiOperation({ summary: 'create new a Category' })
  @Post()
  async create(@Body() createCategory: CreateCategoryDto): Promise<CategoryEntity>{
    return this.categoryService.create(createCategory)
  }

  @Get('/search')
  async getCategorys(@Query() filterDto: FilterCatDto): Promise<CategoryEntity[]>{
    if(Object.keys(filterDto).length)  {
      return this.categoryService.getCategorys(filterDto)
    }

  }

  @Get('')
  @ApiOperation({ summary: 'List Categories' })
  paginateList(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number =10
  ){
    pageSize = pageSize > 100 ? 100 : pageSize

    return this.categoryService.paginateList({
      limit: Number(pageSize),
      page: Number(page),
      route: CATEGORY_URL,
    })
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Show a category' })
  async showOne(@Param('id') id: number): Promise<CategoryEntity>{
    return this.categoryService.showOne(id)
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a category' })
  async upDateOne(
    @Param('id') id: number,
    @Body() updateCategory: UpdateCategoryDto
  ){
    return this.categoryService.updateOne(id, updateCategory)
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a category' })
  async deleteOne(@Param('id') id: number): Promise<any>{
    return this.categoryService.deleteOne(id)
  }

  @Delete('/:idmultiple')
  deleteMutiple(@Query('ids', new ParseArrayPipe({items: String, separator: ','})) ids: string[]): Promise<any>{
    return this.categoryService.deleteMutiple(ids)
  }

  @Get(':id/cout-post')
  async getPostCountByCate(@Param('id') id : number): Promise<number>{
    return this.categoryService.getPostCountByCate(id)
  }

  @Get('/getCat')
  async index(@Query() queryDto: QueryCatDto): Promise<Pagination<CategoryEntity>> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;

    if (queryDto.name) {
      return await this.categoryService.paginateFilterByName(
        {
          page,
          limit,
          route: 'http://localhost:3000/media',
        },
        queryDto.name,
      );
    }
    if (queryDto.company) {
      return await this.categoryService.paginateFilterByCompany(
        {
          page,
          limit,
          route: 'http://localhost:3000/media',
        },
        queryDto.company,
      );
    }
    if(queryDto.createAt)
    {
      return await this.categoryService.paginateFilterByDate(
        {
        page,
        limit,
        route: 'http://localhost:3000/media',
      },
      queryDto.createAt,
      );
    }
    else{
      return await this.categoryService.paginate(
        {
        page,
        limit,
        route: 'http://localhost:3000/media',
      })
    }
  }
}
