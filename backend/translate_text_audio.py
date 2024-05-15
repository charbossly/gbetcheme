from translate_text_text  import translate_fr_to_yoruba,translate_eng_to_yoruba
from vits.model_yoruba  import text_to_audio


def text_fr_to_yoruba(text : str) -> str:
    result = text_to_audio(translate_fr_to_yoruba(text))
    return result

def text_eng_to_yoruba(text: str) -> str:
    result = text_to_audio(translate_eng_to_yoruba(text))
    return result

def text_yoruba_to_yoruba(text: str) -> str:
    result = text_to_audio(text)
    return result

# def text_to_audio_yoruba(text: str) -> str:
#     result = text_to_audio(translate_fr_to_yoruba(text))
#     return result
