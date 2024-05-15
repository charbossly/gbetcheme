"use client"

import { formStateAtom } from "@/atoms/transcription-atoms"
import { useAtomValue } from "jotai"

import TranscribeForm from "./ui/form/transcribe-form"
import TranscriptionEditForm from "./ui/form/transcription-edit-form"

const Transcribe = ({ varopen, apiServer, fileServer }: { varopen: any, apiServer: any, fileServer:any }) => {
  const formState = useAtomValue(formStateAtom)
  console.log(varopen);
  console.log(apiServer);
  console.log(fileServer);
  

  

  return (
    <div>
      {formState === "transcribe" ? (
        <TranscribeForm />
      ) : (
        <TranscriptionEditForm varopen={varopen} apiServer = {apiServer} fileServer= {fileServer} />
      )}
    </div>
  )
}

export default Transcribe
