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
      console.log(inputString);
      let startString = 'class=\"content\" style=\"padding-bottom: 10px\">\n    \n    <div class=\"bg-grey bold font-large m-top20\"><span>';
      let endString = '</span>';
  
      let startIndex = inputString.indexOf(startString) + startString.length;
      let endIndex = inputString.indexOf(endString, startIndex);
  
      let outputString = inputString.substring(startIndex, endIndex);
      resultDiv.innerHTML = outputString;
    })
    .catch(function(error) {
      console.log(error);
      resultDiv.innerHTML = "Đã xảy ra lỗi khi gọi API.";
    });
  }