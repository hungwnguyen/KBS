async function constructSentenceFromWords() {
  var inputSentence = document.getElementById("sentenceInput").value + ' *';
  let words = inputSentence.split(/\s+/g);
  words.pop();
  if (words.length < 2 || words.length > 6) {
    animateText("Vui lòng nhập lại");
    return;
  }
  let wordTypes = {}; // Đối tượng dữ liệu để lưu loại từ
  let isSimplePastTense = false;
  for (let i = 0; i < words.length; i++) {
    const element = words[i];
    const test = await searchWord(element);
    if (test == '') {
      animateText("Vui lòng nhập đúng từ tiếng Anh.");
      return;
    }
    // Lưu loại từ vào đối tượng dữ liệu
    wordTypes[element] = test;
    // Nếu tìm thấy 1 động từ được chia ở dạng quá khứ đơn thì gán = true;
    if (test.substring(0, 13) == 'past tense of') {
      isSimplePastTense = true;
    }
  }
  if (isSimplePastTense){
    sga_passSimple(wordTypes);
  }
}

async function searchWord(word) {
  if (word.trim() === "") {
    return '';
  }
  try {
    const apiUrl = "https://dict.laban.vn/ajax/widget-search?type=1&query=" + encodeURIComponent(word) + "&vi=0";
    const response = await fetch(apiUrl);
    const data = await response.json();
    let inputString = data.enEnData.best.details;
    let startString = '<div class=\"bg-grey bold font-large m-top20\"><span>';
    let endString = '<';
    let outputString = extractSubstring(inputString, startString, endString);
    if (outputString == '') {
      startString = '<div id=\"content_selectable\" class=\"content\" style=\"padding-bottom: 10px\">\n    \n    <div class=\"\">';
      outputString = extractSubstring(inputString, startString, endString);
    }
    return outputString;
  } catch (error) {
    console.log(error);
    return '';
  }
}

function extractSubstring(inputString, startString, endString) {
  let result = '';
  // Nếu như chứa từ khóa people thì thêm loại people vào.
  if (inputString.includes('people')) {
    result = 'people ';
  }
  let startIndex = 0;
  while (true) {
    startIndex = inputString.indexOf(startString, startIndex);
    if (startIndex === -1) {
      break;
    }
    startIndex += startString.length; // Bắt đầu từ sau startString
    const endIndex = inputString.indexOf(endString, startIndex);
    if (endIndex === -1) {
      break;
    }
    const substring = inputString.substring(startIndex, endIndex);
    result = substring + ' ' + result;
    // Tăng vị trí bắt đầu tìm kiếm để tránh lặp vô hạn
    startIndex = endIndex;
  }

  return result;
}

function checkEnter(event) {
  if (event.key === "Enter") {
    constructSentenceFromWords();
  }
}

function animateText(text, minTimeout = 0, maxTimeout = 1, underscoreTimeout = 66) {
  let currentIndex = 0;
  const element = document.getElementById("result"); // ID của phần tử hiển thị kết quả
  element.innerHTML = '';
  const typeCharacter = () => {
    if (currentIndex < text.length) {
      element.innerHTML = element.innerHTML.slice(0, -1) + text[currentIndex++] + '<span class="long-pipe">|</span>';
      setTimeout(() => {
        if (currentIndex < text.length) {
          element.textContent = element.textContent.slice(0, -1) + '|';
        }
        const timeout = Math.floor(Math.random() * (maxTimeout - minTimeout + 1)) + minTimeout;
        setTimeout(typeCharacter, timeout);
      }, underscoreTimeout);
    } else {
      element.textContent = element.textContent.slice(0, -1);
    }
  };
  typeCharacter();
}
 