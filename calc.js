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
  newRow.setAttribute("name", "ingrRow");
  templateRow.parentNode.insertBefore(newRow, templateRow);
}
function onDeleteBtnClick(deleteBtn, event) {
  event.preventDefault();
  event.stopPropagation();
  deleteRow(deleteBtn);
  recalculateForm();
}

function deleteRow(deleteBtn) {
  const row = deleteBtn.closest("*[name='ingrRow']");
  row.remove();
  ensureEmptyRow();
}

function recalculateForm() {
  const fieldTotalAmount = document.getElementById("totalAmount");
  const totalAmount = parseInt(fieldTotalAmount.value);
  if (isNaN(totalAmount) || totalAmount <= 0) {
    fieldTotalAmount.classList.add("is-invalid");
  } else {
    fieldTotalAmount.classList.remove("is-invalid");
  }

  const ingrRows = document.querySelectorAll("*[name='ingrRow']");
  let totalPercentage = 0;
  let totalPrice = 0;
  for (let i = 0; i < ingrRows.length; i++) {
    const row = ingrRows[i];

    const percent = parseFloat(row.querySelector("input[name='ingrPerc']").value);
    if (!isNaN(percent)) {
      const fieldIngrPercPrint = row.querySelector("*[name='ingrPercPrint']");
      fieldIngrPercPrint.innerText = `${percent}%`;

      totalPercentage += percent;
      if (!isNaN(totalAmount)) {
        const gramsField = row.querySelector("input[name='ingrGrams']");
        const grams = (totalAmount * percent) / 100;
        gramsField.value = grams;
        const ingrPrice = parseFloat(row.querySelector("input[name='ingrPrice']").value);
        const cost = (grams / 1000) * ingrPrice;
        if (!isNaN(cost)) {
          totalPrice += cost;
        }
      }
    }
  }

  const fieldTotalPercentage = document.getElementById("totalPercentage");
  fieldTotalPercentage.classList.remove("is-invalid");
  if (totalPercentage < 100) {
    fieldTotalPercentage.classList.add("is-invalid");
  } else if (totalPercentage > 100) {
    fieldTotalPercentage.classList.add("is-invalid");
  }
  fieldTotalPercentage.value = totalPercentage + "%";
  document.getElementById("totalPrice").value = totalPrice.toFixed(2);
}

function clearForm(event) {
  event.preventDefault();
  event.stopPropagation();

  const confirmation = confirm("Are you sure?");
  if (confirmation) {
    const allDeleteButtons = document.querySelectorAll("*[name='ingrRow'] button[name='btnDeleteRow']");
    for (let i = 0; i < allDeleteButtons.length; i++) {
      deleteRow(allDeleteButtons[i]);
    }

    document.getElementById("recipeForm").reset();
    const fieldTotalPercentage = document.getElementById("totalPercentage");
    fieldTotalPercentage.classList.remove("is-invalid");

    const fieldTotalAmount = document.getElementById("totalAmount");
    fieldTotalAmount.classList.remove("is-invalid");
  }
}

function fillPrice(fieldIngrName) {
  const row = fieldIngrName.closest("*[name='ingrRow']");
  row.classList.remove("d-print-none");

  const ingrName = fieldIngrName.value;
  let selectedIngr = undefined;
  for (let i = 0; i < INGREDIENT_DATA.length; i++) {
    if (ingrName === INGREDIENT_DATA[i].name) {
      selectedIngr = INGREDIENT_DATA[i];
    }
  }
  if (selectedIngr !== undefined) {
    const fieldIngrPrice = row.querySelector("input[name='ingrPrice']");
    fieldIngrPrice.value = selectedIngr.price;
  }
}

function preloadIngrList() {
  const ingrDatalist = document.getElementById("ingrList");
  INGREDIENT_DATA.forEach(ingr => {
    var option = document.createElement('option');
    option.value = ingr.name;
    ingrDatalist.appendChild(option);
  });
}

// Event Listeners

document.getElementById("totalAmount").addEventListener("input", recalculateForm);
document.getElementById("clearAll").addEventListener("click", clearForm);


// on load
ensureEmptyRow();
preloadIngrList();

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});
