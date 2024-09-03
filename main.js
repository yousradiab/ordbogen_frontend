import { getEntryAt, getSizes } from "./rest.js";

window.addEventListener("load", start);

let count = 0;
let startTime;
let endTime;
async function start() {
  document.querySelector("form").addEventListener("submit", recieveInput);
}

async function binarySearch(searchTerm) {
  const values = await getSizes();
  let min = values.min;
  let max = values.max;
  console.log(min);
  console.log(max);

  while (min <= max) {
    count++;
    let middle = Math.floor((min + max) / 2);
    const entry = await getEntryAt(middle);
    let comp = searchTerm.localeCompare(entry.inflected);
    if (comp === 0) {
      return entry;
    } else if (comp > 0) {
      min = middle + 1;
    } else {
      max = middle - 1;
    }
  }
  return -1;
}

function stringcomparefunction(a, b) {
  return a.localeCompare(b);
}

function compare(a, b) {
  return a - b;
}

function recieveInput(event) {
  startTime = performance.now();

  event.preventDefault();
  const form = event.target;
  const input = form.input.value;
  console.log(input);
  displayEntry(input);
}

async function displayEntry(input) {
  const entry = await binarySearch(input);
  endTime = performance.now();

  if (entry === -1) {
    document.querySelector("#output").innerHTML = "";
    document.querySelector("#output").insertAdjacentHTML(
      "beforeend",
      `   <p>Server request: ${count}</p>
          <p>Request tid: ${(endTime - startTime).toFixed(2)} ms</p>
          <p>Ordet findes ikke</p>
           `
    );
  } else {
    document.querySelector("#output").innerHTML = "";
    document.querySelector("#output").insertAdjacentHTML(
      "beforeend",
      `   <p>Server request: ${count}</p>
          <p>Bøjningsform: ${entry.inflected}</p>
          <p>Opslagsord: ${entry.headword}</p>
          <p>Ordklasse: ${entry.partofspeech}</p>
          <p>Id: ${entry.id}</p>
          <p>Request tid: ${(endTime - startTime).toFixed(2)} ms</p>
           `
    );
    count = 0;
  }
}
