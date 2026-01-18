import { Category } from "../../../vo/Category.js";
import { Exam } from "../../../vo/Exam.js";
import { Question } from "../../../vo/Question.js";
import { Subcategory } from "../../../vo/Subcategory.js";
import { User } from "../../../vo/User.js";
import { CategoryEntity } from "../CategoryEntity.js";
import { ExamEntity } from "../ExamEntity.js";
import { QuestionEntity } from "../QuestionEntity.js";
import { SubcategoryEntity } from "../SubcategoryEntity.js";
import { UserEntity } from "../UserEntity.js";
import { File } from "../../../vo/File.js";
import { FileEntity } from "../FileEntity.js";
declare class Converter {
    convertCategoryEntityToCategory(categoryEntity: CategoryEntity): Category;
    convertCategoryToCategoryEntity(category: Category): CategoryEntity;
    convertExamEntityToExam(examEntity: ExamEntity): Exam;
    convertExamToExamEntity(exam: Exam, subcategoryId?: number): ExamEntity;
    convertQuestionEntityToQuestion(questionEntity: QuestionEntity): Question;
    convertQuestionToQuestionEntity(question: Question, examId?: number): QuestionEntity;
    convertSubcategoryEntityToSubcategory(subcategorieEntity: SubcategoryEntity): Subcategory;
    convertSubcategoryToSubcategoryEntity(subcategory: Subcategory, categoryId?: number): SubcategoryEntity;
    convertUserEntityToUser(userEntity: UserEntity): User;
    convertUserToUserEntity(user: User): UserEntity;
    convertFileEntityToFile(fileEntity: any): File;
    convertFileToFileEntity(file: File, subcategoryId?: number): FileEntity;
}
export declare let converter: Converter;
export {};
//# sourceMappingURL=Converter.d.ts.map