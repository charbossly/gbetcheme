import React from 'react';
import Transcribe from "@/components/transcribe"


const page = () => {
    return (
        <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl text-[#0064DF]">
            Transcrivez vos audios et vidéos.
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground text-neutral-600">
          Ajoutez simplement votre vidéo ou votre audio et nous ferons le reste.
           Vous pouvez également traduire votre transcription dans les langues répertoriées.
          </p>
        </div>
        <Transcribe varopen={process.env.OPENAI_API_KEY} apiServer={process.env.API_SERVER} fileServer={process.env.FILE_SERVER} />
      </section>
    );
};

export default page;