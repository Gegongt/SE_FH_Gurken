import { Category } from "../../../vo/Category.js";
import { Exam } from "../../../vo/Exam.js";
import { Subcategory } from "../../../vo/Subcategory.js";
import { User } from "../../../vo/User.js";
import { CategoryEntity } from "../CategoryEntity.js";
import { ExamEntity } from "../ExamEntity.js";
import { SubcategoryEntity } from "../SubcategoryEntity.js";
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
        return new User(userEntity.id, userEntity.isadmin, userEntity.email, UserEntity.name, userEntity.isblocked, userEntity.profilepicturename, []);
    }

    convertUserToUserEntity(user:User):UserEntity
    {
        return new UserEntity(user.getId(), user.getIsAdmin(), user.getEmail(), user.getName(), user.getIsBlocked(), user.getProfilePictureName());
    }

    convertFileEntityToFile(fileEntity:FileEntity):File
    {
        return new File(fileEntity.id, fileEntity.name, fileEntity.isreported, this.convertUserEntityToUser(fileEntity.uploader));
    }

    convertFileToFileEntity(file:File, subcategoryId:number = -1):FileEntity
    {
        return new FileEntity(file.getId(), subcategoryId, file.getName(), this.convertUserToUserEntity(file.getUploader()),  file.getIsReported());
    }
}

export let converter = new Converter();
