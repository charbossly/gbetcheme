from typing import Optional
from fastapi import FastAPI, Path, Depends
from TextTranslationRequest import TextTranslationRequest
from AudioTranslationRequest import AudioTranslationRequest
from translate_audio_audio import convert_yoruba_to_yoruba, convert_fr_to_fr, convert_eng_to_eng,convert_eng_to_fr,convert_fon_to_fon,convert_fr_to_eng
import os
from typing import List
import librosa
import soundfile as sf
import pydub
from pydub import AudioSegment
from translate_text_text import translate_eng_to_fon,translate_eng_to_fr,translate_eng_to_yoruba,translate_fon_to_fr,translate_fon_to_yoruba,translate_fr_to_eng,translate_fr_to_fon,translate_fr_to_yoruba,translate_yoruba_to_fr,translate_yoruba_to_eng
# from translate_audio_text import translate_fr_to_yoruba,transcribe_yoruba_to_text,translate_eng_to_fon,translate_eng_to_fr,translate_eng_to_yoruba,translate_fr_to_eng,translate_fr_to_fon,translate_yoruba_to_eng,translate_yoruba_to_fr,translate_yoruba_to_yoruba
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from translate_text_audio import text_fr_to_yoruba,text_eng_to_yoruba, text_yoruba_to_yoruba
from fastapi.responses import FileResponse
from TextTranslationArrayRequest import TextTranslationArrayRequest
import shutil
from UrlRequest import UrlRequest
import pickle
from moviepy.editor import VideoFileClip, AudioFileClip
import io
from VideoRequest import VideoRequest
from pydantic import BaseModel
import requests

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": False})

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.get("/")
async def root():
    return {"message": "WELCOME TO API"}

# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Optional[str] = None):
#     return {"item_id": item_id, "q": q}


@app.get("/vits/audios/{url}")
async def serve_audio(url: str):
    path = os.path.join(os.getcwd(), "vits/audios",url)
    print(path)
    return FileResponse(path=path, media_type="audio/wav", filename="audio.wav")

@app.post("/text/text")
async def translate_text_text(request: TextTranslationRequest):
    src = request.src
    targ = request.targ
    text = request.text
    print(text)

    if src == "fon" and targ == "fr":
        translation = translate_fon_to_fr(text)
    elif src == "fon" and targ == "yoruba":
        translation = translate_fon_to_yoruba(text)
    elif src == "fr" and targ == "fon":
        translation = translate_fr_to_fon(text)
    elif src == "fr" and targ == "eng":
        translation = translate_fr_to_eng(text)
    elif src == "fr" and targ == "yoruba":
        translation = translate_fr_to_yoruba(text)
    elif src == "eng" and targ == "fon":
        translation = translate_eng_to_fon(text)
    elif src == "eng" and targ == "yoruba":
        translation = translate_eng_to_yoruba(text)
    elif src == "eng" and targ == "fr":
        translation = translate_eng_to_fr(text)
    elif src == "yoruba" and targ == "fr":
        translation = translate_yoruba_to_fr(text)
    elif src == "yoruba" and targ == "eng":
        translation = translate_yoruba_to_eng(text)
    else:
        return {"error": "Unsupported language pair"}

    return {"translation": translation}


@app.post("/text/audio")
async def translate_text(request: TextTranslationRequest):
    src = request.src
    targ = request.targ
    text = request.text

    if src == "eng" and targ == "yoruba":
        translation = text_eng_to_yoruba(text)
    elif src == "fr" and targ == "yoruba":
        translation = text_fr_to_yoruba(text)
    elif src == "yoruba" and targ == "yoruba":
        translation = text_yoruba_to_yoruba(text)
    else:
        return {"error": "Unsupported language pair"}

    return translation


# @app.post("/texts/audios")
# async def translate_text(request: TextTranslationRequest):
#     src = request.src
#     targ = request.targ
#     texts = request.texts  # assuming texts is a list of strings

#     translations = []

#     if src == "eng" and targ == "yoruba":
#         for text in texts:
#             translation = text_eng_to_yoruba(text)
#             translations.append(translation)
#     elif src == "fr" and targ == "yoruba":
#         for text in texts:
#             translation = text_fr_to_yoruba(text)
#             translations.append(translation)
#     elif src == "yoruba" and targ == "yoruba":
#         for text in texts:
#             translation = text_yoruba_to_yoruba(text)
#             translations.append(translation)
#     else:
#         return {"error": "Unsupported language pair"}

