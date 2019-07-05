var canvas = document.getElementById('myCanvas');

for (var i = 100; i < 700; i += 100) {
  for (var j = 100; j < 1300; j += 100) {
    var newCircle = new Path.Circle(new Point(j, i), 10);
    newCircle.fillColor = 'purple';
  }
}

var changeColor = setInterval(function() {
  for (var i = 100; i < 700; i += 100) {
    for (var j = 100; j < 1300; j += 100) {
      var newCircle = new Path.Circle(new Point(j, i), 50);
      newCircle.fillColor = 'black';
    }
  }
  for (var i = 100; i < 700; i += 100) {
    for (var j = 100; j < 1300; j += 100) {
      var r = Math.floor(Math.random() * 256);
      var g = Math.floor(Math.random() * 256);
      var b = Math.floor(Math.random() * 256);
      var rad = Math.floor(Math.random() * 40 + 10);
      var color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
      var newCircle = new Path.Circle(new Point(j, i), rad);
      newCircle.fillColor = color;
    }
  }
}, 1000);