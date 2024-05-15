import React, { useState, useRef } from 'react';

function AudioCombiner() {
  const audioContext = useRef(new AudioContext());
  const [audioFiles, setAudioFiles] = useState({
    audio1: null,
    audio2: null,
  });

  const handleFileChange = (event, audioKey) => {
    const file = event.target.files[0];
    setAudioFiles(prevFiles => ({
      ...prevFiles,
      [audioKey]: file,
    }));
  };

  const playCombinedAudio = () => {
    const { audio1, audio2 } = audioFiles;
    if (audio1 && audio2) {
      // Charger les fichiers audio
      Promise.all([loadAudioFile(audio1), loadAudioFile(audio2)])
        .then(([audioBuffer1, audioBuffer2]) => {
          // Créer les nœuds de lecture
          const source1 = audioContext.current.createBufferSource();
          source1.buffer = audioBuffer1;
          const source2 = audioContext.current.createBufferSource();
          source2.buffer = audioBuffer2;

          // Créer le nœud de mixage
          const mixer = audioContext.current.createGain();
          source1.connect(mixer);
          source2.connect(mixer);

          // Connecter le nœud de mixage à la sortie audio
          mixer.connect(audioContext.current.destination);

          // Lancer la lecture
          source1.start();
          source2.start();
        })
        .catch(error => console.error('Erreur lors du chargement des fichiers audio :', error));
    }
  };

  const loadAudioFile = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        audioContext.current.decodeAudioData(event.target.result, resolve, reject);
      };
      reader.onerror = error => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={e => handleFileChange(e, 'audio1')} />
      <input type="file" accept="audio/*" onChange={e => handleFileChange(e, 'audio2')} />
      <button onClick={playCombinedAudio}>Jouer les deux audios combinés</button>
    </div>
  );
}

export default AudioCombiner;
