import {
  EmptyParamError,
  InvalidQueryTypeError,
  SizeQueryError
} from 'core/error';
import { StudentModel } from 'core/models';
import { GetStudentsByNamePagedUseCase } from 'core/use-cases';
import { GetAllStudentsPagedUseCase } from 'core/use-cases/get-all-students-paged-use-case';
import {
  badRequest,
  Controller,
  HttpResponse,
  serverError,
  success
} from 'presentation/contracts';
import { PaginationView } from 'presentation/views/pagination-view';

export class GetAllOrByNameStudentsPagedController implements Controller {
  constructor(
    private readonly getAllStudentsPaged: GetAllStudentsPagedUseCase,
    private readonly getStudentsByNamePaged: GetStudentsByNamePagedUseCase
  ) {}

  async handle(
    request: GetAllOrByNameStudentsPagedController.Request
  ): Promise<HttpResponse<PaginationView>> {
    try {
      const page = request.query.pagina;
      const limit = request.query.limite;
      const name = request.query.nome;

      const { pagination, resultSize, result } = name
        ? await this.getStudentsByNamePaged.execute(name, page, limit)
        : await this.getAllStudentsPaged.execute(page, limit);

      return success({
        paginacao: {
          pagina: pagination.page,
          limite: pagination.limit,
          paginas: pagination.pageCount,
          temProximaPagina: pagination.hasNextPage,
          temPaginaAnterior: pagination.hasPreviusPage
        },
        tamanho: resultSize,
        resultado: result.map((student: StudentModel) => {
          return {
            rga: student.rga,
            nome: student.name,
            curso: student.course,
            situacao: student.status,
            registrado_em: student.registeredIn
          };
        })
      });
    } catch (error: any) {
      if (
        error instanceof InvalidQueryTypeError ||
        error instanceof SizeQueryError ||
        error instanceof EmptyParamError
      ) {
        return badRequest(error);
      }
      return serverError(error);
    }
  }
}

export namespace GetAllOrByNameStudentsPagedController {
  export type Request = {
    query: {
      limite?: number;
      pagina?: number;
      nome?: string;
    };
  };
}
