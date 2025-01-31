export function randomNumber(max: number): number {
  let generatedNum = Math.floor(Math.random() * max);
  return generatedNum === 0 ? 1 : generatedNum;
}
