let arr = [];
const output = document.querySelector(".result");
const sortBtn = document.querySelector(".sort-action");
const resetBtn = document.querySelector(".reset-action");
const numberD = document.querySelector(".number");
let audioCtx = null;

function reset() {
  for (let i = 0; i < 10; i++) {
    arr[i] = Math.random().toFixed(2);
  }
}

reset();

function playNote(freq) {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext)();
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0;
    osc.connect(node);
    node.connect(audioCtx.destination);
  }
}

generateBars(arr);

function insertSort(newArr) {
  let active = [];
  let tracker = {
    i: null,
    j: null,
    swap: false,
    value: null,
  };
  for (let i = 1; i < newArr.length; i++) {
    let current = arr[i];
    let prev = i - 1;
    while (prev >= 0 && newArr[prev] > current) {
      newArr[prev + 1] = newArr[prev];
      let newT = {
        ...tracker,
        i,
        j: prev,
        insert: false,
      };
      active.push(newT);
      prev--;
    }
    let newT2 = {
      ...tracker,
      i,
      j: prev,
      insert: true,
      value: current,
    };
    active.push(newT2);
    newArr[prev + 1] = current;
  }
  return active;
}

sortBtn.addEventListener("click", () => {
  const copy = [...arr];
  const active = insertSort(copy);
  animate(active);
});

function animate(active) {
  let { i, j, insert, value } = active.shift();

  if (insert) {
    playNote(200 + arr[i] * 500);
    arr[j + 1] = value;
  } else {
    playNote(200 + arr[j] * 500);
    arr[j + 1] = arr[j];
  }

  const isActive = active.length > 0 ? true : false;
  generateBars([i, j, isActive]);
  setTimeout(function () {
    animate(active);
  }, 200);
}

resetBtn.addEventListener("click", () => {
  reset();
  generateBars();
});

function generateBars(active = null) {
  output.innerHTML = "";
  arr.forEach((value, i) => {
    let elem = document.createElement("div");
    elem.style.height = Math.floor(value * 90) + "%";
    elem.className = "bar";
    elem.innerHTML = Math.floor(value * 90) + "%";

    if (active && active[1] == i) {
      elem.style.backgroundColor = "blueviolet";
    }

    if (active && active[0] == i) {
      elem.style.backgroundColor = "#e91e63";
      elem.style.marginBottom = 0;
      elem.style.marginBottom = "-20px";
    }
    if (active && !active[2]) {
      elem.style.marginBottom = "0px";
    }
    output.appendChild(elem);
  });
}
