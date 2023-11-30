const regex = /(wh\w+)|how/i;
const verbRegex = /wasn't|weren't|was|were/;

function checkModifierRanking(startIndex, endIndex, individual){
  let count = 0;
  for (let i = startIndex; i < endIndex; i++){
    const word = individual[i];
    if (word in modifierRanking){
      if (modifierRanking[word] < modifierRanking[individual[startIndex - 1]]){
        return true;
      }
    }
    else if (wordTypes[word].includes('Noun.')){
      count++;
    }
  }
  return count !== 1;
}

function checkRule(individual, startIndex, endIndex, checkPronoun = true){
  let score = 0;
  for (let i = startIndex; i < endIndex; i++) {
    let word = individual[i];
    if (checkPronoun){
      if (word === 'i' && i > startIndex){
        score++;
      }
      // Nếu như trong câu có đại từ mà không ở vị trí NST thứ 3 của bộ gen thì tăng điểm bị trừ
      else if (wordTypes[word].includes('Pronoun.') && i > startIndex &&
        !wordTypes[word].includes('Conjunction.') && !wordTypes[word].includes('Adverb.') && !wordTypes[word].includes('Adjective.') && !wordTypes[word].includes('Verb.')){
        score++;
        //console.log(word);
      }
    }
    if (Object.hasOwnProperty.call(modifierRanking, word)){
      //Nếu rank của các từ bổ nghĩa trong gen bị xếp sai hoặc sau không có danh từ nào thì tăng điểm bị trừ
      if (checkModifierRanking(i + 1, individual.length, individual)){
        score++;
        //console.log(word);
      }
    }
    else{
      if//Nếu sau trạng từ là động từ thì tăng điểm bị trừ.
      (wordTypes[word].includes('Adverb.')){
        for (let j = i + 1; j < endIndex; j++){
          word = individual[j];
          if (wordTypes[word].includes('Verb.')){
            score++;
            //console.log(word);
            break;
          }
        }
      }
      word = individual[i];
      if //Nếu trước tính từ không có danh từ thì tăng điểm bị trừ.
      (wordTypes[word].includes('Adjective.')){
        let check = true;
        for (let j = startIndex; j < i; j++){
          word = individual[j];
          if (wordTypes[word].includes('Noun.') || wordTypes[word].includes('Pronoun.')){
            check = false;
            break;
          }
        }
        if (check){
          //console.log(word);
          score++;
        }
      }
      word = individual[i];
      if //Nếu trước tính từ không có danh từ thì tăng điểm bị trừ.
      (wordTypes[word].includes('Pronoun.')){
        word = individual[i - 1];
        if (wordTypes[word] === 'Adverb. Noun. ' || wordTypes[word] === 'Noun. ' || wordTypes[word].includes('Definite article. ')){
          score++;
        }
      }
    }
  }
  return score;
}

function checkStructure_WH_word_WasWere_question(individual) {
  let score = 0;
  // Kiểm tra NST đầu bộ gen có phải là WH-word không ?
  if (!regex.test(individual[0])){
    score++;
  }
  // Kiểm tra NST thứ 2 của bộ gen có phải là wasn't|weren't|was|were không ?
  if (!verbRegex.test(individual[1])){
    score++;
  }
  return score + checkRule(individual, 2, individual.length);
}

function checkStructure_Was_Were_question(individual){
  let score = 0;
  // Kiểm tra NST đầu bộ gen có phải là wasn't|weren't|was|were không ?
  if (!verbRegex.test(individual[0])){
    score++;
  }
  return score + checkRule(individual, 1, individual.length);
}

function checkStructure_Was_Were(individual, not){
  let score = 0;
  // Kiểm tra NST đầu bộ gen có thể làm chủ ngữ không ? 
  if (!wordTypes[individual[0]].includes('Pronoun.') && individual[0] !== 'i'){
    score++;
  }
  // Kiểm tra NST thứ 2 của bộ gen có phải là wasn't|weren't|was|were không ?
  if (!verbRegex.test(individual[1])){
    score++;
  }
  if (not && individual[2] !== 'not'){
    score++;
  }
  return score + checkRule(individual, not ? 3 : 2, individual.length, false);
}

function checkStructure_WH_word_did_question(individual, not){
  let score = 0;
  // Kiểm tra NST đầu bộ gen có phải là WH-word không ?
  if (!regex.test(individual[0])){
    score++;
  }
  // Kiểm tra NST thứ 2 của bộ gen có phải là /did|didn’t/ không ?
  if (!/did|didn’t/.test(individual[1])){
    score++;
  }
  if (wordTypes[individual[2]] !== 'Pronoun. ' && individual[2] !== 'i' && wordTypes[individual[2]] !== 'Noun. Pronoun. '){
    score++;
  }
  if (not){
    if (individual[3] !== 'not') score++;
    if (!wordTypes[individual[4]].includes('Verb.')){
      score++;
    }
  }
  else if (!wordTypes[individual[3]].includes('Verb.')){
    score++;
  }
  return score + checkRule(individual, not ? 4 : 3, individual.length, false);
}

