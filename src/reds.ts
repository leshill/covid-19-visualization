function redColor(index: number) {
  var base = 225;
  var rate = 15;

  if (index >= 5) {
    rate = 10;
    base = 150;
    index = index - 5;
  }

  const other = base - index * rate;

  return `rgb(255,${other},${other})`
}

const redValues = [...Array(20)].map((_, index) => redColor(index));

function reds(n: number) {
  const index = Math.floor(Math.log(n));

  if (index < 0) {
    return redValues[0];
  } else if (index >= redValues.length) {
    return redValues[redValues.length - 1];
  } else {
    return redValues[index];
  }
}

export default reds;
