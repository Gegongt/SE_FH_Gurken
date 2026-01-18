import { RatingSummary, RatingValue } from "../../vo/RatingSummary.js";
import { ServiceError } from "../error/ServiceError.js";

class RatingHttpService {
  getSummary(
    fileId: number,
    success: (s: RatingSummary) => void,
    error: (status: any) => void
  ): void {

    error(new ServiceError("Rating API not implemented yet"));
  }

  setUserRating(
    fileId: number,
    userId: number,
    value: RatingValue,
    success: (s: RatingSummary) => void,
    error: (status: any) => void
  ): void {
    error(new ServiceError("Rating API not implemented yet"));
  }
}

export const ratingHttpService = new RatingHttpService();
