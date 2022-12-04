ffmpeg('/path/to/file.avi')
  .complexFilter([
    // Rescale input stream into stream 'rescaled'
    'scale=640:480[rescaled]',

    // Duplicate rescaled stream 3 times into streams a, b, and c
    {
      filter: 'split', options: '3',
      inputs: 'rescaled', outputs: ['a', 'b', 'c']
    },

    // Create stream 'red' by removing green and blue channels from stream 'a'
    {
      filter: 'lutrgb', options: { g: 0, b: 0 },
      inputs: 'a', outputs: 'red'
    },

    // Create stream 'green' by removing red and blue channels from stream 'b'
    {
      filter: 'lutrgb', options: { r: 0, b: 0 },
      inputs: 'b', outputs: 'green'
    },

    // Create stream 'blue' by removing red and green channels from stream 'c'
    {
      filter: 'lutrgb', options: { r: 0, g: 0 },
      inputs: 'c', outputs: 'blue'
    },

    // Pad stream 'red' to 3x width, keeping the video on the left,
    // and name output 'padded'
    {
      filter: 'pad', options: { w: 'iw*3', h: 'ih' },
      inputs: 'red', outputs: 'padded'
    },

    // Overlay 'green' onto 'padded', moving it to the center,
    // and name output 'redgreen'
    {
      filter: 'overlay', options: { x: 'w', y: 0 },
      inputs: ['padded', 'green'], outputs: 'redgreen'
    },

    // Overlay 'blue' onto 'redgreen', moving it to the right
    {
      filter: 'overlay', options: { x: '2*w', y: 0 },
      inputs: ['redgreen', 'blue'], outputs: 'output'
    },
  ], 'output');