ndconvolve
==========
n-dimensional [convolutions](http://en.wikipedia.org/wiki/Convolution)

Install
=======
Via npm:

    npm install ndconvolve

Example
=======
Evaluating:

    var a = [ [0, 1, 0],
              [0, 0, 0] ];
    var b = [ [0, 0, 0], 
              [1, 0, 0] ];
    console.log(require("ndconvolve")(a, b));

Prints:

    [ [ 0, 0, 0, 0, 0 ],
      [ 0, 1, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ] ]

`require("ndconvolve")(a, b)`
-----------------------------
This function takes as input two images or volumes of the same tensor dimension, and returns an array with shape `shape(a) + shape(b) - 1` representing the convolution of `a` and `b`

* `a` is a tensor
* `b` is a tensor

Returns a tensor representing the convolution of `a` and `b`.

Credits
=======
(c) 2013 Mikola Lysenko. BSD