"use client"

import { FormEvent, useRef, useState } from "react"
import {
  apiKeyAtom,
  fileNameAtom,
  fileTypeAtom,
  handlingAtom,
  imgUrlAtom,
  inputPathAtom,
  inputSizeAtom,
  inputTypeAtom,
  transcriptionHandlerAtom,
  videoBlobAtom,
} from "@/atoms/transcription-atoms"
import { useAtomValue, useSetAtom } from "jotai"
// import { UploadButton, isBase64Image, useUploadThing } from '@/utils/utils';
//import { CldUploadWidget } from 'next-cloudinary';
 import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
  cloud_name: "dzovi0ewy",
  api_key: "592874824844682",
  api_secret: "RQ-HCLyj2he4IVZXjk_GhIoeJY0",
})

interface CloudinaryResource {
  context?: {
    alt?: string;
    caption?: string;
  };
  public_id: string;
  secure_url: string;
}

import { Button } from "../button"
import { Input } from "../input"
import { Label } from "../label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select"
import { useToast } from "../use-toast"
import Image from "next/image"
import { AudioLinesIcon, Upload, VideoIcon } from "lucide-react";

const TranscribeForm = () => {
  const handling = useAtomValue(handlingAtom)
  const submitHandler = useSetAtom(transcriptionHandlerAtom)
  const setFileName = useSetAtom(fileNameAtom)
  const setFileType = useSetAtom(fileTypeAtom)
  const setInputType = useSetAtom(inputTypeAtom)
  const setInputSize = useSetAtom(inputSizeAtom)
  const setInputPath = useSetAtom(inputPathAtom)
  const setVideoBlob = useSetAtom(videoBlobAtom)
  const setImgUrl = useSetAtom(imgUrlAtom)

  const [hasImageChanged, setHasImageChanged] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  // const { startUpload } = useUploadThing("imageUploader");

  const inputRef = useRef<HTMLInputElement>(null);

  const setAPIKey = useSetAtom(apiKeyAtom)
  const { toast } = useToast()

  const onUploadSuccessHandler = (result: any) => {
    setImgUrl(result?.info?.secure_url)
    console.log(result?.info?.secure_url);

  }


  const handleImage = (
    // e: ChangeEvent<HTMLInputElement>,
    e: React.ChangeEvent<HTMLInputElement>,
    // fieldChange: any
  ) => {
    e.preventDefault();


    // setFileName(e?.target?.files?.[0]?.name as string); setInputSize(e?.target?.files?.[0]?.size);
    // setInputType(e?.target?.files?.[0]?.type); setInputPath(e?.target.value);
    // setVideoBlob(URL.createObjectURL(e.target.files?.[0]));


    // console.log(Array.from(e.target.files));
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);

    }


    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("video")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        setHasImageChanged(imageDataUrl);
        // console.log(isBase64Image(imageDataUrl));
        envoiImg(imageDataUrl)
      };



      fileReader.readAsDataURL(file);
    }
  };

  const envoiImg = async (formData: any) => {
    console.log(hasImageChanged);
    const file1 = formData.get('file') 
    const arrayBuffer = await file1.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer)
    await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        tags: ['nextjs-server-actions-upload-videos'],
        upload_preset: 'nextjs-server-actions-upload',
        resource_type: 'video',
      }, function (error, result) {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }).end(buffer);
    });


      // if (hasImageChanged) {
      //   const imgRes = await startUpload(files);

      //   if (imgRes && imgRes[0].url) {
      //     setImgUrl(imgRes[0].url)
      //     // savePost(imgRes[0].url)
      //     console.log("imgupload success");

      //   } else {
      //     // toast.error("Erreur d'enrégistrement d'image");
      //   }
      // } else {
      //   // savePost('')
      // }

    }

  return (
      <div>
        <form
          onSubmit={async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            try {

              await submitHandler(formData)
              // envoiImg(formData)
              // await envoiImg()
            } catch (error: any) {
              console.log(error)
              toast({
                title: "Error",
                description: error?.message,
              })
            }
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <Label>
              Choisissez votre vidéo ou audio{" "}
              <span className="text-xs text-neutral-500">Max: 25MB</span><br />
              L'audio ou la vidéo doit être en langue <span className="text-green-500">francaise ou anglaise</span>
            </Label>
            <Input
              onChange={(e: any) => {
                setFileName(e?.target?.files?.[0]?.name as string); setInputSize(e?.target?.files?.[0]?.size);
                setInputType(e?.target?.files?.[0]?.type); setInputPath(e?.target.value); console.log(URL.createObjectURL(e.target.files?.[0]));
                // setVideoBlob(URL.createObjectURL(e.target.files?.[0]));

                // const fileReader = new FileReader();
                // if (e.target.files && e.target.files.length > 0) {
                //   const file = e.target.files[0];
                //   setFiles(Array.from(e.target.files));

                //   // if (!file.type.includes("video")) return;

                //   fileReader.onload = async (event) => {
                //     const imageDataUrl = event.target?.result?.toString() || "";
                //     setHasImageChanged(imageDataUrl);
                //     // console.log(isBase64Image(imageDataUrl));
                //     envoiImg(imageDataUrl)
                //   };

              //  envoiImg()

                //   fileReader.readAsDataURL(file);
                // }

              }}
              type="file"
              max={25 * 1024 * 1024}
              accept="audio/*,video/*"
              name="file"
            />
          </div>



          {/* <div className="space-y-4">
        <Label>
          Write a propmt{" "}
          <span className="text-xs text-neutral-500">
            You can improve your transcription with a prompt.
          </span>
        </Label>
        <Input name="prompt" placeholder="Next.js, Typescript..." />
      </div> */}
          <div className="space-y-4 hidden">
            <Label>
              Choisissez le types desfichiers sous-titre{" "}
              <span className="text-xs text-neutral-500">
                Choisissez entre SRT ou VTT.
              </span>
            </Label>
            <Select
              onValueChange={(value) => {
                setFileType(value as "vtt" | "srt")
              }}
              defaultValue="vtt"
              name="response_format"
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a response type." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vtt">VTT</SelectItem>
                <SelectItem value="srt">SRT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <div className="space-y-4">
        <Label>
          OpenAI API Key{" "}
          <span className="text-xs text-neutral-500">
            You key will not be stored anywhere.{" "}
            <a
              className="dark:text-neutral-200 text-neutral-700"
              href="https://platform.openai.com/account/api-keys"
            >
              Get your key ↗
            </a>
          </span>
        </Label>
        <Input
          onChange={(e) => {
            setAPIKey(e.target.value)
          }}
          type="password"
          name="api_key"
          placeholder="sk-QT"
        />
      </div> */}
          <div className="flex gap-4">
            <Button type="submit" className="bg-[#0064DF]" >
              {!handling ? (
                "Transcrire"
              ) : (
                <span className="animate-pulse">Transcription...</span>
              )}{" "}
            </Button>
          </div>
        </form>
        {/* {hasImageChanged ? (
        <div className="w-full h-28 flex text-center justify-center items-center border border-gray-200 rounded-lg ">
          <label htmlFor="image">
            <VideoIcon />
          </label>
        </div>

      ) : (
        <div className="w-full h-28 flex text-center justify-center items-center border border-gray-200 rounded-lg ">
          <label htmlFor="image">
            <Upload />
          </label>
        </div>
      )} */}

        {/* <input
        type='file'
        accept='video/*'
        id="image"
        placeholder='Add profile photo'
        className='hidden'
        ref={inputRef}
        onChange={(e) => handleImage(e)}
      /> */}


        {/* <CldUploadWidget
        uploadPreset="ujexbjpu"
        options={{
          multiple: false,
          resourceType: "image",
        }}
        onSuccess={onUploadSuccessHandler}
      >
        {({ open }) => {
          return (
            <button onClick={() => open()}>
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget> */}

      </div>


    )
  }

  export default TranscribeForm
