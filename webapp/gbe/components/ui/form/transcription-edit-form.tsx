import { FormEvent, useEffect, useRef, useState } from "react"
import {
  fileNameAtom,
  fileTypeAtom,
  handlingAtom,
  imgUrlAtom,
  inputPathAtom,
  inputSizeAtom,
  inputTypeAtom,
  languageAtom,
  tokenSizeAtom,
  tokenSizeMessageAtom,
  transcriptionAtom,
  translateHandlerAtom,
  videoBlobAtom,
} from "@/atoms/transcription-atoms"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import ReactPlayer from 'react-player'
import { Button } from "../button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select"
import { Textarea } from "../textarea"
import { useToast } from "../use-toast"
import WhiteNoiseGenerator from "./Dirac.jsx"
import AudioCombiner from "./Desra.jsx"
import Distral from "./Distral.jsx"
import { addPrefixToUrls, downloadCombinedAudio, getTimeDebut, setTabText, setTabTime } from "./Division"
import { ArrowDownCircle } from "lucide-react"






const TranscriptionEditForm = ({ varopen, apiServer, fileServer }: { varopen: any, apiServer: any, fileServer: any }) => {
  const handling = useAtomValue(handlingAtom)
  const fileType = useAtomValue(fileTypeAtom)
  const fileName = useAtomValue(fileNameAtom)
  const inputType = useAtomValue(inputTypeAtom)
  const inputSize = useAtomValue(inputSizeAtom)
  const inputPath = useAtomValue(inputPathAtom)
  const videoUrl = useAtomValue(imgUrlAtom)
  const setVideoUrl = useSetAtom(imgUrlAtom)





  const setLanguage = useSetAtom(languageAtom)
  const [transcription, setTranscription] = useAtom(transcriptionAtom)
  const setTranscipt = useSetAtom(transcriptionAtom)
  const [audioHandler, setAudioHandler] = useState<any>(false);
  const [combinedAudio, setCombinedAudio] = useState<any>();
  const [videoFilePath, setVideoFilePath] = useState(null);



  const translateHandler = useSetAtom(translateHandlerAtom)
  const tokenSizeMessage = useAtomValue(tokenSizeMessageAtom)
  const tokenSize = useAtomValue(tokenSizeAtom)
  const [textFinal, setTextFinal] = useState<any>(String(transcription));
  const [langue, setLangue] = useState<any>("yoruba");
  const [hand, setHand] = useState<any>(false);


  const [dialogues, setDialogues] = useState<any>(setTabText(transcription));
  const [timelines, setTimelines] = useState<any>(setTabTime(transcription));
  const [liens, setLiens] = useState<any>([]);
  const [decAudio, setDecAudio] = useState<any>(false);
  const [decVideo, setDecVideo] = useState<any>(false);





  const { toast } = useToast()

  // const handleVideoUpload = (event: any) => { setVideoFilePath(URL.createObjectURL(event.target.files[0])); };


  useEffect(() => {
    console.log(transcription);

    setDialogues(setTabText(transcription))
    setTimelines(setTabTime(transcription))
    console.log(getTimeDebut(setTabTime(transcription)));

  }, [transcription]);

  const debutAudio = async () => {

    const response = await fetch(`${apiServer}/texts/audios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "src": "yoruba",
        "targ": "yoruba",
        "texts": dialogues,
        "timelines": getTimeDebut(setTabTime(transcription))
      }),
    }).then((res) => res.json())
      .then((val: any) => {
        // console.log(addPrefixToUrls(val, "http://10.229.32.172:8080"));
        // setLiens(addPrefixToUrls(val, "http://10.229.32.172:8080"))
        setCombinedAudio(val)
        console.log(val);
        console.log(fileServer + val);
        setDecVideo(true)


        // return val
        // downloadCombinedAudio(val)
        // setTextFinal(val.choices[0].message.content)
        // setTranscipt(String(val.choices[0].message.content))
        // setHand(false)
        // return val.choices[0].message.content
      })


  }

  const envoiBlob = async (e: any) => {
    const formData1 = new FormData();

    const response = await fetch(`${apiServer}/combine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "url": e,
      }),

    }).then((res) => res.json())
      .then((val: any) => {
        // console.log(addPrefixToUrls(val, "http://10.229.32.172:8080"));
        if (val) {
          console.log(apiServer + val);

          setVideoUrl(apiServer + val)
        }
        // downloadCombinedAudio(val)
        // setTextFinal(val.choices[0].message.content)
        // setTranscipt(String(val.choices[0].message.content))
        // setHand(false)
        // return val.choices[0].message.content
      })
  }

  const downloadHandler = () => {
    const blob = new Blob([String(transcription)], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.download = `${fileName.split(".")[0] ?? fileName}.${fileType}`
    a.href = url
    a.click()
  }

  // const parseSubtitles = (subtitleString: any) => {
  //   const subtitleLines = subtitleString.split('\n');
  //   let dialoguesArray = [];
  //   let timelinesArray = [];

  //   let dialogue = '';
  //   let timeline = '';

  //   for (let i = 0; i < subtitleLines.length; i++) {
  //     const line = subtitleLines[i].trim();

  //     if (line === '' || line.includes('WEBVTT')) {
  //       // Ignorer les lignes vides et la ligne contenant "WEBVTT"
  //       continue;
  //     }

  //     if (line.includes('-->')) {
  //       // Si la ligne contient les horaires
  //       timeline = line.split(' --> ').join(',');
  //     } else {
  //       // Sinon, c'est une partie du dialogue
  //       dialogue += `${line} `;
  //     }

  //     if (subtitleLines[i + 1] === '' || i === subtitleLines.length - 1) {
  //       // Si la prochaine ligne est vide ou si c'est la dernière ligne, c'est la fin d'un dialogue
  //       dialoguesArray.push(dialogue.trim());
  //       timelinesArray.push(timeline);
  //       dialogue = '';
  //       timeline = '';
  //     }
  //   }

  //   setDialogues(dialoguesArray);
  //   setTimelines(timelinesArray);
  // };

  // Appel de la fonction avec le string de sous-titres


  const [audioFile1, setAudioFile1] = useState<any>(null);
  const [audioFile2, setAudioFile2] = useState<any>(null);

  const handleAudioFileChange1 = (event: any) => {
    setAudioFile1(event.target.files[0]);
  };

  const handleAudioFileChange2 = (event: any) => {
    setAudioFile2(event.target.files[0]);
  };

  const handleCombineAudioFiles = async () => {
    const audioBlob1 = await audioFile1.arrayBuffer();
    const audioBlob2 = await audioFile2.arrayBuffer();

    const combinedAudioBlob = new Blob([audioBlob1, audioBlob2], { type: 'audio/mpeg' });
    // console.log(combinedAudioBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(combinedAudioBlob);
    downloadLink.download = 'combined_audio.mp3';
    downloadLink.click();
  };






  // const scission = () => {
  //   const vttLines = transcription.split('\n');
  //   let currentDialogue = '';
  //   let currentTimeline = '';
  //   let dialogueIndex = 0;
  //   for (let i = 0; i < vttLines.length; i++) {
  //     const line = vttLines[i];
  //     if (line.match(/^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}/)) {
  //       // Cette ligne contient une timeline
  //       currentTimeline = line;
  //       timelines[dialogueIndex] = currentTimeline;
  //     } else if (line !== '' && !line.match(/^WEBVTT/)) {
  //       // Cette ligne contient un dialogue
  //       currentDialogue += line + ' ';
  //       dialogues[dialogueIndex] = currentDialogue.trim();
  //       dialogueIndex++;
  //     }
  //   }
  // }

  const trad = async (a: any, e: any) => {
    try {

      await fetch('https://api.openai.com/v1/chat/completions', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${varopen}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `Vous êtes un assistant virtuel chargé d'aider les utilisateurs à traduire les sous-titres de vidéos. Voici comment vous pouvez procéder :

              1. Lorsque l'utilisateur envoie un message, vérifiez s'il s'agit du premier message ou du deuxième.
              2. Si c'est le premier message, cela signifie que l'utilisateur envoie l'intégralité du fichier de sous-titres. Vous devez extraire les paroles des sous-titres et les renvoyer à l'utilisateur.
              3. Si c'est le deuxième message, cela signifie que l'utilisateur vous envoie la traduction des paroles que vous lui avez précédemment fournies, mais dans une langue africaine.
              4. Vous devez reconstituer le fichier de sous-titres en remplaçant les paroles d'origine par les traductions fournies dans le deuxième message. La reconstitution doit
              obligatoirement prendre en compte toutes les timelines du fichier originel.
              5. Enfin, envoyez à l'utilisateur le fichier de sous-titres traduit.`
            },
            {
              role: "user",
              content: transcription
            },
            {
              "role": "assistant",
              "content": a
            },
            {
              "role": "user",
              "content": e
            }
          ]
        }),
      })
        .then((res) => res.json())
        .then((val) => {
          console.log(val.choices[0].message.content);
          setTextFinal(val.choices[0].message.content)
          setTranscipt(String(val.choices[0].message.content))
          setHand(false)
          setDecAudio(true)

          return val.choices[0].message.content
        })

    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message,
      })
    }
  }
  return (
    <div>
      <form
        className="space-y-6"
        // encType="multipart/form-data"
        onSubmit={async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          console.log('Ifrit');

          if (tokenSizeMessage.type !== "success") return
          setHand(true)
          try {

            const response1 = await fetch('https://api.openai.com/v1/chat/completions', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${varopen}`
              },
              body: JSON.stringify({
                model: "gpt-3.5-turbo",
                // max_tokens: tokenSize.remainingTokenSize,
                // temperature: 0.9,
                // stream: true,
                messages: [
                  {
                    role: "system",
                    content: "You are a text extractor machine. Your mission is extract speech from srt or vtt files. Change the format of the file by removing all non speech of the file. Only return the file containing only speechs which you will translate into french langage."
                  },
                  {
                    role: "user",
                    content: String(transcription)
                  },
                ]
              }),
            })
              .then((res) => res.json())
              .then((val) => {
                // console.log(val);
                return val
              })
            // console.log(response1.choices[0].message.content);

            // const response2 = await fetch('https://fast-api-deploy-test-render.onrender.com/text/text', {

            const response2 = await fetch(`${apiServer}/text/text`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
              },
              body: JSON.stringify({
                src: `fr`,
                targ: `${langue === "yoruba" ? "yoruba" : "yoruba"}`,
                text: response1.choices[0].message.content,
              }),
            })
              .then((res) => res.json())
              .then((val) => {
                return val
              })

            // console.log(response2.translation);
            trad(response1.choices[0].message.content, response2.translation);

            //  console.log(response3);

            // await translateHandler()
          } catch (error: any) {
            toast({
              title: "Error",
              description: error?.message,
            })
          }
        }}
      >
        <Textarea
          name="transcription"
          className="h-96"
          value={transcription}
          onChange={(e) => {
            setTranscription(e.target.value)
          }}
        />
        {/* <div className="flex items-center gap-2">
        <div
          className={
            "w-2 h-2 rounded-full inline-block " +
            (tokenSizeMessage.type === "success"
              ? "bg-green-500"
              : tokenSizeMessage.type === "warning"
              ? "bg-yellow-400"
              : "bg-red-500")
          }
        />
        <div className="text-sm text-neutral-500">
          {tokenSizeMessage.message}
        </div>
      </div> */}
        <div>
          <Select
            onValueChange={(value) => {
              setLanguage(value);
              setLangue(value)
            }}
            defaultValue="yoruba"
            name="language"
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a response type." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yoruba">Yoruba</SelectItem>
              {/* <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="turkish">Turkish</SelectItem>
            <SelectItem value="german">German</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="italian">Italian</SelectItem>
            <SelectItem value="portuguese">Portuguese</SelectItem>
            <SelectItem value="russian">Russian</SelectItem>
            <SelectItem value="arabic">Arabic</SelectItem>
            <SelectItem value="chinese">Chinese</SelectItem>
            <SelectItem value="japanese">Japanese</SelectItem>
            <SelectItem value="korean">Korean</SelectItem>
            <SelectItem value="hindi">Hindi</SelectItem>
            <SelectItem value="indonesian">Indonesian</SelectItem>
            <SelectItem value="thai">Thai</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between gap-6">
          <Button disabled={(tokenSizeMessage.type !== "success") || hand == true} type="submit" className="w-32 bg-[#0064DF]">
            {!hand ? (
              "Traduire"
            ) : (
              <span className="animate-pulse">Traduction...</span>
            )}
          </Button>
          <Button type="button" onClick={downloadHandler} variant="secondary" className="w-32">
            Télécharger
          </Button>

        </div>

      </form>


      <div className="flex flex-col items-center mb-4 mt-5 ">
        <div className=" flex justify-between w-full mb-4">
          <p className="text-sm">Nom</p>
          <p className="text-sm">Type</p>
          <p className="text-sm">TAILLE</p>
        </div>
        <div className=" flex justify-between text-center w-full bg-[#f9f9f9] rounded-lg px-4 py-2 mb-10 items-center">
          <p className="text-sm max-w-20 max-h-5 overflow-y-clip truncate">{fileName}</p>
          <p className="text-sm">{inputType}</p>
          <p className="text-sm">{inputSize}</p>
        </div>

        <div className={` flex justify-center text-center w-full  rounded-lg px-4 py-2  `}>
          <ArrowDownCircle className="w-24 h-24 text-[#0064DF]" />
        </div>
      </div>


      <Button type="button" onClick={() => { debutAudio() }} className=" bg-[#0064DF] w-full mb-7" disabled={decAudio == false}>
        Générer l'audio
      </Button>

      {combinedAudio ? (
        <audio controls className="mx-auto mb-5">
          <source src={apiServer + combinedAudio} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <></>
      )}







      <Button type="button" onClick={() => {
        const parties = inputPath.split('\\');
        const nomFichier = parties[parties.length - 1];
        // console.log("http://192.168.1.119:5955/"+nomFichier);
        envoiBlob(`${fileServer}/` + nomFichier)
        // envoiBlob()

      }} className=" bg-[#0064DF] w-full mb-7" disabled={decVideo == false && inputType == "video/mp4"}>
        Générer la vidéo
      </Button>


      {videoUrl && inputType == "video/mp4" ? (
        // <ReactPlayer url={videoUrl} />
        // <ReactPlayer url={"https://www.youtube.com/watch?v=a0-LTTS987c"} />
        <video width="640" height="360" controls className="mx-auto pb-5">
          <source src={videoUrl} type="video/mp4" />
          {/* Ajoutez des sources supplémentaires pour une compatibilité avec différents formats de vidéo */}
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>


      ) : (
        <></>
      )}


      {/* <Button type="button" onClick={() => {
        console.log(combinedAudio);
      }} className=" bg-[#0064DF] w-full mb-7">
        test
      </Button> */}







      {/* <Button type="button" onClick={() => { debutAudio() }} variant="secondary">
        Générer l'audio
      </Button>

      <div>
        <h1>Combiner des fichiers audio</h1>
        <input type="file" accept="audio/*" onChange={handleAudioFileChange1} />
        <input type="file" accept="audio/*" onChange={handleAudioFileChange2} />
        <button onClick={handleCombineAudioFiles} disabled={!audioFile1 || !audioFile2}>Combiner les fichiers audio</button>
      </div>

      <WhiteNoiseGenerator /><br />
      <AudioCombiner /> */}
      {/* <Distral/> */}

      {/* <Button onClick={() => {
          // scission()
          parseSubtitles(transcription);
        }} >
          kitkalos
        </Button>
        <Button onClick={() => {
          console.log(dialogues); console.log(timelines);

        }} >
          rulkalos
        </Button> */}
    </div>

  )
}

export default TranscriptionEditForm
