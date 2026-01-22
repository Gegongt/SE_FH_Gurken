import { Category } from "../../../vo/Category.js";
import { Exam } from "../../../vo/Exam.js";
import { MCQuestion } from "../../../vo/MCQuestion.js";
import { Subcategory } from "../../../vo/Subcategory.js";
import { TrueFalseQuestion } from "../../../vo/TrueFalseQuestion.js";
import { User } from "../../../vo/User.js";
import { CategoryEntity } from "../CategoryEntity.js";
import { ExamEntity } from "../ExamEntity.js";
import { MCQuestionEntity } from "../MCQuestionEntity.js";
import { QuestionEntityType } from "../QuestionEntityType.js";
import { SubcategoryEntity } from "../SubcategoryEntity.js";
import { TrueFalseQuestionEntity } from "../TrueFalseQuestionEntity.js";
import { UserEntity } from "../UserEntity.js";
import { File } from "../../../vo/File.js";
import { FileEntity } from "../FileEntity.js";
import { ChatMessageEntity } from "../ChatMessageEntity.js";
import { ChatMessage } from "../../../vo/ChatMessage.js";
class Converter {
    convertCategoryEntityToCategory(categoryEntity) {
        return new Category(categoryEntity.id, categoryEntity.name);
    }
    convertCategoryToCategoryEntity(category) {
        return new CategoryEntity(category.getId(), category.getName());
    }
    convertExamEntityToExam(examEntity) {
        return new Exam(examEntity.id, examEntity.name, [], converter.convertUserEntityToUser(examEntity.creator));
    }
    convertExamToExamEntity(exam, subcategoryId = -1) {
        return new ExamEntity(exam.getId(), subcategoryId, exam.getName(), this.convertUserToUserEntity(exam.getCreator()));
    }
    convertQuestionEntityToQuestion(questionEntity) {
        if (questionEntity.questiontype === QuestionEntityType.MC_QUESTION) {
            let mcQuestionEntity = questionEntity;
            return new MCQuestion(mcQuestionEntity.id, mcQuestionEntity.question, mcQuestionEntity.correctanswers, mcQuestionEntity.wronganswers);
        }
        else {
            let trueFalseQuestionEntity = questionEntity;
            return new TrueFalseQuestion(trueFalseQuestionEntity.id, trueFalseQuestionEntity.question, trueFalseQuestionEntity.istrue);
        }
    }
    convertQuestionToQuestionEntity(question, examId = -1) {
        if (question instanceof MCQuestion) {
            let mcQuestion = question;
            return new MCQuestionEntity(mcQuestion.getId(), examId, mcQuestion.getQuestion(), QuestionEntityType.MC_QUESTION, mcQuestion.getCorrectAnswers(), mcQuestion.getWrongAnswers());
        }
        else {
            let trueFalseQuestion = question;
            return new TrueFalseQuestionEntity(trueFalseQuestion.getId(), examId, trueFalseQuestion.getQuestion(), QuestionEntityType.TRUE_FALSE_QUESTION, trueFalseQuestion.getIsTrue());
        }
    }
    convertSubcategoryEntityToSubcategory(subcategorieEntity) {
        return new Subcategory(subcategorieEntity.id, subcategorieEntity.name, [], []);
    }
    convertSubcategoryToSubcategoryEntity(subcategory, categoryId = -1) {
        return new SubcategoryEntity(subcategory.getId(), categoryId, subcategory.getName());
    }
    convertUserEntityToUser(userEntity) {
        return new User(userEntity.id, userEntity.isadmin, userEntity.email, userEntity.name, userEntity.isblocked, userEntity.profilepicturename, []);
    }
    convertUserToUserEntity(user) {
        return new UserEntity(user.getId(), user.getIsAdmin(), user.getEmail(), user.getName(), user.getIsBlocked(), user.getProfilePictureName());
    }
    convertFileEntityToFile(fileEntity) {
        let uploaderUser;
        if (fileEntity.uploader) {
            uploaderUser = this.convertUserEntityToUser(fileEntity.uploader);
        }
        else {
            const uid = fileEntity.uploaderid ?? fileEntity.uploaderId ?? null;
            uploaderUser = new User(uid ?? "unknown", false, "", "unknown", false, null, []);
        }
        return new File(fileEntity.id, fileEntity.name, fileEntity.isreported ?? fileEntity.isReported ?? false, uploaderUser);
    }
    convertFileToFileEntity(file, subcategoryId = -1) {
        return new FileEntity(file.getId(), subcategoryId, file.getName(), this.convertUserToUserEntity(file.getUploader()), file.getIsReported());
    }
    convertChatMessageEntityToChatMessage(chatMessageEntity) {
        return new ChatMessage(chatMessageEntity.id, chatMessageEntity.userid, chatMessageEntity.subcategoryid, chatMessageEntity.name, chatMessageEntity.message, chatMessageEntity.created_at);
    }
    convertChatMessageToChatMessageEntity(chatMessage) {
        return new ChatMessageEntity(chatMessage.getId(), chatMessage.getUserId(), chatMessage.getSubcategoryId(), chatMessage.getName(), chatMessage.getMessage(), chatMessage.getCreatedAt());
    }
}
export let converter = new Converter();
//# sourceMappingURL=Converter.js.map