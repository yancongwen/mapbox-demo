var fs = require('fs')
const loopLength = 1800; // 时间范围
const pointInterval = 40;

fs.readFile('./bus.json', 'utf8', function(err, data) {
  var lines = JSON.parse(data)
  var busLines = []
  for(var i = 0; i < lines.length; i++) {
    let rgba = lines[i].lineStyle.normal.color
    let rgbaArr = rgba.split('(')[1].split(')')[0].split(',')
    //let color = [+rgbaArr[0], +rgbaArr[1], +rgbaArr[2]]
    let color = [255,0,0]
    let time = +(Math.random() * loopLength.toFixed(3))
    //let time = 100
    let preTime = time
    for(var j = 0; j < lines[i].coords.length; j++) {
      let dif = +(Math.random() * pointInterval.toFixed(3))
      lines[i].coords[j].push(preTime + dif)
      preTime = lines[i].coords[j][2]
    }
    busLines.push({
      color: color,
      coords: lines[i].coords
    })
  }
  fs.writeFileSync('./busLine.json', JSON.stringify(busLines, null, 2))
})