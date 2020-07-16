import $ from 'jquery'

const highlight = ($element) => {
  $element.css("backgroundColor", "#ddd")
  unhighlightSiblings($element)
}
const unhighlightSiblings = ($element) => {
  $element
    .siblings()
    .css("backgroundColor", "transparent")
}

export default (component) => {
  $("body")
    // .on("click", "#root_Customer > .form-group.field.field-array .row.array-item-list > .array-item", (event) => {
    .on("click", "[id='root_Customer_Hopping Presets'] > .row.array-item-list > .array-item", (event) => {
      // this.arrayItemList.find('.array-item').css('backgroundColor', 'transparent')
      event.preventDefault()
      const $presetColumn = $(event.currentTarget)
      highlight($presetColumn)
      component.setState(prevState => ({
        ...prevState,
        selectedPresetIndex: $presetColumn.index()
      }))
    })
    .on("click", "[id='root_Customer_Hopping Presets'] > .row.array-item-list > .array-item:first-child > .col-xs-9 > .form-group.field.field-array > .field.field-array.field-array-of-integer > .row.array-item-list > .array-item", (event) => {
      alert('row')
      event.preventDefault()
      const $bin = $(event.currentTarget)
      component.setState(prevState => ({
        ...prevState,
        selectedPresetIndex: $bin.index()
      }))
    })
}
