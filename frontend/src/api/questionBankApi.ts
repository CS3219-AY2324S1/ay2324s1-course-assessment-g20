import { ICategory, IDifficulty, IQuestion } from '../interfaces';
import { backendServicesPaths, HttpRequestMethod } from '../utils/constants';
import { requestBackend } from './requestBackend';

// This API shows how to use the auth interceptor
export async function getQuestions() {
  return requestBackend({
    url: backendServicesPaths.question.questions,
    method: HttpRequestMethod.GET,
  });
}

export async function addQuestion(question: IQuestion) {
  return requestBackend({
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

export async function getQuestionWithId(questionId: string) {
  return requestBackend({
    url: `${backendServicesPaths.question.questions}/${questionId}`,
    method: HttpRequestMethod.GET,
  });
}

export async function getDifficulties() {
  return requestBackend({
    url: backendServicesPaths.question.difficulties,
    method: HttpRequestMethod.GET,
  });
}

export async function addDifficulty(difficulty: IDifficulty) {
  return requestBackend({
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
  return requestBackend({
    url: backendServicesPaths.question.categories,
    method: HttpRequestMethod.GET,
  });
}

export async function addCategory(category: ICategory) {
  return requestBackend({
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
