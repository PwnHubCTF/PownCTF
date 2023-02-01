let min = 1500;
let max = 2600;
let decay = 10;

function generateFor(max) {
  let result = [];
  for (let i = 0; i < max; i++) {
    result.push(pointsForSolve(i));
  }
  return result;
}

function pointsForSolve(solve) {
  let points = Math.round(
    ((min - max) / Math.log(decay)) * Math.log(solve) + max
  );
  points = points > max ? max : points;
  return points > min ? points : min;
}

console.table(generateFor(decay + 10));
