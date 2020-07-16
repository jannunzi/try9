import React from "react";
import Form from "react-jsonschema-form"
import ReactJson from "react-json-view";

import s2 from '../schemas/driveControllerGenesis.json'
// import s21 from '../schemas/driveController.json'

import s3 from '../schemas/mainController.json'
// import s14 from '../schemas/gainScheduler.json'

import s10 from '../schemas/frequencyControllerEsc.json'
// import s6 from '../schemas/frequencyController.json'

import s16 from '../schemas/railControllerPulse.json'
import s12 from '../schemas/railController.json'

import s1 from '../schemas/Broadcast.json'
import s4 from '../schemas/pulseController.json'
import s5 from '../schemas/backPorchPortExpander.json'
import s7 from '../schemas/mainHilbertViSensor.json'
import s8 from '../schemas/railCal.json'
import s9 from '../schemas/complexVoltageSensor.json'
import s11 from '../schemas/mainHilbertViSensorCal.json'
// import s13 from '../schemas/complexVoltageSensorCal.json'
import s15 from '../schemas/meterCalData.json'
import s17 from '../schemas/driveCal.json'
import s18 from '../schemas/globalConfigs.json'
import s19 from '../schemas/meterConfig.json'
import s20 from '../schemas/timbersController.json'
import s22 from '../schemas/hardwareManager.json'
import s23 from '../schemas/pfsController.json'
import s24 from '../schemas/tlcConfig.json'

// import d2 from '../data/driveControllerGenesis.json'
// // import d21 from '../data/driveController.json'
//
// import d3 from '../data/mainController.json'
// // import d14 from '../data/gainScheduler.json'
//
// import d10 from '../data/frequencyControllerEsc.json'
// // import d6 from '../data/frequencyController.json'
//
// import d16 from '../data/railControllerPulse.json'
// import d12 from '../data/railController.json'
//
// import d1 from '../data/Broadcast.json'
// import d4 from '../data/pulseController.json'
// import d5 from '../data/backPorchPortExpander.json'
// import d7 from '../data/mainHilbertViSensor.json'
// import d8 from '../data/railCal.json'
// import d9 from '../data/complexVoltageSensor.json'
// import d11 from '../data/mainHilbertViSensorCal.json'
// // import d13 from '../data/complexVoltageSensorCal.json'
// import d15 from '../data/meterCalData.json'
// import d17 from '../data/driveCal.json'
// import d18 from '../data/globalConfigs.json'
// import d19 from '../data/meterConfig.json'
// import d20 from '../data/timbersController.json'
// import d22 from '../data/hardwareManager.json'
// import d23 from '../data/pfsController.json'
// import d24 from '../data/tlcConfig.json'

import {BrowserRouter as Router, Link} from "react-router-dom";

const schemas = [
    // s2, s3, s10, s16, s13, s21,s6,s14,
    s1, s4, s5, s7, s8, s9, s11, s12, s15,
    s17, s18, s19, s20, s22, s23, s24
]

// const data = [
//     // s2, s3, s10, s16,d13,d21,d6,d14,
//     d1, d4, d5, d7, d8, d9, d11, d12, d15,
//     d17, d18, d19, d20, d22, d23, d24
// ]

export default class FormTest extends React.Component {

    state = {
        selectedSchema: s1,
        // selectedData: d1,
        submittedData: {}
    }

    componentDidMount() {
        // console.log($)
        // console.log(this.props)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.match.params.schema !== this.props.match.params.schema) {

            let selectedSchema = s1
            // let selectedData   = d1
            for (let i=0; i<schemas.length; i++) {
                if (schemas[i].title === this.props.match.params.schema) {
                    selectedSchema = schemas[i]
                    // selectedData   = data[i]
                }
            }

            this.setState({
                selectedSchema: selectedSchema,
                // selectedData: selectedData
            })
        }
    }

    submitForm = (e) => this.setState({submittedData: e.formData})

    CustomCheckbox = (props) => {
        console.log(props.value)
        return (
            <div>
                <label onClick={() => props.onChange(!props.value)}>
                    <span className="margin-right-5px">
                        {
                            props.value?
                                <i className="fa fa-2x fa-check-square-o"></i> :
                                <i className="fa fa-2x fa-square-o"></i>
                        }
                    </span>
                    <span className="position-relative bottom-6px">
                        {props.label}
                    </span>
                </label>
                {
                    props.schema.description &&
                    <i title={props.schema.description} className="my-description fa fa-2x fa-info-circle"></i>
                }
            </div>
        );
    };

    widgets = {
        CheckboxWidget: this.CustomCheckbox
    };

    CustomDescriptionField = ({id, description}) => {
        return (
            <div>
            {
                description &&
                <i title={description} className="my-description fa fa-2x fa-info-circle" aria-hidden="true"></i>
            }
            </div>
        )
    };

    fields = {
        DescriptionField: this.CustomDescriptionField
    };

     CustomFieldTemplate = (props) => {
        const {id, classNames, label, help, required, description, errors, children} = props;
        return (
            <div className={classNames}>
                {/*<label htmlFor={id}>{label}{required ? "*" : null}</label>*/}
                {description}
                {children}
                {errors}
                {help}
            </div>
        );
    }

    ArrayFieldTemplate = (props) => {
        return (
            <div>
                {props.items.map(element => {
                    return (
                        <div>
                            {element.index}
                            {element.children}
                        </div>
                    )
                })}
                <button type="button" onClick={props.onAddClick}>Add</button>
            </div>
        );
    }

    render() {
        return(
            <div className="position-absolute top-0px bottom-170px margin-right-15px">
            <div className="height-100pc position-relative">
                <br/>
                <ul className="nav nav-tabs">
                    {
                        schemas.map(schema =>
                            <li key={schema.title}
                                className={`${this.state.selectedSchema.title === schema.title?'active':''} width-10pc`}>
                                <Link to={`/form-test/${schema.title}`}>{schema.title}</Link>
                            </li>
                        )
                    }
                </ul>
                <br/>
                <select
                    value={this.state.selectedSchema.title}
                    onChange={(e) => {
                        const schemaTitle = e.target.value
                        this.props.history.push(schemaTitle)
                    }}
                    className="form-control">
                    {
                        schemas.map(schema =>
                            <option key={schema.title} >
                                {schema.title}
                            </option>
                        )
                    }
                </select>
                <br/>
            <div className="row position-absolute height-100pc left-0px top-120px right-0px bottom-0px">
                <div className="col-xs-6 position-absolute top-0px bottom-0px overflow-scroll">
                    <Form className="margin-right-15px" schema={this.state.selectedSchema}
                          // FieldTemplate={this.CustomFieldTemplate}
                          // ArrayFieldTemplate={this.ArrayFieldTemplate}
                          fields={this.fields}
                          widgets={this.widgets}
                          onChange={console.log("changed")}
                          onSubmit={this.submitForm}
                          onError={console.log("errors")} />
                </div>
                <div className="col-xs-4 position-absolute left-50pc top-0px bottom-0px overflow-scroll">
                    <ReactJson src={this.state.selectedSchema} />
                </div>
                <div className="col-xs-2 position-absolute right-0px top-0px bottom-0px overflow-scroll">
                    <ReactJson src={this.state.submittedData} />
                </div>
            </div>
            </div>
            </div>
        )
    }
}
