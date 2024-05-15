import React, { useState, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import {
    fileNameAtom,
    fileTypeAtom,
    handlingAtom,
    languageAtom,
    tokenSizeAtom,
    tokenSizeMessageAtom,
    transcriptionAtom,
    translateHandlerAtom,
} from "@/atoms/transcription-atoms"





//   useEffect(() => {
// Exemple de string VTT (sous-titres en anglais)
// const vttSubtitleString = `WEBVTT

// 00:00:01.000 --> 00:00:03.500
// Hello, how are you?

// 00:00:03.500 --> 00:00:06.000
// I'm doing well, thank you.

// 00:00:07.000 --> 00:00:10.000
// That's good to hear.`;

// Parse le string VTT
export const setTabText = (vttString: any) => {
    const lines = vttString.split('\n');
    let subtitles = [];
    let timelines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Ignore les lignes vides ou non pertinentes
        if (line === '' || line.startsWith('WEBVTT')) continue;

        // Si la ligne est un timestamp
        if (line.match(/-->/)) {
            const [start, end] = line.split(' --> ');
            timelines.push(`${start.trim()},${end.trim()}`);
        } else {
            // Sinon, c'est une ligne de sous-titre
            subtitles.push(line);
        }
    }

    // console.log(subtitles);


    return subtitles;
};

export const setTabTime = (vttString: any) => {
    const lines = vttString.split('\n');
    let subtitles = [];
    let timelines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Ignore les lignes vides ou non pertinentes
        if (line === '' || line.startsWith('WEBVTT')) continue;

        // Si la ligne est un timestamp
        if (line.match(/-->/)) {
            const [start, end] = line.split(' --> ');
            timelines.push(`${start.trim()},${end.trim()}`);
        } else {
            // Sinon, c'est une ligne de sous-titre
            subtitles.push(line);
        }
    }

    // console.log(subtitles);


    return timelines;
};

export function addPrefixToUrls(urls: any, prefix: any) {
    // Vérifie si les URLs et le préfixe sont fournis
    if (!urls || !Array.isArray(urls) || urls.length === 0 || !prefix || typeof prefix !== 'string') {
        console.error("Les URLs et le préfixe doivent être fournis.");
        return;
    }

    // Parcourt chaque URL dans le tableau
    for (let i = 0; i < urls.length; i++) {
        // Ajoute le préfixe au début de chaque URL
        urls[i] = prefix + urls[i];
    }

    return urls; // Retourne le tableau d'URLs modifié
}

async function fetchArrayBuffer(url: any) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
}

function combineArrayBuffers(arrayBuffers: any) {
    const totalLength = arrayBuffers.reduce((acc: any, buffer: any) => acc + buffer.byteLength, 0);
    const combinedBuffer = new Uint8Array(totalLength);
    let offset = 0;
    arrayBuffers.forEach((buffer: any) => {
        combinedBuffer.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    });
    return combinedBuffer.buffer;
}

// Fonction pour télécharger le blob combiné
function downloadArrayBuffer(arrayBuffer: any) {
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'combined_audio.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Fonction principale pour télécharger le blob final
export async function downloadCombinedAudio(audioUrls: any) {
    try {
        // Récupère les ArrayBuffers pour chaque URL
        const arrayBufferPromises = audioUrls.map((url: any) => fetchArrayBuffer(url));
        const arrayBuffers = await Promise.all(arrayBufferPromises);
        console.log(arrayBuffers);

        // Combine les ArrayBuffers en un seul
        const combinedArrayBuffer = new Blob(arrayBuffers, { type: 'audio/mpeg' });
        //   const combinedArrayBuffer = combineArrayBuffers(arrayBuffers);

        //   console.log(combinedArrayBuffer);


        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(combinedArrayBuffer);
        downloadLink.download = 'combined_audio.mp3';
        downloadLink.click();

        // Télécharge le fichier combiné
        //   downloadArrayBuffer(combinedArrayBuffer);
    } catch (error) {
        console.error('Une erreur est survenue :', error);
    }
}





// const mettreTableau1 = ()=>{
//     const [parsedSubtitles, parsedTimelines] = parseVTTString(vttSubtitleString);
//     setSubtitles(parsedSubtitles);
//     setTimelines(parsedTimelines);
// }

export const calculateTimeDifferences = (timelines: any) => {
    let timeDifferences = [];

    for (let i = 0; i < timelines.length - 1; i++) {
        const currentEnd = parseInt(timelines[i].split(',')[1].split(':')[2].split('.')[0])
        const nextStart = parseInt(timelines[i + 1].split(',')[0].split(':')[2].split('.')[0])
        const differenceInSeconds = (nextStart - currentEnd) / 1000; // Convertir en secondes
        timeDifferences.push(differenceInSeconds);
    }

    return timeDifferences;
};

export const getTimeDebut = (timelines: any) => {
    let time = [];

    for (let i = 0; i < timelines.length ; i++) {

        const currentDebut = parseInt(timelines[i].split(',')[0].split(':')[0]) * 3600 + parseInt(timelines[i].split(',')[0].split(':')[1]) * 60 + parseInt(timelines[i].split(',')[0].split(':')[2].split('.')[0])
        time.push(currentDebut);
    }
    return time;
};


//   }, []); // Déclenché uniquement lors du premier rendu


