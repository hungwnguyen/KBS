var sentenceEndChar = '.';

// Xác định dựa trên cấu trúc cụm danh từ: Determiner + Pre-modifier + Noun + Post-modifier
var modifierRanking = {};
 // Đối tượng dữ liệu để lưu loại từ
 let wordTypes = {};
// Đường dẫn tới file JSON
const jsonpath = 'Data/ModifierRanking.json';
    fetch(jsonpath)
    .then(response => response.json())
    .then(data => {
      // Chuyển đổi tất cả các khóa về chữ thường
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
              const lowerCaseKey = key.toLowerCase();
              modifierRanking[lowerCaseKey] = data[key];
          }
        }
        console.log(modifierRanking);
    })
    .catch(error => console.error('Error:', error));

async function constructSentenceFromWords() {
  sentenceEndChar = '.';
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
  wordTypes = {};
  let isSimplePastTense = false, isFeatureSimple = false;
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
    sga_passSimple(words);
  }
  else if (isFeatureSimple){
    sga_featureSimple(words);
  }
  else{
    animateText("Vui lòng nhập lại");
  }
}

async function searchWord(word) {
  if (word.trim() === "") {
    return '';
  }
  if (verbRegex.test(word.toLowerCase())){
    return 'past tense of be';
  }
  if (/did|didn’t/.test(word.toLowerCase())){
    return 'past tense of do';
  }
  if (word === 'email'){
    return 'Noun. ';
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
    console.log(word);
    console.log(error);
    return '';
  }
}

function calculateFactorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * calculateFactorial(n - 1);
  }
}

function generateRandomPermutations(arr, count = 23) {
  const result = [];
  const factorialN = calculateFactorial(arr.length);
  while (result.length < count && result.length !== factorialN) {
    const shuffledArr = shuffleArray(arr.slice()); // Tạo một bản sao và trộn mảng
    if (!result.some(existingPermutation => areArraysEqual(existingPermutation, shuffledArr))) {
      // Kiểm tra xem hoán vị đã tồn tại chưa
      result.push(shuffledArr);
    }
  }
  return result;
}

function generateFirst16Permutations(arr) {
  const result = [];
  let count = 0; // Biến đếm số lượng hoán vị đã được sinh ra
  function permute(arr, current = []) {
    // if (count >= 1) {
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

// Hàm để trộn mảng
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap giữa hai phần tử
  }
  return arr;
}

// Hàm để so sánh hai mảng
function areArraysEqual(arr1, arr2) {
  return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
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
    let substring = inputString.substring(startIndex, endIndex);
    substring = substring.slice(0, 1).toUpperCase() + substring.slice(1) + '.';
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
  text = text.slice(0, 1).toUpperCase() + text.slice(1) + sentenceEndChar;
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
 