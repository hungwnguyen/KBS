// Hàm tính giá trị thích nghi (fitness)
function calculateFitness() {
  // Thực hiện tính toán giá trị thích nghi ở đây
}

// Hàm chọn (Selection)
function selection() {
  // Thực hiện quá trình chọn cá thể ở đây
}

// Hàm lai ghép (Crossover)
function crossover() {
  // Thực hiện quá trình lai ghép ở đây
}

// Hàm đột biến (Mutation)
function mutation() {
  // Thực hiện quá trình đột biến ở đây
}

// Hàm chạy giải thuật di truyền
function sga_passSimple(wordTypes) {
  // Khởi tạo quần thể bằng từ tất cả các công thức tiếng Anh ở thì quá khứ đơn.
  //
  for (let key in wordTypes) {
    console.log(`Key: ${key}, Value: ${wordTypes[key]}`);
  }
  animateText('Ok em eee');
//   while (true) {
//     Bước 1 tournement để chọn 2 thằng tốt nhất.
//     selection();
//     Bước 2 Lai ghép chéo order 1 để tạo ra nst con. 
//     crossover();
//     Bước 3 Đột biến hoán vị - phép trèn + phép đảo.
//     mutation();
//     Bước 4 Tính toán độ tích nghi. trả về điểm cho việc đúng công thức + đúng ngữ nghĩa.
//     calculateFitness();

//     (nếu tìm được nst có điểm bằng 100 thì trả về câu)
//     return ?;
//   }
}
