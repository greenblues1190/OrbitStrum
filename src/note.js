const midiNotes = [
  ["A#2", "C3", "D3", "G3", "G3", "D3", "C3", "A#2"],
  ["A#2", "C3", "D3", "G3", "G3", "D3", "C3", "A#2"],
  ["A#2", "C3", "D3", "G3", "G3", "D3", "C3", "A#2"],
  ["A#2", "C3", "D3", "G3", "G3", "D3", "C3", "A#2"],
  ["A#2", "C3", "D3", "G3", "G3", "D3", "C3", "A#2"],
  ["A#2", "C3", "D3", "G3", "G3", "D3", "C3", "A#2"],
  ["A2", "A#2", "C3", "F3", "F3", "C3", "A#2", "A2"],
  ["G2", "A2", "A#2", "E3", "E3", "A#2", "A2", "G2"],
  ["F1", "C2", "A2", "F3", "D3", "A2", "C3", "F3"],
  ["F1", "C2", "A2", "F3", "D3", "A2", "C3", "F3"],
  ["D1", "A1", "D2", "F2", "A2", "C3", "E3", "C3"],
  ["A2", "F2", "A2", "C3", "G1", "D2", "G2", "A#2"],
  ["D1", "A1", "D2", "F2", "A2", "C3", "E3", "C3"],
  ["A2", "F2", "A2", "C3", "G1", "D2", "G2", "A#2"],
  ["C1", "G1", "E2", "G2", "A#2", "D3", "E3", "D3"],
  ["A#2", "D2", "A#2", "G2", "F1", "C2", "F2", "A2"],
  ["A1", "E2", "A2", "E2", "D2", "A2", "F2", "D2"],
  ["G1", "F2", "G2", "A#2", "C1", "G1", "E2", "A#2"],
  ["F0", "F1", "C2", "D#2", "G2", "A2", "C3", "D#3"],
  ["G3", "D#3", "C3", "A2", "G2", "D#2", "C2", "F1"],
  ["F0", "F1", "C2", "D#2", "G2", "A2", "C3", "D#3"],
  ["G3", "D#3", "C3", "A2", "G2", "D#2", "C2", "F1"],
  ["A#0", "F1", "A#2", "D2", "F2", "A#2", "D3", "F3"],
  ["D3", "A#2", "F2", "D2", "A#1", "F1", "A#0", "F1"],
  ["A#0", "F1", "A#2", "D2", "F2", "A#2", "D3", "F3"],
  ["D3", "A#2", "F2", "D2", "A#1", "F1", "A#0", "F1"],
  ["G0", "G1", "C#2", "F2", "A2", "C#3", "F3", "A3"],
  ["G1", "D2", "F2", "A2", "D3", "A2", "F2", "D2"],
  ["G0", "G1", "C#2", "F2", "A2", "C#3", "F3", "A3"],
  ["G1", "D2", "F2", "A2", "D3", "A2", "F2", "D2"],
  ["G1", "D2", "F2", "A2", "D3", "A2", "F2", "D2"],
  ["G1", "D2", "F2", "A2", "B2", "A2", "G2", "F2"],
  ["C1", "G1", "C2", "E2", "G2", "C3", "E3", "G3"],
  ["C4", "E4", "G4", "C5", "G4", "E4", "C4", "G3"],
];

function createNoteNumTable() {
  let root;
  let noteNumTable = [];
  for (let oct = 0; oct < 8; ++oct) {
    noteNumTable[oct] = [];
    root = 12 * (oct + 2);
    noteNumTable[oct]["C"] = root;
    noteNumTable[oct]["C#"] = root + 1;
    noteNumTable[oct]["D"] = root + 2;
    noteNumTable[oct]["D#"] = root + 3;
    noteNumTable[oct]["E"] = root + 4;
    noteNumTable[oct]["F"] = root + 5;
    noteNumTable[oct]["F#"] = root + 6;
    noteNumTable[oct]["G"] = root + 7;
    noteNumTable[oct]["G#"] = root + 8;
    noteNumTable[oct]["A"] = root + 9;
    noteNumTable[oct]["A#"] = root + 10;
    noteNumTable[oct]["B"] = root + 11;
  }

  return noteNumTable;
}

const noteNumTable = createNoteNumTable();

function noteToNum(note) {
  if (!note) return 0;
  const regexp = /([A-G]#?)(\d)/;
  parsedNote = regexp.exec(note);
  let key = parsedNote[1];
  let oct = parsedNote[2];
  return noteNumTable[oct][key];
}

function changeMelody(chordIndex) {
  lineList.map((line, index) => {
    note = midiNotes[chordIndex][index];
    line.changeNote(noteToNum(note));
  });
}
