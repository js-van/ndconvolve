//Straight forward implementation of FFT based convolution
var fft = require("ndfft");
var resize = require("ndresize");
var crop = require("ndcrop");
var bits = require("bit-twiddle");
var numeric = require("numeric");


function cmuleq1(x0, y0, x1, y1) {
  for(var i=0; i<x0.length; ++i) {
    var a = +x0[i];
    var b = +y0[i];
    var c = +x1[i];
    var d = +y1[i];
    var k = c * (a + b);
    x0[i] = k - b * (c + d);
    y0[i] = k + a * (d - c);
  }
}

function cmuleq2(fx0, fy0, fx1, fy1) {
  for(var j=0; j<fx0.length; ++j) {
    var x0 = fx0[j];
    var y0 = fy0[j];
    var x1 = fx1[j];
    var y1 = fy1[j];
    for(var i=0; i<x0.length; ++i) {
      var a = +x0[i];
      var b = +y0[i];
      var c = +x1[i];
      var d = +y1[i];
      var k = c * (a + b);
      x0[i] = k - b * (c + d);
      y0[i] = k + a * (d - c);
    }
  }
}

function cmuleq3(gx0, gy0, gx1, gy1) {
  for(var k=0; k<gx0.length; ++k) {
    var fx0 = gx0[j];
    var fy0 = gy0[j];
    var fx1 = gx1[j];
    var fy1 = gy1[j];
    for(var j=0; j<fx0.length; ++j) {
      var x0 = fx0[j];
      var y0 = fy0[j];
      var x1 = fx1[j];
      var y1 = fy1[j];
      for(var i=0; i<x0.length; ++i) {
        var a = +x0[i];
        var b = +y0[i];
        var c = +x1[i];
        var d = +y1[i];
        var k = c * (a + b);
        x0[i] = k - b * (c + d);
        y0[i] = k + a * (d - c);
      }
    }
  }
}

function cmuleq(x0, y0, x1, y1, n) {
  if(n === 2) {
    cmuleq2(x0, y0, x1, y1);
    return;
  }
  for(var i=0; i<x0.length; ++i) {
    cmuleq(x0[i], y0[i], x1[i], y1[i], n-1);
  }
}

function convolve(a, b) {
  var a_shape = numeric.dim(a);
  var b_shape = numeric.dim(b);
  if(a_shape.length !== b_shape.length) {
    throw new Error("Invalid dimensions");
  }
  
  var c_shape = new Array(a_shape.length);
  var r_shape = new Array(a_shape.length);
  for(var i=0; i<c_shape.length; ++i) {
    var s = a_shape[i] + b_shape[i] - 1;
    r_shape[i] = s;
    c_shape[i] = bits.nextPow2(s);
  }
  
  //FFT A
  var x0 = resize(c_shape, a);
  var y0 = numeric.rep(c_shape, 0.0);
  fft(1.0, x0, y0);
  
  //FFT B
  var x1 = resize(c_shape, b);
  var y1 = numeric.rep(c_shape, 0.0);
  fft(1.0, x1, y1);
  
  //FT(a * b) = FT(a) .* FT(b)
  switch(a_shape.length) {
    case 0:
      return [];
    case 1:
      cmuleq1(x0, y0, x1, y1);
      break;
    case 2:
      cmuleq2(x0, y0, x1, y1);
      break;
    default:
      cmuleq(x0, y0, x1, y1, a_shape.length);
      break;
  }
  
  //FFT^{-1}(FT(a) .* FT(b))
  fft(-1.0, x0, y0);
  
  return crop(r_shape, x0);
}

module.exports = convolve;