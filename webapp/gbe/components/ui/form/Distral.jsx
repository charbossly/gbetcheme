import React from 'react';

  





class Distral extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
        };
        this.handleFileSelect = this.handleFileSelect.bind(this);
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = () => {
            const audioContext = new AudioContext();
            const offlineAudioContext = new OfflineAudioContext(2, 44100 * 10, 44100);
            const soundSource = offlineAudioContext.createBufferSource();

            audioContext.decodeAudioData(reader.result).then(decodedAudioData => {
                const myBuffer = decodedAudioData;
                soundSource.buffer = myBuffer;
                soundSource.connect(offlineAudioContext.destination);
                soundSource.start();

                offlineAudioContext.startRendering().then(renderedBuffer => {
                    console.log(renderedBuffer); // Sorties audiobuffer

                    const url = URL.createObjectURL(bufferToWave(renderedBuffer, length));
                    const a = document.createElement("a")
                    a.download = `${"fileName".split(".")[0] ?? "fileName"}.${'wav'}`
                    a.href = url
                    a.click()

                }).catch(err => {
                    console.log('Rendering failed: ' + err);
                });
            });
        };
    }

    render() {
        return (
            <div>
              Upload the video
                <input type="file" accept="video/*" onChange={this.handleFileSelect} />
            </div>
        );
    }
}

export default Distral;