function checkStructure_did_question(individual){
  let score = 0;
  // Kiểm tra NST đầu bộ gen có phải did không ? 
  if (individual[0] !== 'did'){
    score++;
  }
  if (wordTypes[individual[1]] !== 'Pronoun. ' && individual[1] !== 'i' && wordTypes[individual[1]] !== 'Noun. Pronoun. '){
    score++;
  }
  if (!wordTypes[individual[2]].includes('Verb.') ||
    (Object.hasOwnProperty.call(modifierRanking, individual[2]) && wordTypes[individual[2]].includes('Verb.'))){
    score++;
  }
  return score + checkRule(individual, 3, individual.length, false);
}

function checkStructure_negative(individual, not){
  let score = 0;
  // Kiểm tra NST đầu bộ gen có thể làm chủ ngữ không ? 
  if (wordTypes[individual[0]] !== 'Pronoun. ' && individual[0] !== 'i' && wordTypes[individual[0]] !== 'Noun. Pronoun. '){
    score++;
  }
  // Kiểm tra NST thứ 2 của bộ gen có phải là /did|didn’t/ không ?
  if (!/did|didn’t/.test(individual[1])){
    score++;
  }
  if (not){
    if (individual[2] !== 'not') score++;
    if (!wordTypes[individual[3]].includes('Verb.')){
      score++;
    }
  }
  else if (!wordTypes[individual[2]].includes('Verb.')){
    score++;
  }
  return score + checkRule(individual, not ? 3 : 2, individual.length, false);
}

function checkStructure_affirmative(individual){
  let score = 0;
  // Kiểm tra NST đầu bộ gen có thể làm chủ ngữ không ? 
  if (wordTypes[individual[0]] !== 'Pronoun. ' && individual[0] !== 'i' && wordTypes[individual[0]] !== 'Noun. Pronoun. '){
    score++;
  }
  if (!wordTypes[individual[1]].includes('past tense of')){
    score++;
  }
  return score + checkRule(individual, 2, individual.length, false);
}

// Hàm tính giá trị thích nghi (fitness)
function calculateFitness(individual) {
  // Khởi tạo giá trị điểm thích nghi bằng 100
  let fitness = 100;
  // Chuyển câu thành chuỗi để dễ dàng kiểm tra
  const sentence = individual.join(" ");
  let not = sentence.includes("not");
  // Công thức với động từu tobe :
  if (verbRegex.test(sentence) && !sentence.includes('washed')) {
    if (regex.test(sentence)){
      //Structure: WH-word + was/were + S (+ not) + ...?
      sentenceEndChar = '?';
      fitness -= checkStructure_WH_word_WasWere_question(individual);
    }
    else if (sentenceEndChar === '?'){
      fitness -= checkStructure_Was_Were_question(individual);
      //Structure: Was/Were + S + ...?
    }
    else{
      //Structure: S + was/were + (not) + ...
      fitness -= checkStructure_Was_Were(individual, not);
    }
  }
  // Công thức với động từ thường:
  else if (/did|didn’t/.test(sentence)){
    
    if (regex.test(sentence)){
      //Structure: WH-word + did + S + (not) + V (base form)?
      sentenceEndChar = '?';
      fitness -= checkStructure_WH_word_did_question(individual, not);
    }
    else if (sentenceEndChar === '?'){
      //Structure: Did + S + V (base form)?
      fitness -= checkStructure_did_question(individual);
    }
    else{
      //Structure: S + did not + V (base form)
      fitness -= checkStructure_negative(individual, not);
    }
  }
  else{
    //Structure: S + V2/ed + ...
    fitness -= checkStructure_affirmative(individual);
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
function sga_passSimple(words) {
  // Khởi tạo quần thể ban đầu bằng cách xáo trộn các từ
  //let population = generateRandomPermutations(words);
  let population = generateFirst16Permutations(words);
  //console.log(population);
  console.log(wordTypes);
  // Bước 1: Tính giá trị thích nghi của từng cá thể
  const fitnessScores = population.map(individual => calculateFitness(individual));
  const maxFitnessIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
  console.log(Math.max(...fitnessScores));
  // Thay thế từ "i" bằng "I" trong cá thể có độ thích nghi cao nhất
  population[maxFitnessIndex] = population[maxFitnessIndex].map(word => (word === 'i') ? 'I' : word);
  let  maxFitnessIndividual = population[maxFitnessIndex].join(" ");
  
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

  
