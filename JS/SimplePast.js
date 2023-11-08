// Kiểm tra cấu trúc: WH-word + was/ were + S (+ not) +…?
function checkStructure_WH_word_WasWere(individual, wordTypes) {
  const regex = /(wh\w+)|how/i;
  const verbRegex = /wasn't|weren't|was|were/;
  let score = 0;
  if (!regex.test(individual[0])){
    score++;
  }
  if (!verbRegex.test(individual[1])){
    score++;
  }
  if (!(
    wordTypes[individual[2]].includes('noun') ||
    wordTypes[individual[2]].includes('pronoun') ||
    wordTypes[individual[2]].includes('definite article')
  )){
    score++;
  }
  else if (wordTypes[individual[2]].includes('adverb') || wordTypes[individual[2]].includes('adjective') ){
    for (let i = 3; i < individual.length; i++) {
      const word = individual[i];
      const wordType = wordTypes[word];
      if ((wordType.includes('noun') || wordType.includes('pronoun')) && !wordType.includes('adverb')){
        score++;
      }
    }
  }
  if ((wordTypes[individual[3]].includes('definite article'))){
    score++;
  }
  if (wordTypes[individual[2]].includes('definite article') && !(
    wordTypes[individual[3]].includes('noun') ||
    wordTypes[individual[3]].includes('pronoun') 
  )){
    score++;
  }
  return score;
}

// Hàm tính giá trị thích nghi (fitness)
function calculateFitness(individual, wordTypes) {
  // Khởi tạo giá trị điểm thích nghi bằng 100
  let fitness = 100;
  // Chuyển câu thành chuỗi để dễ dàng kiểm tra
  const sentence = individual.join(" ");
  // Công thức với động từu tobe :
  if (/wasn't|weren't|was|were/.test(sentence)) {
    if (/(wh\w+)|how/i.test(sentence)){
      sentenceEndChar = '?';
      fitness -= checkStructure_WH_word_WasWere(individual, wordTypes);
    }
  }
  // Công thức với động từ thường:
  else if (/did|didn’t/.test(sentence)){
    if (/(wh\w+)|how/i.test(sentence)){
      sentenceEndChar = '?';
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
  console.log(population);
  console.log(sentenceEndChar);
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

  
