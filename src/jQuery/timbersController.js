import $ from "jquery";

let selectedPreset
let selectedPresetIndex = -1
let copyFromPresetIndex = -1

let selectedBin
let selectedBinIndex = -1
let copyFromBinIndex = -1

const HIGHLIGHT_COLOR = "#ddd"

const unhighlightTable = () => {
  $("#root_Customer > .form-group.field.field-array .row.array-item-list .array-item")
    .css('backgroundColor', 'transparent')
  $("[id='root_Customer_Hopping Presets__title']").parent()
    .css('backgroundColor', 'transparent')
}

const errorCheckPastedPresets = (presets) => {
  for(let x=0; x<presets.length; x++) {
    for(let y=0; y<presets[x].length; y++) {
      try {
        const preset = presets[x][y]
        if(isNaN(preset)) {
          return false
        }
        const integerPreset = parseInt(preset)
      } catch (e) {
        return false
      }
    }
  }
  return true;
}

const normalizeClipboardData = (clipboardData) =>
  clipboardData
    .trim()
    .replace(/\r/g, '')
    .replace(/,/g, ' ')
    .replace(/ +/g, '\t')
    .replace(/\t+/g, '\t')

export default (parentComponent) =>
  $("body")
    .on("copy", "[id='root_Customer_Hopping Presets__title']", (event) => {

      // COPY TABLE TO CLIPBOARD

      parentComponent.setState(prevState => {
        debugger
        // grab current presets from current state
        const data = prevState.formData.Customer['Hopping Presets']
        // transpose the presets
        const transposed = data[0].map((col, i) => data.map(row => row[i]));

        // create string of tab and new line separated presets
        let binsArray = []
        transposed.forEach(presetArray =>
          binsArray.push(presetArray.join("\t")))
        let tabSeparatedPresetValues = binsArray.join("\n");

        // put preset string in clip board
        event.originalEvent.clipboardData.setData('text/plain', tabSeparatedPresetValues);
        event.preventDefault();

        // return the same state. we're not actually changing state
        return prevState
      })
    })
    .on("copy", '#root_Customer > .form-group.field.field-array .row.array-item-list > .array-item legend', (event) => {

      // debugger

      // COPY PRESET COLUMN TO CLIPBOARD

      copyFromPresetIndex = selectedPreset.index()
      // iterate over input fields in selected preset
      const inputs = selectedPreset.find('input.form-control')
      let copiedValues = []
      for(let i=0; i<inputs.length; i++) {
        // grab the value of each input field and copy to array
        const value = parseInt($(inputs[i]).val())
        copiedValues.push(value || null)
        // $(inputs[i]).val(value)
      }
      // format presets into an new line separated string
      const stringValues = copiedValues.join("\n")

      // save preset column to clipboard
      event.originalEvent.clipboardData.setData('text/plain', stringValues);

      // stop event
      event.preventDefault();

    })
    .on("copy", "[id='root_Customer_Hopping Presets'] .array-item .array-item", (event) => {

      // COPY BIN ROW TO CLIPBOARD

      event.preventDefault();

      const $input = $(event.target)
      const $arrayItem = $($input.parents(".array-item")[0])
      copyFromBinIndex = $arrayItem.index()
      const $rowArrayItemList = $($arrayItem.parents('.row.array-item-list')[1])
      const $presetArrayItems = $rowArrayItemList.find("> .array-item")
      const $binsInputFields = $presetArrayItems.find(`.array-item:nth-child(${selectedBinIndex+1}) input`)

      let copiedValues = []
      for(let i=0; i<$binsInputFields.length; i++) {
        // grab the value of each input field and copy to array
        copiedValues.push(parseInt($($binsInputFields[i]).val()) || null)
      }
      // format presets into an new line separated string
      const stringValues = copiedValues.join("\t")

      // save preset column to clipboard
      event.originalEvent.clipboardData.setData('text/plain', stringValues);
    })
    .on("paste", "[id='root_Customer_Hopping Presets'] .array-item .array-item", (event) => {
      event.preventDefault();

      // PASTE TO BIN ROW

      // get presets from clipboard
      let clipboardData = event.originalEvent.clipboardData.getData('text/plain')
      clipboardData = normalizeClipboardData(clipboardData)

      const clipboardDataArray = clipboardData.split('\t')
      parentComponent.setState(prevState => {

        // get current presets
        let currentPresets = prevState.formData.Customer['Hopping Presets']
          .map(row => row.map(col => col))

        // update selected bin row with new presets
        for(let p=0; p<currentPresets.length; p++) {
          let presetArray = currentPresets[p]
          const presetIntValue = parseInt(clipboardDataArray[p])
          presetArray[selectedBinIndex] = presetIntValue ? presetIntValue : presetArray[selectedBinIndex]
          presetArray[copyFromBinIndex] = presetArray[selectedBinIndex]
          currentPresets[p] = presetArray
        }

        if(!errorCheckPastedPresets(currentPresets)) {
          return prevState
        }

        const newFormData = {
          ...prevState.formData,
          Customer: {
            "Hopping Presets": currentPresets
          }
        }

        const nextState = {
          ...prevState,
          formData: newFormData,
          past: [...prevState.past, newFormData]
        }

        return nextState
      })
    })
    .on("paste", "[id='root_Customer_Hopping Presets__title']", (event) => {

      // PASTE TO TABLE FROM CLIPBOARD

      // get data from clipboard and remove return char
      let clipboardData = event.originalEvent.clipboardData.getData('text/plain')
      clipboardData = normalizeClipboardData(clipboardData)

      // clipboardData =
      //    "1\t2\t3\t4\n
      //     5\t6\t7\t8\n
      //     9\t10\t11\t12"

      const rows = clipboardData.split('\n')
      // rows = [
      //    "1\t2\t3\t4",
      //    "5\t6\t7\t8",
      //    "9\t10\t11\t12"
      // ]

      const cols = rows.map(col => col.split('\t'))
      // cols = [
      //    ["1","2","3","4\r"],
      //    ["5","6","7","8\r"],
      //    ["9","10","11","12"]
      // ]"

      // transpose presets
      const newPresets = cols[0].map((col, i) => cols.map(row => row[i] ? row[i].replace("\r", "") : 0));

      event.preventDefault();
      parentComponent.setState(prevState => {

        // copy old presets
        let currentPresets = prevState.formData.Customer['Hopping Presets']
          .map(row => row.map(col => col))

        // truncate pasted data to size of current bins x presets
        const height = Math.min(newPresets.length, currentPresets.length)
        const width  = Math.min(newPresets[0].length, currentPresets[0].length)

        // overwrite with new presets
        for(let y=0; y<height; y++) {
          const newPreset = newPresets[y]
          for(let x=0; x<width; x++) {
            currentPresets[y][x] = parseInt(newPresets[y][x])
          }
        }

        if(!errorCheckPastedPresets(currentPresets)) {
          return prevState
        }

        const newFormData = {
          ...prevState.formData,
          Customer: {
            "Hopping Presets": currentPresets
          }
        }

        const nextState = {
          ...prevState,
          formData: newFormData,
          past: [...prevState.past, newFormData]
        }

        return ({
          formData: newFormData,
          past: [...prevState.past, newFormData ]
        })
      })
    })
    .on("paste", '#root_Customer > .form-group.field.field-array .row.array-item-list > .array-item legend', (event) => {

      // PASTE TO PRESET COLUMN

      // get data from clipboard
      let clipboardData = event.originalEvent.clipboardData.getData('text/plain')
      clipboardData = normalizeClipboardData(clipboardData)

      const rows = clipboardData.split('\n')

      // not needed ?
      const cols = rows.map(col => col.split('\t'))

      // transpose
      const newPresets = cols[0].map((col, i) => cols.map(row => row[i].replace("\r", "")));

      event.preventDefault();
      parentComponent.setState(prevState => {

        let currentPresets = prevState.formData.Customer['Hopping Presets']
          .map(row => row.map(col => col))

        // truncate pasted data to size of current bins x presets
        const height  = Math.min(newPresets[0].length, currentPresets[0].length)
        // overwrite new presets
        for(let x = 0; x < height; x++) {
          currentPresets[selectedPresetIndex][x] = parseInt(newPresets[0][x])
          currentPresets[copyFromPresetIndex][x] = parseInt(newPresets[0][x])
        }

        if(!errorCheckPastedPresets(currentPresets)) {
          return prevState
        }

        const newFormData = {
          ...prevState.formData,
          Customer: {
            "Hopping Presets": currentPresets
          }
        }

        const nextState = {
          ...prevState,
          formData: newFormData,
          past: [...prevState.past, newFormData]
        }

        return nextState
      })
    })
    .on('click', 'fieldset#root .form-group.field.field-array .row.array-item-list > .array-item legend', (event) => {

      // SELECT PRESET COLUMN

      // unhighlight other preset columns and whole table
      unhighlightTable()

      const $legend = $(event.currentTarget)
      selectedPreset = $($legend.parents('.array-item')[0])
      selectedPresetIndex = selectedPreset.index()

      // highlight preset column
      selectedPreset.css('backgroundColor', HIGHLIGHT_COLOR)
    })
    .on("click", "[id='root_Customer_Hopping Presets__title']", (event) => {

      // HIGHLIGHT TABLE
      unhighlightTable()

      // highlight table
      $(event.target).parent().css('backgroundColor', HIGHLIGHT_COLOR)

      parentComponent.setState(prevState => {
        return {
          selectedPresetIndex: -1,
          selectedBinIndex: -1,
          selectedTable: true
        }
      })
    })
    .on("click", "[id='root_Customer_Hopping Presets'] .array-item .array-item label", (event) => {
      // TODO: highlight bin row

      // unhighlight other preset columns and whole table
      unhighlightTable()

      const $label = $(event.target)
      const $arrayItem = $($label.parents('.array-item')[0])
      selectedBinIndex = $arrayItem.index()

      const $rowArrayItemList = $($arrayItem.parents('.row.array-item-list')[1])
      const $presetArrayItems = $rowArrayItemList.find("> .array-item")
      const $binsPresetArrayItems = $presetArrayItems.find(`.array-item:nth-child(${selectedBinIndex+1})`)
      // $binsPresetArrayItems.children().eq(selectedBinIndex).css('backgroundColor', 'lightgray')
      $binsPresetArrayItems.css('backgroundColor', HIGHLIGHT_COLOR)
    })
