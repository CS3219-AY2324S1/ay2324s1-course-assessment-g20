import { ICategory, IDifficulty, IQuestion } from '../@types/question';
import { backendServicesPaths, HttpRequestMethod } from '../utils/constants';
import { requestBackend } from './requestBackend';

// This API shows how to use the auth interceptor
export async function getQuestions() {
  return requestBackend<IQuestion[]>({
    url: backendServicesPaths.question.questions,
    method: HttpRequestMethod.GET,
  });
}

export async function addQuestion(question: IQuestion) {
  return requestBackend<IQuestion>({
    url: backendServicesPaths.question.questions,
    method: HttpRequestMethod.POST,
    data: { question },
  });
}

export async function deleteQuestionWithId(questionId: string) {
  return requestBackend({
    url: `${backendServicesPaths.question.questions}/${questionId}`,
    method: HttpRequestMethod.DELETE,
  });
}

export async function updateQuestionWithId(question: IQuestion) {
  return requestBackend<IQuestion>({
    url: `${backendServicesPaths.question.questions}/${question._id}`,
    method: HttpRequestMethod.PATCH,
    data: { question },
  });
}

export async function getQuestionWithId(questionId: string) {
  return requestBackend<IQuestion>({
    url: `${backendServicesPaths.question.questions}/${questionId}`,
    method: HttpRequestMethod.GET,
  });
}

export async function getQuestionsByDifficulty(difficultyId: string) {
  return requestBackend<IQuestion[]>({
    url: backendServicesPaths.question.getQuestionsByDifficulty(difficultyId),
    method: HttpRequestMethod.GET,
  });
}

export async function getDifficulties() {
  return requestBackend<IDifficulty[]>({
    url: backendServicesPaths.question.difficulties,
    method: HttpRequestMethod.GET,
  });
}

export async function addDifficulty(difficulty: IDifficulty) {
  return requestBackend<IDifficulty>({
    url: backendServicesPaths.question.difficulties,
    method: HttpRequestMethod.POST,
    data: { difficulty },
  });
}

export async function deleteDifficultyWithId(difficultyId: string) {
  return requestBackend({
    url: `${backendServicesPaths.question.difficulties}/${difficultyId}`,
    method: HttpRequestMethod.DELETE,
  });
}

export async function getCategories() {
  return requestBackend<ICategory[]>({
    url: backendServicesPaths.question.categories,
    method: HttpRequestMethod.GET,
  });
}

export async function addCategory(category: ICategory) {
  return requestBackend<ICategory>({
    url: backendServicesPaths.question.categories,
    method: HttpRequestMethod.POST,
    data: { category },
  });
}

export async function deleteCategoryWithId(categoryId: string) {
  return requestBackend({
    url: `${backendServicesPaths.question.categories}/${categoryId}`,
    method: HttpRequestMethod.DELETE,
  });
}
