// Hàm tính giá trị thích nghi (fitness)
function calculateFitness(individual, wordTypes) {
  // Khởi tạo giá trị điểm thích nghi bằng 100
  let fitness = 100;

  // Kiểm tra cấu trúc câu
  for (let i = 0; i < individual.length; i++) {
    const word = individual[i];
    const wordType = wordTypes[word];

    if(wordType.includes('person') || wordType.includes('noun')) {
      fitness -= 1;
    }
  }

  return fitness;
}

// Hàm chọn (Selection)
function selection(population) {
  // Thực hiện quá trình chọn cá thể ở đây (ví dụ: sử dụng giải thuật tournament)
}

// Hàm lai ghép (Crossover)
function crossover(parent1, parent2) {
  // Thực hiện quá trình lai ghép (ví dụ: sử dụng phương pháp order crossover)
}

// Hàm đột biến (Mutation)
function mutation(individual) {
  // Thực hiện quá trình đột biến (ví dụ: hoán vị hoặc đảo vị trí một số từ)
}

// Hàm chạy giải thuật di truyền
function sga_passSimple(wordTypes, words) {
  // Khởi tạo quần thể ban đầu bằng cách xáo trộn các từ
  let population = generateFirst20Permutations(words);
  console.log(wordTypes);
  const fitnessScores = population.map(individual => calculateFitness(individual, wordTypes));
  console.log(fitnessScores);
  //const selectedPopulation = selection(population, fitnessScores);
  //console.log(selectedPopulation);
/*
  while (true) {
    // Bước 1: Tính giá trị thích nghi của từng cá thể
    const fitnessScores = population.map(individual => calculateFitness(individual, wordTypes));
    
    // Bước 2: Chọn các cá thể tốt nhất bằng tournement
    const selectedPopulation = selection(population, fitnessScores);
    
    // Bước 3: Lai ghép chéo order 1 các cá thể để tạo ra các con
    const offspring = crossover(selectedPopulation);
    
    // Bước 4: Đột biến hoán vị - phép trèn + phép đảo.
    mutation(offspring);
    
    // Bước 5: Tính toán giá trị thích nghi của cá thể con
    const offspringFitnessScores = population.map(individual => calculateFitness(individual, wordTypes));
    
    // Kiểm tra điều kiện dừng (nếu tìm thấy cá thể con có điểm tối ưu)
    const maxFitness = Math.max(...offspringFitnessScores);
    if (maxFitness === 100) {
      // Dừng và biểu diễn kết quả (hoàn thiện theo nhu cầu)
      animateText("Kết quả: " + offspring[offspringFitnessScores.indexOf(maxFitness)]);
      return;
    }
    
    // Chọn cá thể tiếp theo dựa trên giá trị thích nghi
    const nextPopulation = selection(offspring, offspringFitnessScores);
    
    // Gán quần thể tiếp theo cho lần lặp tiếp theo
    population = nextPopulation;
  }
*/
}

  
