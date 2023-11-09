const regex = /(wh\w+)|how/i;
const verbRegex = /wasn't|weren't|was|were/;

// Kiểm tra cụm danh từ: Determiner + Pre-modifier + Noun + Post-modifier
function findNounPhraseStructure(individual, wordTypes) {
  let determinerWord = '';
  let pre_modifierWord = '';
  let noun = '';
  let post_modifier = '';
  
  for (let i = 0; i < individual.length; i++) {
    const word = individual[i];
    const wordType = wordTypes[word];
    // Determiner gồm demonstrative, quantifier, article, possessive, numeral
    const determiner = ['demonstrative', 'article', 'possessive'];
    if (determiner.some(type => wordType.includes(type))) {
      determinerWord = word;
    }
    else if (
      wordType.includes('preposition') ||
      word.toLowerCase().endsWith('ing') 
    ){
      post_modifier = word;
    }
    else if (
      wordType.includes('adjective') && 
      !regex.test(word) && 
      !individual.includes('why') && 
      !individual.includes('when') &&
      !individual.includes('where') &&
      !wordType.includes('noun') 
    ) {
      pre_modifierWord = word;
    }
    else if (!wordType.includes('adjective') && !wordType.includes('adverb') &&
    (
      wordType.includes('pronoun') ||
      wordType.includes('noun')
    )){
      if (noun != ''){
        if (!wordTypes[noun].includes('pronoun') ){
          noun = word;
        }
      }
      else {
        noun = word;
      }
    }
    
  }
  return [determinerWord, pre_modifierWord, noun, post_modifier].filter(value => value !== '');
}

// Kiểm tra cấu trúc: WH-word + was/ were + S (+ not) +…?
function checkStructure_WH_word_WasWere(individual, wordTypes, subject) {
  let score = 0;
  if (!regex.test(individual[0])){
    score++;
  }
  if (!verbRegex.test(individual[1])){
    score++;
  }
  for (let i = 2; i < individual.length; i++) {
    const word = individual[i];
    if (i - 2 == subject.length){
      if (wordTypes[word].includes('noun') && !wordTypes[word].includes('adverb') && !wordTypes[word].includes('verb')){
        score++;
      }
      break;
    }
    if (word != subject[i - 2]){
      score++;
    }
  }
  return score;
}

// Hàm tính giá trị thích nghi (fitness)
function calculateFitness(individual, wordTypes, subject) {
  // Khởi tạo giá trị điểm thích nghi bằng 100
  let fitness = 100;
  // Chuyển câu thành chuỗi để dễ dàng kiểm tra
  const sentence = individual.join(" ");
  // Công thức với động từu tobe :
  if (verbRegex.test(sentence)) {
    if (regex.test(sentence)){
      sentenceEndChar = '?';
      fitness -= checkStructure_WH_word_WasWere(individual, wordTypes, subject);
    }
  }
  // Công thức với động từ thường:
  else if (/did|didn’t/.test(sentence)){
    if (regex.test(sentence)){
      sentenceEndChar = '?';
    }
  }
  return fitness;
}

// Hàm chọn (Selection)
function selection(population, fitnessScores) {
  const tournamentSize = 5; // Kích thước của giải đấu
  const selectedPopulation = [];

  while (selectedPopulation.length < 2) {
    // Chọn ngẫu nhiên tournamentSize cá thể từ quần thể
    const tournamentParticipants = [];
    for (let i = 0; i < tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * population.length);
      tournamentParticipants.push({
        index: randomIndex,
        fitness: fitnessScores[randomIndex],
      });
    }

    // Sắp xếp các cá thể trong giải đấu theo độ thích nghi giảm dần
    tournamentParticipants.sort((a, b) => b.fitness - a.fitness);

    // Chọn cá thể chiến thắng (có độ thích nghi cao nhất)
    const winnerIndex = tournamentParticipants[0].index;
    selectedPopulation.push(population[winnerIndex]);
  }

  return selectedPopulation;
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
  const subject = findNounPhraseStructure(words, wordTypes);
  console.log(subject);
  // Khởi tạo quần thể ban đầu bằng cách xáo trộn các từ
  let population = generateFirst16Permutations(words);
  console.log(wordTypes);
  // Bước 1: Tính giá trị thích nghi của từng cá thể
  const fitnessScores = population.map(individual => calculateFitness(individual, wordTypes, subject));
  console.log(fitnessScores);
  console.log(population);
  const selectedPopulation = selection(population, fitnessScores);
  console.log(selectedPopulation);
  // Tìm cá thể có điểm cao nhất
  const maxFitnessIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
  let  maxFitnessIndividual = population[maxFitnessIndex].join(" ");
  maxFitnessIndividual = maxFitnessIndividual.slice(0, 1).toUpperCase() + maxFitnessIndividual.slice(1) + sentenceEndChar;
  animateText(maxFitnessIndividual);
  // while (true) {
  //   // Bước 2: Chọn các cá thể tốt nhất bằng tournement
  //   const selectedPopulation = selection(population, fitnessScores);
  //   // Bước 3: Lai ghép chéo order 1 các cá thể để tạo ra các con
  //   const offspring = crossover(selectedPopulation);
  //   // Bước 4: Đột biến hoán vị - phép trèn + phép đảo.
  //   mutation(offspring);
  //   // Bước 5: Tính toán giá trị thích nghi của cá thể con
  //   const offspringFitnessScores = population.map(individual => calculateFitness(individual, wordTypes));
  //   // Kiểm tra điều kiện dừng (nếu tìm thấy cá thể con có điểm tối ưu)
  //   const maxFitness = Math.max(...offspringFitnessScores);
  //   if (maxFitness === 100) {
  //     // Dừng và biểu diễn kết quả (hoàn thiện theo nhu cầu)
  //     animateText("Kết quả: " + offspring[offspringFitnessScores.indexOf(maxFitness)]);
  //     return;
  //   }
  //   // Chọn cá thể tiếp theo dựa trên giá trị thích nghi
  //   const nextPopulation = selection(offspring, offspringFitnessScores);
  //   // Gán quần thể tiếp theo cho lần lặp tiếp theo
  //   population = nextPopulation;
  // }
}

  
