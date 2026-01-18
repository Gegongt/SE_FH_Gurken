import { Category } from "../../../vo/Category.js";
import { Exam } from "../../../vo/Exam.js";
import { MCQuestion } from "../../../vo/MCQuestion.js";
import { Question } from "../../../vo/Question.js";
import { Subcategory } from "../../../vo/Subcategory.js";
import { TrueFalseQuestion } from "../../../vo/TrueFalseQuestion.js";
import { User } from "../../../vo/User.js";
import { CategoryEntity } from "../CategoryEntity.js";
import { ExamEntity } from "../ExamEntity.js";
import { MCQuestionEntity } from "../MCQuestionEntity.js";
import { QuestionEntity } from "../QuestionEntity.js";
import { QuestionEntityType } from "../QuestionEntityType.js";
import { SubcategoryEntity } from "../SubcategoryEntity.js";
import { TrueFalseQuestionEntity } from "../TrueFalseQuestionEntity.js";
import { UserEntity } from "../UserEntity.js";
import { File } from "../../../vo/File.js";
import { FileEntity } from "../FileEntity.js";

class Converter
{
    convertCategoryEntityToCategory(categoryEntity:CategoryEntity):Category
    {
        return new Category(categoryEntity.id, categoryEntity.name);
    }

    convertCategoryToCategoryEntity(category:Category):CategoryEntity
    {
        return new CategoryEntity(category.getId(), category.getName());
    }

    convertExamEntityToExam(examEntity:ExamEntity):Exam
    {
        return new Exam(examEntity.id, examEntity.name, [], converter.convertUserEntityToUser(examEntity.creator));
    }

    convertExamToExamEntity(exam:Exam, subcategoryId:number = -1):ExamEntity
    {
        return new ExamEntity(exam.getId(), subcategoryId, exam.getName(), this.convertUserToUserEntity(exam.getCreator()));
    }

    convertQuestionEntityToQuestion(questionEntity:QuestionEntity):Question
    {
        if(questionEntity.questiontype === QuestionEntityType.MC_QUESTION)
        {
            let mcQuestionEntity = questionEntity as MCQuestionEntity;
            return new MCQuestion(mcQuestionEntity.id, mcQuestionEntity.question, mcQuestionEntity.correctanswers, mcQuestionEntity.wronganswers);
        }

        else
        {
            let trueFalseQuestionEntity = questionEntity as TrueFalseQuestionEntity;
            return new TrueFalseQuestion(trueFalseQuestionEntity.id, trueFalseQuestionEntity.question, trueFalseQuestionEntity.istrue);
        }
    }

    convertQuestionToQuestionEntity(question:Question, examId:number = -1):QuestionEntity
    {
        if(question instanceof MCQuestion)
        {
            let mcQuestion = question as MCQuestion;
            return new MCQuestionEntity(mcQuestion.getId(), examId, mcQuestion.getQuestion(),
                                        QuestionEntityType.MC_QUESTION, mcQuestion.getCorrectAnswers(),
                                        mcQuestion.getWrongAnswers());
        }

        else
        {
            let trueFalseQuestion = question as TrueFalseQuestion;
            return new TrueFalseQuestionEntity(trueFalseQuestion.getId(), examId, trueFalseQuestion.getQuestion(),
                                               QuestionEntityType.TRUE_FALSE_QUESTION, trueFalseQuestion.getIsTrue());
        }
    }

    convertSubcategoryEntityToSubcategory(subcategorieEntity:SubcategoryEntity):Subcategory
    {
        return new Subcategory(subcategorieEntity.id, subcategorieEntity.name, [], []);
    }

    convertSubcategoryToSubcategoryEntity(subcategory:Subcategory, categoryId:number = -1):SubcategoryEntity
    {
        return new SubcategoryEntity(subcategory.getId(), categoryId, subcategory.getName());
    }

    convertUserEntityToUser(userEntity:UserEntity):User
    {
        return new User(userEntity.id, userEntity.isadmin, userEntity.email, userEntity.name, userEntity.isblocked, userEntity.profilepicturename, []);
    }

    convertUserToUserEntity(user:User):UserEntity
    {
        return new UserEntity(user.getId(), user.getIsAdmin(), user.getEmail(), user.getName(), user.getIsBlocked(), user.getProfilePictureName());
    }

    convertFileEntityToFile(fileEntity: any): File {
    let uploaderUser: User;

    if (fileEntity.uploader) {
        uploaderUser = this.convertUserEntityToUser(fileEntity.uploader);
    } else {
        const uid = fileEntity.uploaderid ?? fileEntity.uploaderId ?? null;

        uploaderUser = new User(
        uid ?? "unknown",
        false,
        "",
        "unknown",
        false,
        null,
        []
        );
    }

    return new File(
        fileEntity.id,
        fileEntity.name,
        fileEntity.isreported ?? fileEntity.isReported ?? false,
        uploaderUser
    );
    }


    convertFileToFileEntity(file:File, subcategoryId:number = -1):FileEntity
    {
        return new FileEntity(file.getId(), subcategoryId, file.getName(), this.convertUserToUserEntity(file.getUploader()),  file.getIsReported());
    }
}

export let converter = new Converter();
