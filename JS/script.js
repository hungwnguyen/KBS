var sentenceEndChar = '.';
const demonstrativeWords = ['this', 'that', 'these', 'those'];
const possessiveWords = ['my', 'your', 'his', 'her', 'our', 'their', 'its'];
async function constructSentenceFromWords() {
  var inputSentence = '* ' + document.getElementById("sentenceInput").value + ' *';
  // Kiểm tra xem inputSentence kết thúc bằng "." hoặc "?"
  if (/[.?]/.test(inputSentence)) {
    // Nếu có, cắt bỏ ký tự này khỏi inputSentence và gán cho sentenceEndChar
    sentenceEndChar = /[.?]/.exec(inputSentence)[0];
    // Loại bỏ tất cả các ký tự "?" hoặc "." khỏi inputSentence
    inputSentence = inputSentence.replace(/[.?]/g, '');
  }
  inputSentence = inputSentence.toLowerCase();
  let words = inputSentence.split(/\s+/g);
  words.pop();
  words.shift();
  if (words.length < 2 || words.length > 6) {
    animateText("Vui lòng nhập lại");
    return;
  }
  let wordTypes = {}; // Đối tượng dữ liệu để lưu loại từ
  let isSimplePastTense = false, isPresentSimple = false, isFeatureSimple = false;
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
    else if (element == 'will' || element == "won't" || element == "'ll"){
      isFeatureSimple = true;
    }
  }
  if (isSimplePastTense){
    sga_passSimple(wordTypes, words);
  }
  else if (isFeatureSimple){
    sga_featureSimple(wordTypes, words);
  }
  else{
    sga_presentSimple(wordTypes, words);
  }
}

async function searchWord(word) {
  if (word.trim() === "") {
    return '';
  }
  if (word.toLowerCase()  === 'were'){
    return 'past tense of be';
  }
  if (possessiveWords.includes(word.toLowerCase())){
    return 'possessive';
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
    if (demonstrativeWords.includes(word.toLowerCase())) {
      return outputString + ' demonstrative';
    }
    return outputString;
  } catch (error) {
    console.log(error);
    return '';
  }
}

// Hàm sinh tối đa 16 hoán vị đầu tiên
function generateFirst16Permutations(arr) {
  const result = [];
  let count = 0; // Biến đếm số lượng hoán vị đã được sinh ra
  function permute(arr, current = []) {
    // if (count >= 16) {
    //   return result; // Dừng nếu đã có đủ 16 hoán vị
    // }
    if (arr.length === 0) {
      result.push([...current]);
      count++; // Tăng biến đếm khi một hoán vị mới được thêm vào kết quả
    } else {
      for (let i = 0; i < arr.length; i++) {
        const rest = arr.slice(0, i).concat(arr.slice(i + 1));
        current.push(arr[i]);
        permute(rest, current);
        current.pop();
      }
    }
  }
  permute(arr);
  return result;
}

function extractSubstring(inputString, startString, endString) {
  let result = '';
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
 