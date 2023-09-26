import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './schemas/question.schema';
import { Category } from './schemas/category.schema';
import { Difficulty } from './schemas/difficulty.schema';
import { QuestionWithCategoryAndDifficulty } from './interface';
import { QuestionCategory } from './schemas/question-category.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Difficulty.name) private diffcultyModel: Model<Difficulty>,
    @InjectModel(QuestionCategory.name)
    private questionCategoryModel: Model<QuestionCategory>,
  ) {}

  // QUESTIONS

  async getQuestions(): Promise<QuestionWithCategoryAndDifficulty[]> {
    return this.questionModel
      .find()
      .exec()
      .then(
        async (questions) =>
          await Promise.all(
            questions.map(async (question) => {
              return await this.getQuestionWithId(question._id.toString());
            }),
          ),
      );
  }

  async addQuestion(
    questionWithCategories: QuestionWithCategoryAndDifficulty,
  ): Promise<QuestionWithCategoryAndDifficulty> {
    // Check if difficulty and categories exist
    const difficultyObject = await this.getDifficultyIfExists(
      questionWithCategories.difficulty.id,
    );
    const categoryObjects = await Promise.all(
      questionWithCategories.categories.map((category) =>
        this.getCategoryIfExists(category.id),
      ),
    );

    // Create new question
    const newQuestionObject = new this.questionModel({
      title: questionWithCategories.title,
      description: questionWithCategories.description,
      difficulty: difficultyObject,
    });
    const newQuestion = (await newQuestionObject.save()).toObject();

    // Create question categories
    await this.createQuestionCategories(newQuestion, categoryObjects);

    return {
      ...newQuestion,
      difficulty: difficultyObject,
      categories: categoryObjects,
    };
  }

  private async getDifficultyIfExists(difficultyId: string | Difficulty) {
    const difficultyObject = await this.diffcultyModel.findById(difficultyId);
    if (difficultyObject == null) {
      throw new NotFoundException('Difficulty not found');
    }

    return difficultyObject.toObject();
  }

  private async getCategoryIfExists(categoryId: string | Category) {
    const categoryObject = await this.categoryModel.findById(categoryId);
    if (categoryObject == null) {
      throw new NotFoundException('Category not found');
    }

    return categoryObject.toObject();
  }

  private async createQuestionCategories(
    newQuestion: Question,
    categoryObjects: Category[],
  ) {
    await Promise.all(
      categoryObjects.map((category) => {
        const newQuestionCategoryObj = new this.questionCategoryModel({
          question: newQuestion,
          category,
        });
        return newQuestionCategoryObj.save();
      }),
    );
  }

  async getQuestionWithId(
    questionId: string,
  ): Promise<QuestionWithCategoryAndDifficulty> {
    const questionObject = await this.getQuestionIfExists(questionId);
    const difficultyObject = await this.getDifficultyIfExists(
      questionObject.difficulty,
    );

    const questionCategories =
      (await this.questionCategoryModel.find({
        question: questionId,
      })) ?? [];

    const categories = await Promise.all(
      questionCategories.map((questionCategory) =>
        this.getCategoryIfExists(questionCategory.category),
      ),
    );

    return {
      ...questionObject,
      difficulty: difficultyObject,
      categories: categories,
    };
  }

  private async getQuestionIfExists(questionId: string | Question) {
    const questionObject = await this.questionModel.findById(questionId);
    if (questionObject == null) {
      throw new NotFoundException('Question not found');
    }

    return questionObject.toObject();
  }

  async deleteQuestionWithId(questionId: string): Promise<string> {
    await this.questionCategoryModel.deleteMany({
      question: questionId,
    });
    await this.questionModel.findByIdAndDelete(questionId);

    return questionId;
  }

  // CATEGORIES

  getCategories(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  // DIFFICULTIES

  getDifficulties(): Promise<Difficulty[]> {
    return this.diffcultyModel.find().exec();
  }
}
