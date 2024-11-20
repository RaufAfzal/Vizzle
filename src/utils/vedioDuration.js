import Ffmpeg from "fluent-ffmpeg";

// Set the paths to ffmpeg and ffprobe explicitly
Ffmpeg.setFfmpegPath('/opt/homebrew/bin/ffmpeg');
Ffmpeg.setFfprobePath('/opt/homebrew/bin/ffprobe');

const getVedioDuration = (filePath) => {
    return new Promise((resolve, reject) => {
        Ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) return reject(err)
            resolve(metadata.format.duration)   //Duration will be calculated in seconds
        })
    })
}


export { getVedioDuration }