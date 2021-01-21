function calculateTotalPercentage() {
  const allIngrPerc = document.getElementsByName("ingrPerc");
  let totalPercentage = 0;
  for (let i = 0; i < allIngrPerc.length; i++) {
    if (allIngrPerc[i].value !== "") {
      totalPercentage += parseFloat(allIngrPerc[i].value);
    }
  }
  document.getElementById("totalPercentage").innerText = totalPercentage + "%";
}

function calculateGrams(elIngrPerc) {
  const elTotalAmount = document.getElementById("totalAmount");
  const totalAmount = parseFloat(elTotalAmount.value);
  const percentage = parseFloat(elIngrPerc.value);

  const grams = (totalAmount * percentage) / 100;

  elIngrPerc.referenceToGrams.value = grams;
}

function ensureEmptyRow() {
  if (!hasEmptyRow()) {
    addEmptyRow();
  }
}

function hasEmptyRow() {
  const allIngrName = document.getElementsByName("ingrName");
  let emptyCount = 0;
  for (let i = 0; i < allIngrName.length; i++) {
    if (allIngrName[i].value === "") {
      emptyCount++;
    }
  }
  // 1 is expected to be coming from the template row
  return emptyCount > 1;
}

function addEmptyRow() {
  const templateRow = document.getElementById("templateRow");
  const newRow = templateRow.cloneNode(true);
  newRow.removeAttribute("id");
  newRow.style.display = "";
  newRow.setAttribute("name", "ingrRow");

  // Atrodam pogu jaunajā rindā.
  const deleteBtn = newRow.querySelector("button.btn-close");
  // Piešķiram pogai custom atribūtu "referenceToCurrentRow" ar norādi uz jauno rindu,
  //  lai nebūtu jāraksta "ugly" this.parentNode.parentNode vai sarežģītāk,
  //  ja/kad pārstrukturēs kodu.
  deleteBtn.referenceToCurrentRow = newRow;

  // Atrodam abus input elementus
  const ingrPerc = newRow.querySelector("input[name='ingrPerc']");
  const ingrGrams = newRow.querySelector("input[name='ingrGrams']");
  ingrPerc.referenceToGrams = ingrGrams;

  templateRow.parentNode.insertBefore(newRow, templateRow);

  // const table = document.getElementById("table");
  // const row = table.insertRow();
  // const cellIngrName = row.insertCell();
  // const cellPercent = row.insertCell();
  // const cellAmount = row.insertCell();
  // const cellPrice = row.insertCell();
  // const cellAction = row.insertCell();

  // const inputIngrName = document.createElement("input");
  // inputIngrName.name = "ingrName";
  // inputIngrName.type = "text";
  // inputIngrName.placeholder = "Ingredient name, e.g. SCI";
  // inputIngrName.addEventListener("input", ensureEmptyRow);
  // cellIngrName.appendChild(inputIngrName);
  // // cellIngrName.innerHTML = '<input name="ingrName" type="text" placeholder="Ingredient name, e.g. SCI" oninput="ensureEmptyRow()">';
  // cellPercent.innerHTML = "dsa";
  // cellAmount.innerHTML = "23e";
  // cellPrice.innerHTML = "13";
  // cellAction.innerHTML = "xxx";
}

function deleteRow(deleteBtn) {
  const row = deleteBtn.referenceToCurrentRow;
  row.remove();
  ensureEmptyRow();
}

ensureEmptyRow();

function onTotalAmountChange() {
  const allPercFields = document.querySelectorAll(
    "tr[name='ingrRow'] input[name='ingrPerc']"
  );
  for (let i = 0; i < allPercFields.length; i++) {
    calculateGrams(allPercFields[i]);
  }
}

// Event Listeners

document
  .getElementById("totalAmount")
  .addEventListener("input", onTotalAmountChange);
