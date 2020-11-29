let preview = document.getElementById('preview')
preview = preview.getContext('2d')
preview.width = 800
preview.height = 450

let doc = document.getElementById('canvas')
canvas = doc.getContext('2d')
canvas.width = 1920
canvas.height = 1080

const img = new Image()

// Listen for file upload
document.getElementById('bg-upload').addEventListener('change', (e) => {
  const reader = new FileReader()

  reader.onload = (e) => {
    img.src = e.target.result
    img.onload = (e) => {
      drawBackground(img, preview)
      drawBackground(img, canvas)
    }
  }

  reader.readAsDataURL(e.target.files[0])
})

// Add event listener to clicks
document.getElementById('write').addEventListener('click', () => {
  // Reload background
  drawBackground(img, preview)
  drawBackground(img, canvas)

  // Write name to canvas
  let name = document.getElementById('name-input').value
  writeName(name, preview)
  writeName(name, canvas)
})

// Draw image into canvas
function drawBackground(img, context) {
  context.drawImage(img, 0, 0, context.width, context.height)

  // Badge settings
  let badge = {
    marginLeft: 50,
    marginTop: 70,
    width: 500,
    height: 150,
    rounded: 5,
  }

  if (context.canvas.id == 'preview') {
    badge = {
      marginLeft: 22,
      marginTop: 30,
      width: 200,
      height: 60,
      rounded: 2,
    }
  }

  context.beginPath()
  context.moveTo(
    badge.marginLeft + badge.width,
    badge.marginTop + badge.height
  )
  context.arcTo(
    badge.marginLeft,
    badge.marginTop + badge.height,
    badge.marginLeft,
    badge.marginTop,
    badge.rounded
  )
  context.arcTo(
    badge.marginLeft,
    badge.marginTop,
    badge.marginLeft + badge.width,
    badge.marginTop,
    badge.rounded
  )
  context.arcTo(
    badge.marginLeft + badge.width,
    badge.marginTop,
    badge.marginLeft + badge.width,
    badge.marginTop + badge.height,
    badge.rounded
  )
  context.arcTo(
    badge.marginLeft + badge.width,
    badge.marginTop + badge.height,
    badge.marginLeft,
    badge.marginTop + badge.height,
    badge.rounded
  )
  context.fillStyle = 'white'
  context.fill()
}

// Insert name on badge
function writeName(name, context) {
  text = {
    font: 'bold 120px Arial',
    width: '',
    color: 'black',
    startX: 70,
    startY: 180,
  }

  if (context.canvas.id == 'preview') {
    text.font = 'bold 48px Arial'
    text.startX = 30
    text.startY = 75
  }

  context.fillStyle = text.color
  context.font = text.font
  context.fillText(name, text.startX, text.startY)
}

// Download
function download() {
  let download = document.getElementById('download')
  let image = doc
    .toDataURL('image/png')
    .replace('image/png', 'image/octet-stream')
  download.setAttribute('href', image)
}