#     return {"translations": translations}

def generate_silent_audio(duration_ms, output_file):
    silent_audio = pydub.AudioSegment.silent(duration=duration_ms)
    silent_audio.export(f"{os.path.join(os.getcwd(), 'vits/silents/')+str(output_file)+'.wav'}", format="wav")

def get_wav_duration_pydub(wav_file_path):
    audio_segment = pydub.AudioSegment.from_wav(wav_file_path)
    duration = len(audio_segment) / 1000
    return duration


@app.post("/texts/audios")
async def translate_texts(request: TextTranslationArrayRequest):
    translations = []
    src = request.src
    targ = request.targ
    texts = request.texts
    timelines = request.timelines
    differences_timelines = []

    ##calculer les temps de silence
    for index,time in enumerate(timelines) :
        if(index<len(timelines)-1):
            differences_timelines.append(timelines[index+1]-timelines[index])
    
   
    
    for txt_request in texts:
        text = txt_request
        if src == "eng" and targ == "yoruba":
            translation = text_eng_to_yoruba(text)
        elif src == "fr" and targ == "yoruba":
            translation = text_fr_to_yoruba(text)
        elif src == "yoruba" and targ == "yoruba":
            translation = text_yoruba_to_yoruba(text)
        else:
            return {"error": "Unsupported language pair"}
        translations.append(translation)
    
    ##generer les silences
    for index,silent in enumerate(differences_timelines):
        #print(silent,get_wav_duration_pydub(os.getcwd() + translations[index]))
        silent_duration = silent  -  get_wav_duration_pydub(os.getcwd() + translations[index])
        generate_silent_audio(silent_duration*1000,index)
    
    

    # # create an empty audio segment
    combined = AudioSegment.empty()
    # # combine the mp3 files

    for index,file in enumerate(translations):
        audio = AudioSegment.from_wav(os.getcwd() + file) 
        if(index<len(translations)-1):
            audiosilent = AudioSegment.from_wav(os.getcwd() + '/vits/silents/' + str(index) + ".wav")
            combined += (audio + audiosilent)
        else:
            combined += audio
        
        #combined += (audio + audiosilent)

    directory_path = os.path.join(os.getcwd(), "vits/audios")
    combined.export(f"{os.path.join(directory_path,'combined.mp3')}", format="mp3")
    
    #return translations
    
    return "/vits/audios/combined.mp3"

# class DataForm(BaseModel):
#     video:UploadFile = File()


@app.post("/combine")
async def combine_video_and_audio(request : UrlRequest):
    url = request.url


    print(url)
    # Read the video file
    # video = request.video
    #video: request.video
   # print(request)
    # video_data = await video.read()
    # video_blob = io.BytesIO(video_data)
    # console.log(video_blob)
    # Send a GET request to the URL and get the content of the file
    directory_path = os.path.join(os.getcwd(), "vits/audios")

    response = requests.get(url)
    with open(os.path.join(directory_path,'video.mp4'), 'wb') as file:
         file.write(response.content)

    

   
    # # Read the audio file
    audio_clip = AudioFileClip(os.path.join(directory_path,'combined.mp3'))
    
    # video_clip = VideoFileClip(video_blob).set_audio(None)
    video_clip = VideoFileClip(os.path.join(directory_path,'video.mp4')).set_audio(None)
    
    
    final_clip = video_clip.set_audio(audio_clip)

    final_clip.write_videofile(os.path.join(directory_path,"output_file.mp4"))
    # # Write the combined video and audio to a file
    #final_clip.write_videofile(os.path.join(directory_path,'videocombined.mp3'))

    return "/vits/audios/output_file.mp4"


@app.delete("/finish")
async def delete_directory_contents():
    directory_path = os.path.join(os.getcwd(), "vits/audios")
    directory_path_2 = os.path.join(os.getcwd(), "vits/silents")
    print(directory_path)
    if os.path.exists(directory_path):
        [os.unlink(os.path.join(directory_path, filename)) for filename in os.listdir(directory_path) if os.path.isfile(os.path.join(directory_path, filename))]
    if os.path.exists(directory_path_2):
        [os.unlink(os.path.join(directory_path_2, filename)) for filename in os.listdir(directory_path_2) if os.path.isfile(os.path.join(directory_path_2, filename))]
    if(os.path.exists(directory_path) or os.path.exists(directory_path_2)):
        return {"message":"Finish done"}
    else:
        return{"message":"Directory does not exist"}


