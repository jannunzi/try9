import React from "react";
import Form from "react-jsonschema-form";
import $ from 'jquery'
import {fields, widgets, ArrayFieldTemplate} from "./customizations";
import './styles.css'
import timbersController from "../../jQuery/timbersController";

export default class ConfigurationFormEditor extends React.Component {
    state = {
        schema: this.props.schema,
        configuration: this.props.configuration,
        uiSchema: this.props.uiSchema,
        selectedBinIndex: -1,
        selectedPresetIndex: -1,
        selectedPresetTable: false,
    }

    hoppingPresets;
    arrayItemList;
    selectedPreset;
    copiedValues = [];

    componentDidMount = () => {

        timbersController(this)

        this.arrayItemList = $('#root_Customer > .form-group.field.field-array .row.array-item-list')

        $("[id='root_Customer_Hopping Presets__title']")
          .click(() => {
              console.log('select all')
          })
        $(document).on('keypress', (e) => {
            if(e.charCode === 3 && e.ctrlKey) {
                const inputs = this.selectedPreset.find('input.form-control')
                this.copiedValues = []
                for(let i=0; i<inputs.length; i++) {
                    const $input = $(inputs[i])
                    this.copiedValues.push($input.val())
                }
            } else if(e.charCode === 22 && e.ctrlKey) {
                const inputs = this.selectedPreset.find('input.form-control')
                for(let i=0; i<inputs.length; i++) {
                    const $input = $(inputs[i])
                    $input.val(this.copiedValues[i])
                }
            }
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.schema !== this.props.schema || prevProps.configuration !== this.props.configuration) {
            this.setState({
                schema: this.props.schema,
                configuration: this.props.configuration
            })
        }
    }

    clearBinRow = () => {
        alert('clear bin row')
    }

    clearPresetColumn = () => {
        alert('clear preset column')
    }

    clearAllPresets = () => {
        alert('clear all presets')
    }

    undo = () => {
        alert('undo')
    }

    render() {
        return(
            <div>
                <Form className="margin-right-15px"
                      schema={this.state.schema}
                      formData={this.state.configuration}
                      uiSchema={this.state.uiSchema}
                  // FieldTemplate={this.CustomFieldTemplate}
                    // ArrayFieldTemplate={this.ArrayFieldTemplate}
                      fields={fields}
                      widgets={widgets}
                      onChange={() => {}}
                      onSubmit={this.props.onSubmit}
                      onError={() => {}} />
                      {/*<div className="mks-position-fixed mks-top-50px mks-right-50px">*/}
                      {/*    <button*/}
                      {/*      onClick={this.undo}*/}
                      {/*      className="btn btn-danger mks-margin-left-5px">*/}
                      {/*        Undo*/}
                      {/*    </button>*/}
                      {/*    <button*/}
                      {/*      onClick={this.clearBinRow}*/}
                      {/*      className="btn btn-danger mks-margin-left-5px">*/}
                      {/*        Clear Bin Row*/}
                      {/*    </button>*/}
                      {/*    <button*/}
                      {/*      onClick={this.clearPresetColumn}*/}
                      {/*      className="btn btn-danger mks-margin-left-5px">*/}
                      {/*        Clear Preset Column*/}
                      {/*    </button>*/}
                      {/*    <button*/}
                      {/*      onClick={this.clearAllPresets}*/}
                      {/*      className="btn btn-danger mks-margin-left-5px">*/}
                      {/*        Clear All Presets {this.state.selectedPresetIndex}*/}
                      {/*    </button>*/}
                      {/*</div>*/}
            </div>
        )
    }
}
