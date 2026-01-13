import { NamedEntity } from "./NamedEntity.js";
import { Rating } from "./Rating.js";
import { User } from "./User.js";
import { RatingSummary } from "./RatingSummary.js";

export class File extends NamedEntity {
  private isReported: boolean;
  private uploader: User;
  private ratings: Rating[];
  private ratingSummary?: RatingSummary;

  constructor(
    id: number,
    name: string,
    isReported: boolean,
    uploader: User,
    ratings: Rating[] = []
  ) {
    super(id, name);
    this.isReported = isReported;
    this.uploader = uploader;
    this.ratings = ratings;
  }

  public getUploader(): User {
    return this.uploader;
  }

  public getIsReported(): boolean {
    return this.isReported;
  }

  public setIsReported(isReported: boolean): void {
    this.isReported = isReported;
  }

  public getRatings(): Rating[] {
    return this.ratings;
  }

  public getRatingSummary(): RatingSummary | undefined {
    return this.ratingSummary;
  }

  public setRatingSummary(summary: RatingSummary): void {
    this.ratingSummary = summary;
  }
}
