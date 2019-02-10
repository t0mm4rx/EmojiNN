var training_x = []
var training_y = []

const model = tf.sequential();
model.add(tf.layers.dense({
  inputShape: [4096],
  units: 4096,
  activation: 'sigmoid'
}))
model.add(tf.layers.dense({
  units: emojis.length,
  activation: 'sigmoid'
}))

model.compile({
  loss: 'meanSquaredError',
  optimizer: tf.train.sgd(0.1)
})

function train(pixels)
{

  training_x.push(pixels)
  training_y.push(emoji_to_output(current_emoji))

  training_exemples.innerText = training_x.length

  current_emoji++
  if (current_emoji > emojis.length - 1)
    current_emoji = 0
}

async function run_training()
{
  progress.innerText = "0%"
  const inputs = tf.tensor2d(training_x, shape=[training_x.length, 4096])
  const labels = tf.tensor2d(training_y, shape=[training_x.length, emojis.length])
  for (let i = 1; i < 20 ; ++i) {
    const h = await model.fit(inputs, labels, {
       batchSize: 1,
       shuffle: true,
       epochs: 10
     })
   //console.log("Loss after Epoch " + i + " : " + h.history.loss[0])
   progress.innerText = parseInt(i / 20 * 100) + "%"
   loss.innerText = ", loss: " + Math.round(h.history.loss[0] * 1000) / 1000
  }
  progress.innerText = "Completed"
}

function emoji_to_output(emoji)
{
  var output = []
  for (var i = 0; i < emojis.length; i++)
  {
    output.push(0)
  }
  output[emoji] = 1
  return output
}

function output_to_emoji(output)
{
  let max = 0
  let id = 0
  for (var i = 0; i < output.length; i++)
  {
    if (output[i] > max)
    {
      max = output[i]
      id = i
    }
  }
  return id
}

function guess(pixels)
{
  return output_to_emoji(model.predict(tf.tensor2d(pixels, shape=[1, 4096])).dataSync())
}
