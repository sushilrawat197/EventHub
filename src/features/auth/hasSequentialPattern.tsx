 function hasSequentialPattern(str: string, length: number = 5): boolean {
  const lowerStr = str.toLowerCase();

  for (let i = 0; i <= lowerStr.length - length; i++) {
    let isAlphaSeq = true;
    let isNumSeq = true;

    for (let j = 1; j < length; j++) {
      const prevChar = lowerStr.charCodeAt(i + j - 1);
      const currChar = lowerStr.charCodeAt(i + j);

      // Check alphabet sequence like abcde
      if (currChar !== prevChar + 1) {
        isAlphaSeq = false;
      }

      // Check numeric sequence like 12345
      if (!isNaN(Number(lowerStr[i + j - 1])) && !isNaN(Number(lowerStr[i + j]))) {
        if (Number(lowerStr[i + j]) !== Number(lowerStr[i + j - 1]) + 1) {
          isNumSeq = false;
        }
      } else {
        isNumSeq = false;
      }
    }

    if (isAlphaSeq || isNumSeq) {
      return true; // Invalid password
    }
  }

  return false;
}


export default hasSequentialPattern;