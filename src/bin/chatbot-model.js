import * as tf from '@tensorflow/tfjs-node';

const data = [
  { text: 'Can you provide a list of eye doctors?', label: 'eye_doctor' },
  { text: 'I need a list of heart doctors.', label: 'heart_doctor' },
  { text: 'Find some ophthalmologists for me.', label: 'eye_doctor' },
  { text: "I'm looking for cardiologists.", label: 'heart_doctor' },
  { text: 'Which eye doctors are available?', label: 'eye_doctor' },
  { text: 'Can you list some heart specialists?', label: 'heart_doctor' },
];

const textData = data.map((item) => item.text);
const labels = data.map((item) => item.label);

const labelMapping = { eye_doctor: 0, heart_doctor: 1 };
// @ts-ignore
const labelData = labels.map((label) => labelMapping[label]);

const tokenizer = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(' ');

const buildVocabulary = (texts) => {
  const vocab = {};
  let index = 1;
  texts.forEach((text) => {
    tokenizer(text).forEach((word) => {
      if (!vocab[word]) {
        vocab[word] = index++;
      }
    });
  });
  return vocab;
};

const encodeText = (text, vocab) => {
  return tokenizer(text).map((word) => vocab[word] || 0);
};

const vocab = buildVocabulary(textData);
const tokenizedData = textData.map((text) => encodeText(text, vocab));

// const tokenizedData = textData.map((text) => tokenizer.textToSequence(text));
const padSequences = (sequences, maxLen) => {
  return sequences.map((seq) => {
    if (seq.length < maxLen) {
      return [...seq, ...Array(maxLen - seq.length).fill(0)];
    } else {
      return seq.slice(0, maxLen);
    }
  });
};

const maxLen = Math.max(...tokenizedData.map((seq) => seq.length));
const paddedData = padSequences(tokenizedData, maxLen);

// const paddedData = tf.text.padSequences(tokenizedData, { padding: 'post' });

const model = tf.sequential();
model.add(
  tf.layers.embedding({
    inputDim: Object.keys(vocab).length + 1,
    outputDim: 50,
    inputLength: maxLen,
  })
);
model.add(tf.layers.lstm({ units: 64 }));
model.add(tf.layers.dense({ units: 2, activation: 'softmax' }));
model.compile({
  optimizer: 'adam',
  loss: 'sparseCategoricalCrossentropy',
  metrics: ['accuracy'],
});

const xs = tf.tensor2d(paddedData, [paddedData.length, maxLen], 'float32');
const ys = tf.tensor1d(labelData, 'float32');

export async function trainModel() {
  await model.fit(xs, ys, {
    epochs: 10,
    batchSize: 2,
    validationSplit: 0.2,
    callbacks: tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 2 }),
  });
}

trainModel().then(() => {
  console.log('Model training complete.');
});

export const predict = async (text) => {
  const tokenized = encodeText(text, vocab);
  const padded = padSequences([tokenized], maxLen);
  const prediction = model.predict(tf.tensor2d(padded));
  const predictedLabel = prediction.argMax(-1).dataSync()[0];
  return Object.keys(labelMapping).find(
    (key) => labelMapping[key] === predictedLabel
  );
};

// Example usage
// predict('I need a cardiologist').then((result) => {
//   console.log(`Prediction: ${result}`);
// });
