var left = null, right = null;

var training_exemples = document.getElementById('training_exemples')
var progress = document.getElementById('progress')
var loss = document.getElementById('loss')

var emojis = [
  'angry',
  'happy',
  'heart',
  'thumbs',
  'lol'
]

var images = []
var current_emoji = 0

const pencil_radius = 10

var left_buffer = []
var right_buffer = []

var tmp = null
var last_pred = null

function setup()
{
  createCanvas(800, 400).parent('canvas_wrapper')

  left = createGraphics(400, 400)
  right = createGraphics(400, 400)

  for (var i = 0; i < emojis.length; i++)
  {
    images[emojis[i]] = loadImage('emojis/' + emojis[i] + '.png')
  }

}

function draw()
{

  left.fill(200)
  left.noStroke()
  left.rect(0, 0, width, height)
  left.rect(0, 0, width, height)

  right.fill(200)
  right.noStroke()
  right.textFont('PT Mono')
  right.rect(0, 0, width, height)
  right.rect(0, 0, width, height)

  left.fill(100)
  left.textSize(20)
  left.textFont('PT Mono')
  left.textAlign(CENTER, CENTER)
  left.text('Train', 200, 200)

  left.imageMode(CENTER)
  left.image(images[emojis[current_emoji]], 200, 40, 64, 64)

  if (last_pred != null)
  {
    right.imageMode(CENTER)
    right.image(images[emojis[last_pred]], 200, 40, 64, 64)
  }

  for (var p of left_buffer)
  {
    left.fill(100, 100, 200)
    left.ellipse(p[0], p[1], pencil_radius, pencil_radius)
  }

  for (var p of right_buffer)
  {
    right.fill(200, 100, 100)
    right.ellipse(p[0], p[1], pencil_radius, pencil_radius)
  }


  right.fill(100)
  right.textSize(20)
  right.textAlign(CENTER, CENTER)
  right.text('Guess', 200, 200)

  if (mouseIsPressed && mouseX > 0 && mouseX < 800 && mouseY > 0 && mouseY < 400)
  {
      if (mouseX < 400)
      {
        paint_left(mouseX, mouseY)
      } else
      {
        paint_right(mouseX - 400, mouseY)
      }
  } else {
    if (left_buffer.length > 0)
    {
      train(format_buffer(left_buffer))
      left_buffer = []
    }
    if (right_buffer.length > 0)
    {
      last_pred = guess(format_buffer(right_buffer))
      right_buffer = []
    }
  }

  imageMode(CORNER)
  image(left, 0, 0)
  image(right, 400, 0)

  stroke(100)
  strokeWeight(1)
  line(width / 2, 0, width / 2, height)

  if (tmp != null)
  {
    imageMode(CENTER)
    noSmooth()
    image(tmp, width / 2, height / 2, 64, 64)
  }



}


function paint_left(x, y)
{
  var nx = parseInt(x)
  var ny = parseInt(y)
  for (var p of left_buffer)
  {
    if (p[0] == nx && p[1] == ny)
    {
      return;
    }
  }

  left_buffer.push([nx, ny])
}

function paint_right(x, y)
{
  var nx = parseInt(x)
  var ny = parseInt(y)
  for (var p of right_buffer)
  {
    if (p[0] == nx && p[1] == ny)
    {
      return;
    }
  }

  right_buffer.push([nx, ny])
}

function keyPressed()
{
  // console.log(keyCode)

  if (keyCode == 67)
    left_buffer = []
}

function format_buffer(buffer)
{
  const buffer_size = get_buffer_size(buffer)
  const buffer_min = get_buffer_min(buffer)
  let temp_graphics = createGraphics(buffer_size[0], buffer_size[1])

  const line_weight = (buffer_size[0]) / (width / 2) * pencil_radius * 2

  temp_graphics.fill(255)
  temp_graphics.noStroke()
  temp_graphics.rect(0, 0, buffer_size[0], buffer_size[1])

  for (p of buffer)
  {
    temp_graphics.fill(0)
    temp_graphics.ellipse(p[0] - buffer_min[0] + pencil_radius, p[1] - buffer_min[1] + pencil_radius, line_weight, line_weight)
  }

  let resize_graphics = createGraphics(32, 32)
  resize_graphics.image(temp_graphics, 0, 0, 32, 32)

  tmp = resize_graphics
  resize_graphics.loadPixels()
  var px = Array.from(resize_graphics.pixels)
  for (var i = 0; i < px.length; i++)
  {
    px[i] = px[i] / 255.0
  }

  return px
}

function get_buffer_min(buffer)
{
  let min_x = width / 2
  let min_y = height

  for (var p of buffer)
  {
    if (p[0] < min_x)
    {
      min_x = p[0]
    }
    if (p[1] < min_y)
    {
      min_y = p[1]
    }
  }

  return [min_x, min_y]
}

function get_buffer_size(buffer)
{
  let max_x = 0
  let min_x = width / 2
  let max_y = 0
  let min_y = height

  for (var p of buffer)
  {
    if (p[0] < min_x)
    {
      min_x = p[0]
    }
    if (p[1] < min_y)
    {
      min_y = p[1]
    }
    if (p[0] > max_x)
    {
      max_x = p[0]
    }
    if (p[1] > max_y)
    {
      max_y = p[1]
    }
  }
  return [max_x - min_x + 2 * pencil_radius, max_y - min_y + 2 * pencil_radius]

}
