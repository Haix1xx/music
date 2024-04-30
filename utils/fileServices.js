const ffmeg = require('fluent-ffmpeg');
const streamifier = require('streamifier');
const { Readable } = require('stream');

exports.getAudioDuration = (buffer) => {
    return new Promise((resolve, reject) => {
        const readableStream = streamifier.createReadStream(buffer);
        ffmeg()
            .input(readableStream)
            .ffprobe((err, metadata) => {
                if (err) {
                    reject(err);
                } else {
                    const duration = metadata.format.duration;
                    resolve(duration);
                }
            });
    });
};
