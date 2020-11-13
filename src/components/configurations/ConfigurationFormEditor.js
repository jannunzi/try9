import React from "react";
import Form from "react-jsonschema-form";
import $ from 'jquery'
import './styles.css'
import timbersController from "../../jQuery/timbersController";

export default class ConfigurationFormEditor extends React.Component {
    state = {
        formData: this.props.configuration,
        present: this.props.configuration,
        past: [],
        isFormDirty: true,

        schema: this.props.schema,
        // configuration: this.props.configuration,
        uiSchema: this.props.uiSchema,
        selectedBinIndex: -1,
        selectedPresetIndex: -1,
        selectedPresetTable: false,
    }

    arrayItemList;
    selectedPreset;

    componentDidMount = () => {

        timbersController(this)

        this.arrayItemList = $('#root_Customer > .form-group.field.field-array .row.array-item-list')
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.schema !== this.props.schema || prevProps.configuration !== this.props.configuration) {
            this.setState({
                schema: this.props.schema,
                formData: this.props.configuration
            })
        }
    }

    render() {
        return(
            <div>
                <Form schema={this.state.schema}
                      formData={this.state.formData}
                      uiSchema={this.state.uiSchema}
                      noHtml5Validate={true}
                      className="margin-right-15px"
                      onChange={() => {}}
                      onSubmit={this.props.onSubmit}
                      onError={() => {}} />
            </div>
        )
    }
}
