let translate_text = document.getElementById("translate_text");
let undo_text = document.getElementById("undo_text");
let target_language = document.getElementById("target_language");

function save() {
  chrome.storage.sync.set(
    {
      translate_text: translate_text.value,
      undo_text: undo_text.value,
      target_language: target_language.value,
    },
    () => {}
  );
}

function load() {
  // chrome.storage.sync.get({translate_text: "traduire",
  //                               undo_text: "retour",
  //                         target_language: navigator.language || navigator.userLanguage}, items => {
  // 	translate_text.value = items.translate_text;
  // 	undo_text.value = items.undo_text;
  // 	target_language.value = items.target_language;
  // });
  chrome.storage.sync.get(
    {
      translate_text: "traduire",
      undo_text: "retour",
      target_language: "yoruba",
    },
    (items) => {
      translate_text.value = items.translate_text;
      undo_text.value = items.undo_text;
      target_language.value = items.target_language;
    }
  );
}

document.addEventListener("DOMContentLoaded", load);
document.getElementById("save").addEventListener("click", save);
