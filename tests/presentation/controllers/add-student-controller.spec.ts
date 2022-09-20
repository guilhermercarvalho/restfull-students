import { AddStudentController } from '@/presentation/controllers';
import { badRequest, serverError } from '@/presentation/interfaces';
import { throwError } from '@/tests/domain/mocks';
import { AddStudentSpy, ValidationSpy } from '@/tests/presentation/mocks';

import { faker } from '@faker-js/faker';
import MockDate from 'mockdate';

const mockRequest = (): AddStudentController.Request => ({
  rga:
    faker.random.numeric(4) +
    '.' +
    faker.random.numeric(4) +
    '.' +
    faker.random.numeric(3) +
    '-' +
    faker.random.numeric(1),
  nome: faker.name.fullName(),
  curso: faker.helpers.arrayElement([
    'cc',
    'si',
    'ecomp',
    'engsoft',
    'tads',
    'trc'
  ]),
  situacao: faker.helpers.arrayElement(['ativo', 'inativo'])
});

type SutTypes = {
  sut: AddStudentController;
  validationSpy: ValidationSpy;
  addStudentSpy: AddStudentSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const addStudentSpy = new AddStudentSpy();
  const sut = new AddStudentController(validationSpy, addStudentSpy);
  return {
    sut,
    validationSpy,
    addStudentSpy
  };
};

describe('AddStudent Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);

    expect(validationSpy.input).toHaveProperty('rga', request.rga);
    expect(validationSpy.input).toHaveProperty('name', request.nome);
    expect(validationSpy.input).toHaveProperty('course', request.curso);
    expect(validationSpy.input).toHaveProperty('status', request.situacao);
  });

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new Error();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toStrictEqual(badRequest(validationSpy.error));
  });

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addStudentSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);

    expect(addStudentSpy.params).toHaveProperty('rga', request.rga);
    expect(addStudentSpy.params).toHaveProperty('name', request.nome);
    expect(addStudentSpy.params).toHaveProperty('course', request.curso);
    expect(addStudentSpy.params).toHaveProperty('status', request.situacao);
  });

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addStudentSpy } = makeSut();
    jest.spyOn(addStudentSpy, 'add').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toStrictEqual(serverError(new Error()));
  });

  test('Should return 201 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse.statusCode).toBe(201);
  });
});
