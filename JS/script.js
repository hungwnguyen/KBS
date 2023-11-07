function searchWord() {
  var word = document.getElementById("wordInput").value;
  var resultDiv = document.getElementById("result");

  if (word.trim() === "") {
    resultDiv.innerHTML = "Vui lòng nhập từ tiếng Anh.";
    return;
  }

  var apiUrl = "https://dict.laban.vn/ajax/widget-search?type=1&query=" + encodeURIComponent(word) + "&vi=0";
  fetch(apiUrl)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    let inputString = data.enEnData.best.details;
    let startString = '<div class=\"bg-grey bold font-large m-top20\"><span>';
    let endString = '<';

    let outputString = extractSubstring(inputString, startString, endString);
    if (outputString.length > 1){
      if (outputString.substring(outputString.length - 2) == '">'){
        startString = '<div id=\"content_selectable\" class=\"content\" style=\"padding-bottom: 10px\">\n    \n    <div class=\"\">';
        outputString = extractSubstring(inputString, startString, endString);
      }
    }
    resultDiv.innerHTML = outputString;
  })
  .catch(function(error) {
    console.log(error);
    resultDiv.innerHTML = "Đã xảy ra lỗi khi gọi API.";
  });
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
    result += ' ' + substring;

    // Tăng vị trí bắt đầu tìm kiếm để tránh lặp vô hạn
    startIndex = endIndex;
  }

  return result;
}
  
  
  