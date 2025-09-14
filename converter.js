// ここからコードを書いてください
function setupConverter() {
  // HTML要素の取得
  const converterForm = document.querySelector(".converter-form");
  const converterInput = document.querySelector(".converter-input");
  const converterFrom = document.querySelector(".converter-from");
  const converterTo = document.querySelector(".converter-to");
  const converterResult = document.querySelector(".converter-result");

  // option要素の定義
  const lengthUnit = [
    { name: "meter", base: 1 },
    { name: "kilometer", base: 1000 },
    { name: "centimeter", base: 0.01 },
    { name: "millimeter", base: 0.001 },
    { name: "inch", base: 0.0254 },
    { name: "foot", base: 0.3048 },
    { name: "yard", base: 0.9144 },
    { name: "mile", base: 1609.344 },
  ];

  // converterFromへのoption追加
  lengthUnit.forEach((unit) => {
    const option = document.createElement("option");
    option.textContent = unit.name;
    option.value = unit.base;

    converterFrom.appendChild(option);
  });
  // converterToへのoption追加
  lengthUnit.forEach((unit) => {
    const option = document.createElement("option");
    option.textContent = unit.name;
    option.value = unit.base;

    converterTo.appendChild(option);
  });
  // option要素の初期値設定
  converterFrom.selectedIndex = 0;
  converterTo.selectedIndex = 1;
  // 換算
  function calculation() {
    const number = parseFloat(converterInput.value);
    const from = parseFloat(converterFrom.value);
    const to = parseFloat(converterTo.value);
    // Fromの単位取得
    const fromIndex = converterFrom.selectedIndex;
    const fromOption = converterFrom.options[fromIndex];
    const fromText = fromOption.textContent;

    // Toの単位取得
    const toIndex = converterTo.selectedIndex;
    const toOption = converterTo.options[toIndex];
    const toText = toOption.textContent;

    console.log(number);
    console.log(from);
    console.log(to);

    if (isNaN(number)) {
      converterResult.textContent = "Please enter a valid number";
      return;
    }
    const ans = (number * from) / to;
    const fixedAns = ans.toFixed(3);

    converterResult.textContent = `${number} ${fromText} = ${fixedAns} ${toText}`;
  }
  calculation();
  converterInput.addEventListener("input", calculation);
  converterFrom.addEventListener("change", calculation);
  converterTo.addEventListener("change", calculation);
}

export default setupConverter;
