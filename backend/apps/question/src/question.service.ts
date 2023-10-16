import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './schemas/question.schema';
import { Category } from './schemas/category.schema';
import { Difficulty } from './schemas/difficulty.schema';
import { QuestionCategory } from './schemas/question-category.schema';
import { Question as QuestionWithCategoryAndDifficulty } from '@app/microservice/interfaces/question';

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
    });
    const newQuestion = (await newQuestionObject.save()).toObject() as Question;

    // Create question categories
    await this.createQuestionCategories(newQuestion, categoryObjects);

    return {
      ...newQuestion,
      difficulty: questionWithCategoriesAndDifficulty.difficulty,
      categories: categoryObjects.map((category) => category.name),
    };
  }

  private async getDifficultyIfExists(difficulty: string | Difficulty) {
    const difficultyObject =
      (await this.diffcultyModel.findOne({
        name: difficulty,
      })) ?? (await this.diffcultyModel.findById(difficulty.toString()));

    if (difficultyObject == null) {
      throw new NotFoundException('Difficulty not found');
    }

    return difficultyObject.toObject();
  }

  private async getCategoryIfExists(category: string | Category) {
    const categoryObject =
      (await this.categoryModel.findOne({ name: category })) ??
      (await this.categoryModel.findById(category.toString()));

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

  public async getQuestionWithId(
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

    const categories = (
      await Promise.all(
        questionCategories.map((questionCategory) =>
          this.getCategoryIfExists(questionCategory.category),
        ),
      )
    ).map((category) => category.name);

    return {
      ...questionObject,
      difficulty: difficultyObject.name,
      categories: categories,
    };
  }

  private async getQuestionIfExists(questionId: string) {
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
