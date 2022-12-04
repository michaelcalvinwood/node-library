var ffmpeg = require('fluent-ffmpeg');

function doStuff () {
    if (process.argv.length < 4) {
        console.log('Usage: inputVideo outputVideo');
        return;
    }

    let command = ffmpeg(process.argv[2])
        .audioCodec('copy')
        .videoCodec('copy')
        .output(process.argv[3])

    command.run();

}


doStuff();