# @app.post("/audio/text")
# async def translate_audio(request: AudioTranslationRequest):
#     src = request.src
#     targ = request.targ
#     audio_file = await request.audio_file.read()

#     # Save the audio file to disk temporarily
#     with open("temp_audio_file.wav", "wb") as f:
#         f.write(audio_file)

#     # Transcribe the audio file to text
#     if src == "yoruba":
#         text = transcribe_yoruba_to_text("temp_audio_file.wav")
#     else:
#         # Implement transcription logic for other languages here
#         pass

#     # Translate the text to the target language
#     if src == "yoruba" and targ == "eng":
#         translation = translate_yoruba_to_eng(text)
#     elif src == "yoruba" and targ == "fr":
#         translation = translate_yoruba_to_fr(text)
#     elif src == "yoruba" and targ == "yoruba":
#         translation = translate_yoruba_to_yoruba(text)
#     elif src == "fr" and targ == "yoruba":
#         translation = translate_fr_to_yoruba(text)
#     elif src == "eng" and targ == "yoruba":
#         translation = translate_eng_to_yoruba(text)
#     elif src == "eng" and targ == "fon":
#         translation = translate_eng_to_fon(text)
#     elif src == "fr" and targ == "eng":
#         translation = translate_fr_to_eng(text)
#     elif src == "eng" and targ == "fr":
#         translation = translate_eng_to_fr(text)
#     elif src == "fr" and targ == "fon":
#         translation = translate_fr_to_fon(text)
#     else:
#         return {"error": "Unsupported language pair"}

#     # Delete the temporary audio file
#     os.remove("temp_audio_file.wav")

#     return {"translation": translation}


# @app.post("/audio/audio")
# async def translate_audio_audio(request: AudioTranslationRequest):
#     src = request.src
#     targ = request.targ
#     audio_file = await request.audio_file.read()

#     # Save the audio file to disk temporarily
#     with open("temp_audio_file.wav", "wb") as f:
#         f.write(audio_file)

#     # Load the audio file using librosa
#     y, sr = librosa.load("temp_audio_file.wav")

#     # Convert the audio file to the target language
#     if src == "yoruba" and targ == "yoruba":
#         converted_audio = convert_yoruba_to_yoruba(y)
#     elif src == "fon" and targ == "fon":
#         converted_audio = convert_fon_to_fon(y)
#     elif src == "eng" and targ == "fr":
#         converted_audio = convert_eng_to_fr(y)
#     elif src == "fr" and targ == "eng":
#         converted_audio = convert_fr_to_eng(y)
#     elif src == "eng" and targ == "eng":
#         converted_audio = convert_eng_to_eng(y)
#     elif src == "fr" and targ == "fr":
#         converted_audio = convert_fr_to_fr(y)
#     else:
#         return {"error": "Unsupported language pair"}

#     # Save the converted audio to a temporary file
#     sf.write("temp_converted_audio.wav", converted_audio, sr)

#     # Read the converted audio file into memory and return it as a response
#     with open("temp_converted_audio.wav", "rb") as f:
#         converted_audio_file = f.read()

#     # Delete the temporary audio files
#     os.remove("temp_audio_file.wav")
#     os.remove("temp_converted_audio.wav")

#     return {"converted_audio_file": converted_audio_file}
    





# @app.post("/texts/audios")
# async def translate_texts(request: TextTranslationArrayRequest):
#     translations = []
#     src = request.src
#     targ = request.targ
#     texts = request.texts
#     timelines = request.timelines
#     for txt_request in texts:
#         text = txt_request
#         if src == "eng" and targ == "yoruba":
#             translation = text_eng_to_yoruba(text)
#         elif src == "fr" and targ == "yoruba":
#             translation = text_fr_to_yoruba(text)
#         elif src == "yoruba" and targ == "yoruba":
#             translation = text_yoruba_to_yoruba(text)
#         else:
#             return {"error": "Unsupported language pair"}
#         translations.append(translation)
#     # create an empty audio segment
#     combined = AudioSegment.empty()
#     # combine the mp3 files
#     for file in translations:
#         audio = AudioSegment.from_wav(os.getcwd() + file)
   
#         combined += audio
#     directory_path = os.path.join(os.getcwd(), "vits/audios")
#     combined.export(f"{os.path.join(directory_path,'combined.mp3')}", format="mp3")
    
#     #return translations
#     return "/vits/audios/combined.mp3"