/*
 * timecode variables
 * t: time in seconds
 * n: frame number
 * w: video width
 * text_w: width of the text
 * h: video height
 * text_h height of the text
 */


var ffmpeg = require('fluent-ffmpeg');
const video = require('fluent-ffmpeg/lib/options/video');

function doStuff () {
    if (process.argv.length < 4) {
        console.log('Usage: inputVideo outputVideo');
        return;
    }

    let command = ffmpeg(process.argv[2])
        .complexFilter([
            {
                filter: 'drawtext',
                options: {
                    text: "hola\nMichael",
                    //textfile: 'name of file containing text
                    enable: "between(t, 5, 10)",
                    x: 't*100',
                    y:10,
                    fontsize: 48
                    //fontColor: 'white'
                },
                //outputs: ['first']
            },
            {
                inputs: ['0:v'],
                filter: 'drawtext',
                options: {
                    text: "hola\nMike",
                    //textfile: 'name of file containing text
                    enable: "between(t, 10, 15)",
                    x: 1000,
                    y: 10,
                    fontsize: 48
                    //fontColor: 'white'
                } 
            }
        ])
        .output(process.argv[3])

    command.run();

}


doStuff();
