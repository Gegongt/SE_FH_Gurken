export function calcScore(good, medium, bad) {
    const total = good + medium + bad;
    if (total === 0)
        return 0;
    const sum = 2 * good + 1 * medium + 0 * bad;
    return sum / total;
}
export function scoreToOverall(score) {
    if (score < 0.66)
        return "BAD";
    if (score < 1.33)
        return "MEDIUM";
    return "GOOD";
}
export function buildSummary(good, medium, bad) {
    const score = calcScore(good, medium, bad);
    return {
        good,
        medium,
        bad,
        score: Number(score.toFixed(2)),
        overall: scoreToOverall(score)
    };
}
//# sourceMappingURL=RatingUtil.js.map