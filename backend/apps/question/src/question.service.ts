import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './schemas/question.schema';
import { Category } from './schemas/category.schema';
import { Difficulty } from './schemas/difficulty.schema';
import { Question as QuestionWithCategoryAndDifficulty } from '@app/microservice/interfaces/question';
import { PEERPREP_EXCEPTION_TYPES } from '@app/types/exceptions';
import { PeerprepException } from '@app/utils/exceptionFilter/peerprep.exception';
import {
  isMongoServerError,
  mapMongoServerErrorToCustomMessage,
} from '@app/utils/exceptionFilter/utils/mongoServerErrorUtils';
import { Catch } from '@app/utils/exceptionFilter/catch.decorator';

@Injectable()
@Catch(Error, (err) => {
  if (err instanceof PeerprepException) {
    throw err;
  }

  throw new PeerprepException(
    err.message,
    PEERPREP_EXCEPTION_TYPES.BAD_REQUEST,
  );
})
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Difficulty.name) private diffcultyModel: Model<Difficulty>,
  ) {}

  // QUESTIONS

  getQuestions(): Promise<QuestionWithCategoryAndDifficulty[]> {
    return this.questionModel
      .find({ isDeleted: false })
      .populate('categories')
      .populate('difficulty')
      .then((questions) =>
        questions.map((q) => ({
          ...q.toObject(),
          difficulty: q.difficulty.name,
          categories: q.categories.map((c) => c.name),
        })),
      );
  }

  async getQuestionsByDifficulty(difficulty: string | Difficulty) {
    const difficultyObject = await this.getDifficultyIfExists(difficulty);
    const questionObjects = await this.questionModel
      .find({
        difficulty: difficultyObject,
        isDeleted: false,
      })
      .exec();

    return await Promise.all(
      questionObjects.map(async (question) => {
        return await this.getQuestionWithId(question._id.toString());
      }),
    );
  }

  async addQuestion(
    questionWithCategoriesAndDifficulty: QuestionWithCategoryAndDifficulty,
  ): Promise<QuestionWithCategoryAndDifficulty> {
    // Check if difficulty and categories exist
    const difficultyObject = await this.getDifficultyIfExists(
      questionWithCategoriesAndDifficulty.difficulty,
    );
    const categoryObjects = await Promise.all(
      questionWithCategoriesAndDifficulty.categories.map((category) =>
        this.getCategoryIfExists(category),
      ),
    );

    // Create new question
    const newQuestionObject = new this.questionModel({
      title: questionWithCategoriesAndDifficulty.title,
      description: questionWithCategoriesAndDifficulty.description,
      difficulty: difficultyObject,
      categories: categoryObjects,
    });
    const newQuestion = await newQuestionObject
      .save()
      .then((newQuestion) => newQuestion.toObject())
      .catch((error) => {
        if (isMongoServerError(error)) {
          throw new PeerprepException(
            mapMongoServerErrorToCustomMessage(error),
            PEERPREP_EXCEPTION_TYPES.BAD_REQUEST,
          );
        }

        throw error;
      });

    return {
      ...newQuestion,
      difficulty: questionWithCategoriesAndDifficulty.difficulty,
      categories: categoryObjects.map((category) => category.name),
    };
  }

  private async getDifficultyIfExists(difficulty: string | Difficulty) {
    // This is okay since the difficulties collection has a unique index on 'name'
    const difficultyObject =
      (await this.diffcultyModel.findOne({
        name: difficulty,
      })) ?? (await this.diffcultyModel.findById(difficulty.toString()));

    if (difficultyObject == null) {
      throw new PeerprepException(
        'Difficulty not found',
        PEERPREP_EXCEPTION_TYPES.NOT_FOUND,
      );
    }

    return difficultyObject.toObject();
  }

  private async getCategoryIfExists(category: string | Category) {
    // This is okay since the categories collection has a unique index on 'name'
    const categoryObject =
      (await this.categoryModel.findOne({ name: category })) ??
      (await this.categoryModel.findById(category.toString()));

    if (categoryObject == null) {
      throw new PeerprepException(
        'Category not found',
        PEERPREP_EXCEPTION_TYPES.NOT_FOUND,
      );
    }

    return categoryObject.toObject();
  }

  public async getQuestionWithId(questionId: string) {
    const questionObject = await this.questionModel
      .findById(questionId)
      .populate('categories')
      .populate('difficulty');

    if (questionObject == null) {
      throw new PeerprepException(
        'Question not found',
        PEERPREP_EXCEPTION_TYPES.NOT_FOUND,
      );
    }

    return {
      ...questionObject.toObject(),
      categories: questionObject.categories.map((c) => c.name),
      difficulty: questionObject.difficulty.name,
    };
  }

  async deleteQuestionWithId(questionId: string): Promise<string> {
    await this.questionModel.findByIdAndUpdate(questionId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    return questionId;
  }

  async updateQuestionWithId(
    questionWithCategoriesAndDifficulty: QuestionWithCategoryAndDifficulty,
  ): Promise<QuestionWithCategoryAndDifficulty> {
    // Check if difficulty and categories exist
    const difficultyObject = await this.getDifficultyIfExists(
      questionWithCategoriesAndDifficulty.difficulty,
    );
    const categoryObjects = await Promise.all(
      questionWithCategoriesAndDifficulty.categories.map((category) =>
        this.getCategoryIfExists(category),
      ),
    );

    // Find and update question
    const newQuestion = await this.questionModel
      .findByIdAndUpdate(
        questionWithCategoriesAndDifficulty._id ?? '',
        {
          title: questionWithCategoriesAndDifficulty.title,
          description: questionWithCategoriesAndDifficulty.description,
          difficulty: difficultyObject,
          categories: categoryObjects,
        },
        { new: true },
      )
      .catch((error) => {
        if (isMongoServerError(error)) {
          throw new PeerprepException(
            mapMongoServerErrorToCustomMessage(error),
            PEERPREP_EXCEPTION_TYPES.BAD_REQUEST,
          );
        }

        throw error;
      });

    return {
      ...newQuestion.toObject(),
      difficulty: questionWithCategoriesAndDifficulty.difficulty,
      categories: categoryObjects.map((category) => category.name),
    };
  }

  // CATEGORIES

  getCategories(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async addCategory(category: Category): Promise<Category> {
    const newCategory = new this.categoryModel(category);
    return (await newCategory.save()).toObject();
  }

  async deleteCategoryWithId(categoryId: string): Promise<string> {
    return await this.categoryModel.findByIdAndDelete(categoryId).then(() => {
      return categoryId;
    });
  }

  // DIFFICULTIES

  getDifficulties(): Promise<Difficulty[]> {
    return this.diffcultyModel.find().exec();
  }

  async addDifficulty(difficulty: Difficulty): Promise<Difficulty> {
    const newDifficulty = new this.diffcultyModel(difficulty);
    return (await newDifficulty.save()).toObject();
  }

  async deleteDifficultyWithId(difficultyId: string): Promise<string> {
    return await this.diffcultyModel
      .findByIdAndDelete(difficultyId)
      .then(() => {
        return difficultyId;
      });
  }
}
