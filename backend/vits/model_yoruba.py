from IPython.display import Audio
import os
import re
import glob
import json
import tempfile
import math
import torch
from torch.nn import functional as F
from torch.utils.data import DataLoader
import numpy as np
from . import commons
import argparse
import subprocess
from . import utils
import torchvision
import io
import librosa
from fastapi.responses import Response
import wave
import base64
import scipy.io.wavfile as wavfile
import requests
import uuid


#from data_utils import TextAudioLoader, TextAudioCollate, TextAudioSpeakerLoader, TextAudioSpeakerCollate
from .models import SynthesizerTrn
from scipy.io.wavfile import write


def file_exists(relative_path):
    return os.path.isfile(relative_path)

ckpt_dir = "./vits/yor"
LANG = "yor"

def preprocess_char(text, lang=None):
    """
    Special treatement of characters in certain languages
    """
    print(lang)
    if lang == 'ron':
        text = text.replace("ț", "ţ")
    return text

class TextMapper(object):
    def __init__(self, vocab_file):
        self.symbols = [x.replace("\n", "") for x in open(vocab_file, encoding="utf-8").readlines()]
        self.SPACE_ID = self.symbols.index(" ")
        self._symbol_to_id = {s: i for i, s in enumerate(self.symbols)}
        self._id_to_symbol = {i: s for i, s in enumerate(self.symbols)}

    def text_to_sequence(self, text, cleaner_names):
        '''Converts a string of text to a sequence of IDs corresponding to the symbols in the text.
        Args:
        text: string to convert to a sequence
        cleaner_names: names of the cleaner functions to run the text through
        Returns:
        List of integers corresponding to the symbols in the text
        '''
        sequence = []
        clean_text = text.strip()
        for symbol in clean_text:
            symbol_id = self._symbol_to_id[symbol]
            sequence += [symbol_id]
        return sequence

    def uromanize(self, text, uroman_pl):
        iso = "xxx"
        with tempfile.NamedTemporaryFile() as tf, \
             tempfile.NamedTemporaryFile() as tf2:
            with open(tf.name, "w") as f:
                f.write("\n".join([text]))
            cmd = f"perl " + uroman_pl
            cmd += f" -l {iso} "
            cmd +=  f" < {tf.name} > {tf2.name}"
            os.system(cmd)
            outtexts = []
            with open(tf2.name) as f:
                for line in f:
                    line =  re.sub(r"\s+", " ", line).strip()
                    outtexts.append(line)
            outtext = outtexts[0]
        return outtext

    def get_text(self, text, hps):
        text_norm = self.text_to_sequence(text, hps.data.text_cleaners)
        if hps.data.add_blank:
            text_norm = commons.intersperse(text_norm, 0)
        text_norm = torch.LongTensor(text_norm)
        return text_norm

    def filter_oov(self, text):
        val_chars = self._symbol_to_id
        txt_filt = "".join(list(filter(lambda x: x in val_chars, text)))
        print(f"text after filtering OOV: {txt_filt}")
        return txt_filt

def preprocess_text(txt, text_mapper, hps, uroman_dir=None, lang=None):
    txt = preprocess_char(txt, lang=lang)
    is_uroman = hps.data.training_files.split('.')[-1] == 'uroman'
    if is_uroman:
        with tempfile.TemporaryDirectory() as tmp_dir:
            if uroman_dir is None:
                cmd = f"git clone git@github.com:isi-nlp/uroman.git {tmp_dir}"
                print(cmd)
                subprocess.check_output(cmd, shell=True)
                uroman_dir = tmp_dir
            uroman_pl = os.path.join(uroman_dir, "bin", "uroman.pl")
            print(f"uromanize")
            txt = text_mapper.uromanize(txt, uroman_pl)
            print(f"uroman text: {txt}")
    txt = txt.lower()
    txt = text_mapper.filter_oov(txt)
    return txt

if torch.cuda.is_available():
    device = torch.device("cuda")
else:
    device = torch.device("cpu")

print(f"Run inference with {device}")
vocab_file = f"{ckpt_dir}/vocab.txt"
print(vocab_file)
config_file = f"{ckpt_dir}/config.json"
assert os.path.isfile(config_file), f"{config_file} doesn't exist"
hps = utils.get_hparams_from_file(config_file)
text_mapper = TextMapper(vocab_file)
net_g = SynthesizerTrn(
    len(text_mapper.symbols),
    hps.data.filter_length // 2 + 1,
    hps.train.segment_size // hps.data.hop_length,
    **hps.model)
net_g.to(device)
_ = net_g.eval()

