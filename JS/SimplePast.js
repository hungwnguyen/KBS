const regex = /(wh\w+)|how/i;
const verbRegex = /wasn't|weren't|was|were/;
let population = [];

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
      // Nếu như trong câu có đại từ mà không ở vị trí chủ ngữ của NST thì tăng điểm bị trừ
      else if (wordTypes[word].includes('Pronoun.') && i > startIndex &&
        !wordTypes[word].includes('Conjunction.') && !wordTypes[word].includes('Adverb.') && !wordTypes[word].includes('Adjective.') && !wordTypes[word].includes('Verb.')){
        score++;
        //console.log(word);
      }
    }
    if ((word === 'he' || word === 'she' || word === 'we' || word === 'they')
      && !checkPronoun){
      score++;
      //console.log(word);
    }
    if (Object.hasOwnProperty.call(modifierRanking, word)){
      //Nếu rank của các từ bổ nghĩa trong NST bị xếp sai hoặc sau không có danh từ nào thì tăng điểm bị trừ
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
      if //Nếu trước đại từ là danh từ hoặc trạng từ hoặc mạo từ xác định thì tăng điểm bị trừ.
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
  if (!regex.test(individual[0])){
    score++;
  }
  if (!verbRegex.test(individual[1])){
    score++;
  }
  return score + checkRule(individual, 2, individual.length);
}

function checkStructure_Was_Were_question(individual){
  let score = 0;
  if (!verbRegex.test(individual[0])){
    score++;
  }
  return score + checkRule(individual, 1, individual.length);
}

function checkStructure_Was_Were(individual, not){
  let score = 0;
  if (!wordTypes[individual[0]].includes('Pronoun.') && individual[0] !== 'i'){
    score++;
  }
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
  if (!regex.test(individual[0])){
    score++;
  }
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
  if (wordTypes[individual[0]] !== 'Pronoun. ' && individual[0] !== 'i' && wordTypes[individual[0]] !== 'Noun. Pronoun. '){
    score++;
  }
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
      //Structure: WH-word + was/were + S + ...?
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
      //Structure: WH-word + did + S + V (base form)?
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
function tournamentSelection(populationFitness) {
  const selectedPopulation = [];
  const tournamentSize = 8; // Kích thước của mỗi giải đấu
  const randomIndexDic = {};
  while (selectedPopulation.length < 2) {
    // Bước 2.1: Randomly choose individuals for the tournament
    const tournamentParticipants = [];
    for (let i = 0; i < tournamentSize; i++) {
      let randomIndex = Math.floor(Math.random() * population.length);
      while(Object.hasOwnProperty.call(randomIndexDic, randomIndex) && Object.keys(randomIndexDic).length !== population.length){
        randomIndex = Math.floor(Math.random() * population.length);
      }
      randomIndexDic[randomIndex] = true;
      tournamentParticipants.push({
        index: randomIndex,
        fitness: populationFitness[randomIndex],
      });
    }

    // Bước 2.2: Chọn cá thể có độ thích nghi tốt nhất từ giải đấu
    const winner = tournamentParticipants.reduce((prev, current) =>
      current.fitness > prev.fitness ? current : prev
    );

    // Bước 2.3: Thêm người chiến thắng vào quần thể đã chọn
    selectedPopulation.push(population[winner.index]);

    // Loại bỏ cá thể có độ thích nghi thấp nhất khỏi population
    const minFitnessIndex = populationFitness.indexOf(Math.min(...populationFitness));
    population.splice(minFitnessIndex, 1);
    populationFitness.splice(minFitnessIndex, 1);
  }

  return selectedPopulation;
}

// Hàm lai ghép (Crossover)
function crossover(parent1, parent2) {
  const offspring1 = Array(parent1.length).fill(undefined);
  const offspring2 = Array(parent1.length).fill(undefined);
  const length = parent1.length;

  let startIndex = Math.floor(Math.random() * 100000000000) % length;
  let endIndex = Math.floor(Math.random() * 100000000000) % length;
  while(startIndex >= endIndex){
    startIndex = Math.floor(Math.random() * 100000000000) % length;
    endIndex = Math.floor(Math.random() * 100000000000) % length;
  }
  // Tiến hành lai ghép
  let dic1 = {}, dic2 = {};
  for (let i = startIndex; i < endIndex; i++) {
    offspring1[i] = parent1[i];
    offspring2[i] = parent2[i];
    dic1[parent1[i]] = true;
    dic2[parent2[i]] = true;
  }
  let index1 = endIndex, index2 = endIndex;
  for (let i = endIndex; i < length; i++) {
    if (!Object.hasOwnProperty.call(dic1, parent2[i])) {
      offspring1[index1] = parent2[i];
      index1 = index1 == length - 1 ? 0 : index1 + 1;
    }
    if (!Object.hasOwnProperty.call(dic2, parent1[i])) {
      offspring2[index2] = parent1[i];
      index2 = index2 == length - 1 ? 0 : index2 + 1;
    }
  }
  for (let i = 0; i < endIndex; i++) {
    if (!Object.hasOwnProperty.call(dic1, parent2[i])) {
      offspring1[index1] = parent2[i];
      index1 = index1 == length - 1 ? 0 : index1 + 1;
    }
    if (!Object.hasOwnProperty.call(dic2, parent1[i])) {
      offspring2[index2] = parent1[i];
      index2 = index2 == length - 1 ? 0 : index2 + 1;
    }
  }
  return [offspring1, offspring2];
}

// Hàm đột biến (Mutation)
function mutation(offspring) {
  for (let i = 0; i < offspring.length; i++) {
    // Chọn ngẫu nhiên hai vị trí trong cá thể con
    const mutationPoints = Array.from({ length: 2 }, () => Math.floor(Math.random() * offspring[i].length));
    // Hoán đổi giá trị tại hai vị trí đã chọn
    const temp = offspring[i][mutationPoints[0]];
    offspring[i][mutationPoints[0]] = offspring[i][mutationPoints[1]];
    offspring[i][mutationPoints[1]] = temp;
    population.push(offspring[i]);
  }
}

// Hàm chạy giải thuật di truyền
function sga_passSimple(words) {
  // Khởi tạo quần thể ban đầu bằng cách xáo trộn các từ
  population = generateRandomPermutations(words);
  console.log(wordTypes);
  // Bước 1: Tính giá trị thích nghi của từng cá thể
  let fitnessScores = population.map(individual => calculateFitness(individual));
  while (Math.max(...fitnessScores) != 100) {
    // Bước 2: Lựa chọn cá thể bằng hàm Tournament selection thực hiện lựa chọn thay thế đảm bảo kích thước quần thể luôn bằng 16
    const selectedPopulation = tournamentSelection(fitnessScores);
    // Bước 3: Lai ghép chéo order 1 các cá thể để tạo ra các con
    const offspring = crossover(selectedPopulation[0], selectedPopulation[1]);
    // Bước 4: Đột biến hoán vị - phép đảo.
    mutation(offspring);
    // Bước 5: Tính toán giá trị thích nghi của cá thể con
    fitnessScores = population.map(individual => calculateFitness(individual));
  }
  const maxFitnessIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
  // Thay thế từ "i" bằng "I" trong cá thể có độ thích nghi cao nhất
  population[maxFitnessIndex] = population[maxFitnessIndex].map(word => (word === 'i') ? 'I' : word);
  let  maxFitnessIndividual = population[maxFitnessIndex].join(" ");
  animateText(maxFitnessIndividual);
}

  
