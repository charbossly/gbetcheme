import os
import subprocess
import locale
locale.getpreferredencoding = lambda: "UTF-8"

def download(lang, tgt_dir="./"):
  lang_fn, lang_dir = os.path.join(tgt_dir, lang+'.tar.gz'), os.path.join(tgt_dir, lang)
  cmd = ";".join([
        f"wget https://dl.fbaipublicfiles.com/mms/tts/{lang}.tar.gz -O {lang_fn}",
        f"tar zxvf {lang_fn}"
  ])
  print(f"Download model for language: {lang}")
  subprocess.check_output(cmd, shell=True)
  print(f"Model checkpoints in {lang_dir}: {os.listdir(lang_dir)}")
  return lang_dir

LANG = "yor"
ckpt_dir = download(LANG)
print(f"Done")