# if file_exists('./vits/yor/G_100000.pth'):
#     print("File exists.")
# else:
#     # Send a request to the download URL
#     response = requests.get("https://drive.usercontent.google.com/download?id=1gtp6JdblyslLt0ObLTHwWIAUQNSqNWk1&export=download&authuser=0&confirm=t&uuid=73875bbe-9d5e-4f1c-9dde-4f4a4b37daa2&at=APZUnTXIrEvJ0FlBsPMdkud3pYHq%3A1715698646390", stream=True)

#     # Get the file name from the response headers
#     file_name = response.headers.get('Content-Disposition').split('filename=')[-1]

#     # Open a file for writing in binary mode
#     with open(file_name, 'wb') as file:
#         # Iterate over the response object in chunks and write to the file
#         for chunk in response.iter_content(chunk_size=1024):
#             if chunk:
#                 file.write(chunk)

#     print(f'File "{file_name}" downloaded successfully.')
    



# g_pth = "https://drive.google.com/file/d/1gtp6JdblyslLt0ObLTHwWIAUQNSqNWk1/view?usp=sharing"

# URL = 'https://drive.google.com/file/d/xxxxxxxxx/view?usp=share_link'
# download(URL, './model/tf_gpt2_model')

g_pth = f"{ckpt_dir}/G_100000.pth"
print(f"load {g_pth}")

_ = utils.load_checkpoint(g_pth, net_g, None)

#txt = "Ọmọ ẹgbẹ́ òkùnkùn dèrò àtìmọ́lé torí nílùú Ìbàdàn."

#print(f"text: {txt}")
# txt = preprocess_text(txt, text_mapper, hps, lang=LANG)
# stn_tst = text_mapper.get_text(txt, hps)
# with torch.no_grad():
#     x_tst = stn_tst.unsqueeze(0).to(device)
#     x_tst_lengths = torch.LongTensor([stn_tst.size(0)]).to(device)
#     hyp = net_g.infer(
#         x_tst, x_tst_lengths, noise_scale=.667,
#         noise_scale_w=0.8, length_scale=1.0
#     )[0][0,0].cpu().float().numpy()

# print(f"Generated audio")
# # Generate or process the audio file
# audio_data = Audio(hyp, rate=hps.data.sampling_rate)

def text_to_audio(txt):
    txt = preprocess_text(txt, text_mapper, hps, lang=LANG)
    stn_tst = text_mapper.get_text(txt, hps)
    with torch.no_grad():
        x_tst = stn_tst.unsqueeze(0).to(device)
        x_tst_lengths = torch.LongTensor([stn_tst.size(0)]).to(device)
        hyp = net_g.infer(
            x_tst, x_tst_lengths, noise_scale=.667,
            noise_scale_w=0.8, length_scale=1.0
        )[0][0,0].cpu().float().numpy()

    filename = uuid.uuid4()

    wavfile.write(f"./vits/audios/{filename}generated_audio.wav",hps.data.sampling_rate, hyp)  

    
    # Generate or process the audio file

    # def create_audio_blob(hyp, rate):
    #     # Créer un objet mémoire pour stocker les données audio
    #     audio_buffer = io.BytesIO()
        
    #     # Ouvrir un fichier audio en mode écriture
    #     with wave.open(audio_buffer, 'wb') as wf:
    #         # Définir les paramètres audio
    #         wf.setnchannels(1)  # Nombre de canaux (mono)
    #         wf.setsampwidth(2)  # Largeur d'échantillon en octets (16 bits = 2 octets)
    #         wf.setframerate(rate)  # Taux d'échantillonnage

    #         # Écrire les données audio dans le fichier
    #         wf.writeframes(hyp.astype('int16').tobytes())

    #     # Récupérer les données du buffer
    #     audio_data = audio_buffer.getvalue()

    #     # Encoder les données audio en base64 pour le transfert via API
    #     audio_base64 = base64.b64encode(audio_data).decode()

    #     return audio_base64

    # rate = 44100
    # audio_blob = create_audio_blob(hyp, rate)
    # print(audio_blob) 
    
    # Audio(hyp, rate=hps.data.sampling_rate)
    # # Convert the blob to a file-like object
    # # Convert the audio data to a bytes-like object
    # audio_blob = librosa.core.audio.to_wav(audio_data)
    # audio_file = io.BytesIO(audio_blob)
    # audio_data = hyp.astype(np.int16)  # Convert to int16 if it's not
    # audio_bytes = audio_data.tobytes()  # Convert to bytes
    #return  Response(content=audio_bytes, media_type="audio/wav")
    return f"/vits/audios/{filename}generated_audio.wav"