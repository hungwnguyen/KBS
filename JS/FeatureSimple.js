const regex_feature = /(wh\w+)|how/i;
const verbregex_feature_ = /will|won't/;
let population_feature = [];

function checkStructure_WH_word_Will_question(individual, not){
    let score = 0;
    if (!regex_feature.test(individual[0])){
      score++;
    }
    if (!/will|won’t/.test(individual[1])){
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

function checkStructure_Will_question(individual){
    let score = 0;
    if (individual[0] !== 'will'){
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

function checkStructure_negative_feature(individual, not){
    let score = 0;
    if (wordTypes[individual[0]] !== 'Pronoun. ' && individual[0] !== 'i' && wordTypes[individual[0]] !== 'Noun. Pronoun. '){
      score++;
    }
    if (!/will|won't/.test(individual[1])){
      score++;
    }
    if (individual.length == 3){
      if (individual[0] == 'it' && (wordTypes[individual[2]] === 'Pronoun. ' || individual[2] === 'i' || wordTypes[individual[2]] === 'Noun. Pronoun. ')){
        score++;
      }
      return score;
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
  
function checkStructure_affirmative_feature(individual){
  let score = 0;
  if (wordTypes[individual[0]] !== 'Pronoun. ' && individual[0] !== 'i' && wordTypes[individual[0]] !== 'Noun. Pronoun. '){
    score++;
  }
  if (!/will/.test(individual[1])){
    score++;
  }
  if (!wordTypes[individual[2]].includes('Verb.')){
    score++;
  }
  return score + checkRule(individual, 2, individual.length, false);
}

// Hàm tính giá trị thích nghi (fitness)
function calculateFitness_feature(individual) {
  // Khởi tạo giá trị điểm thích nghi bằng 100
  let fitness = 100;
  // Chuyển câu thành chuỗi để dễ dàng kiểm tra
  const sentence = individual.join(" ");
  let not = sentence.includes("not");
  // Công thức với động từu tobe :
  // Công thức với động từ thường:
  if (/will|won’t/.test(sentence)){
    
    if (regex_feature.test(sentence)){
      //Structure: WH-word + will + S + V (base form)?
      sentenceEndChar = '?';
      fitness -= checkStructure_WH_word_Will_question(individual, not);
    }
    else if (sentenceEndChar === '?'){
      //Structure: Will + S + V (base form)?
      fitness -= checkStructure_Will_question(individual);
    }
    else{
      //Structure: S + will not + V (base form)
      fitness -= checkStructure_negative_feature(individual, not);
    }
  }
  else{
    //Structure: S + will + V (base form) ...
    fitness -= checkStructure_affirmative_feature(individual);
  }
  return fitness;
}

function sga_featureSimple(words){
  // Khởi tạo quần thể ban đầu bằng cách xáo trộn các từ
  population_feature = generateRandomPermutations(words);
  console.log(wordTypes);
  // Bước 1: Tính giá trị thích nghi của từng cá thể
  let fitnessScores = population_feature.map(individual => calculateFitness_feature(individual));
  while (Math.max(...fitnessScores) != 100) {
    // Bước 2: Lựa chọn cá thể bằng hàm Tournament selection thực hiện lựa chọn thay thế đảm bảo kích thước quần thể luôn bằng 16
    const selectedpopulation_feature = tournamentSelection(fitnessScores, population_feature);
    // Bước 3: Lai ghép chéo order 1 các cá thể để tạo ra các con
    const offspring = crossover(selectedpopulation_feature[0], selectedpopulation_feature[1]);
    // Bước 4: Đột biến hoán vị - phép đảo.
    mutation(offspring).map(individual => population_feature.push(individual));
    // Bước 5: Tính toán giá trị thích nghi của cá thể con
    fitnessScores = population_feature.map(individual => calculateFitness_feature(individual));
  }
  const maxFitnessIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
  // Thay thế từ "i" bằng "I" trong cá thể có độ thích nghi cao nhất
  population_feature[maxFitnessIndex] = population_feature[maxFitnessIndex].map(word => (word === 'i') ? 'I' : word);
  let  maxFitnessIndividual = population_feature[maxFitnessIndex].join(" ");
  animateText(maxFitnessIndividual);
}
