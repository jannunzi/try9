import React from "react";
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './SchemaEditorComponent.css';
import {API_BASE_URL} from "../config";

export default class Schema extends React.Component {
    state = {
        schemas: [
            {
                name: 'Sample',
                type: 'Number',
                default: 'Default',
                enum: "ewq, rew, tre",
                isUnique: false,
                isRequired: false,
                isReference: false,
                isArray: false
            }
        ],
        newSchema: {
            name: '',
            type: 'String',
            default: '',
            enum: '',
            isUnique: false,
            isRequired: false,
            isReference: false,
            isArray: false
        }
    }

    updateSchemas = (index, newSchema) =>
        this.setState(prevState => ({
            schemas: this.state.schemas.map((schema, index1) => (
                index === index1 ? schema : newSchema
            ))
        }))

    updateNewSchema = (newSchema) =>
        this.setState(prevState => ({newSchema: newSchema}))

    addFieldToCollection = () =>
        fetch(`${API_BASE_URL}/data/schemas`, {
            method: 'POST',
            body: JSON.stringify(this.state.newSchema),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(newSchema => this.setState(prevState => ({
                schemas: [...prevState.schemas, newSchema],
                newSchema: {
                    name: '', type: 'String', default: '', enum: '',
                    isUnique: false, isRequired: false, isReference: false, isArray: false
                }})))

    findSchemaForCollection = (collection) =>
        fetch(`${API_BASE_URL}/data/schemas`)
            .then(response => response.json())

    deleteFieldFromCollection = (fieldId) => {
        
    }

    componentDidMount = () =>
        this.findSchemaForCollection()
            .then(schemas => this.setState({
                schemas: schemas
            }))

    render() {
        return(
            <div>
                <h1>Schema Editor</h1>
                {
                    this.state.schemas.map((schema, index) =>
                        <div key={index} className="input-group mb-3">
                            <input value={schema.name}
                                   onChange={(e) => {
                                       const newName = e.target.value
                                       this.updateSchemas(index, {...schema, name: newName})
                                   }}
                                   placeholder="Name"
                                   className="form-control"/>
                            <select value={schema.type}
                                    onChange={(e) => {
                                        this.updateSchemas(index, {...schema, type: e.target.value})
                                    }}
                                    className="form-control no-radius">
                                <optgroup label="Primitive data types">
                                    <option>String</option>
                                    <option>Number</option>
                                    <option>Date</option>
                                    <option>Boolean</option>
                                </optgroup>
                                <optgroup label="Collections">
                                    <option>ewq</option>
                                    <option>rew</option>
                                    <option>tre</option>
                                    <option>ytr</option>
                                </optgroup>
                            </select>
                            <input placeholder="Default" className="form-control"
                                   value={schema.default}
                                   onChange={(e) => {
                                       this.updateSchemas(index, {...schema, default: e.target.value})
                                   }}/>
                            <input placeholder="Enum" className="form-control"
                                   value={schema.enum}
                                   onChange={(e) => {
                                       this.updateSchemas(index, {...schema, enum: e.target.value})
                                   }}/>
                           <div className="dropdown">
                                <button className="btn btn-warning dropdown-toggle" type="button"
                                        id="dropdownMenuButton" data-toggle="dropdown">
                                    Config
                                </button>
                                <div className="dropdown-menu">
                                    <label className="dropdown-item">
                                        <input checked={schema.isUnique}
                                               onChange={(e) => {
                                                   this.updateSchemas(index, {...schema, isUnique: e.target.checked})
                                               }}
                                               type="checkbox"/>
                                        &nbsp;
                                        Unique
                                    </label>
                                    <label className="dropdown-item">
                                        <input checked={schema.isArray}
                                               onChange={(e) => {
                                                   this.updateSchemas(index, {...schema, isArray: e.target.checked})
                                               }}
                                               type="checkbox"/>
                                        &nbsp;
                                        Array of
                                    </label>
                                    <label className="dropdown-item">
                                        <input checked={schema.isReference}
                                               onChange={(e) => {
                                                   this.updateSchemas(index, {...schema, isReference: e.target.checked})
                                               }}
                                               type="checkbox"/>
                                        &nbsp;
                                        Reference
                                    </label>
                                    <label className="dropdown-item">
                                        <input checked={schema.isRequired}
                                               onChange={(e) => {
                                                   this.updateSchemas(index, {...schema, isRequired: e.target.checked})
                                               }}
                                               type="checkbox"/>
                                        &nbsp;
                                        Required
                                    </label>
                                </div>
                            </div>
                            <div className="input-group-append">
                                <button className="btn btn-danger"><i className="fa fa-times"/></button>
                                <button className="btn btn-success"><i className="fa fa-check"/></button>
                            </div>
                        </div>
                    )
                }
                <div className="input-group mb-3">
                    <input value={this.state.newSchema.name}
                           onChange={(e) => {
                               this.state.newSchema.name = e.target.value
                               this.updateNewSchema(this.state.newSchema)
                           }}
                           placeholder="Name"
                           className="form-control"/>
                    <select value={this.state.newSchema.type}
                            onChange={(e) => {
                                this.state.newSchema.type = e.target.value
                                this.updateNewSchema(this.state.newSchema)
                            }}
                            className="form-control no-radius">
                        <optgroup label="Primitive data types">
                            <option>String</option>
                            <option>Number</option>
                            <option>Date</option>
                            <option>Boolean</option>
                        </optgroup>
                        <optgroup label="Collections">
                            <option>ewq</option>
                            <option>rew</option>
                            <option>tre</option>
                            <option>ytr</option>
                        </optgroup>
                    </select>
                    <input placeholder="Default" className="form-control"
                           value={this.state.newSchema.default}
                           onChange={(e) => {
                               this.state.newSchema.default = e.target.value
                               this.updateNewSchema(this.state.newSchema)
                           }}
                    />
                    <input placeholder="Enum" className="form-control"
                           value={this.state.newSchema.enum}
                           onChange={(e) => {
                               this.state.newSchema.enum = e.target.value
                               this.updateNewSchema(this.state.newSchema)
                           }}
                    />
                    <div className="dropdown">
                        <button className="btn btn-warning dropdown-toggle" type="button"
                                id="dropdownMenuButton" data-toggle="dropdown">
                            Config
                        </button>
                        <div className="dropdown-menu">
                            <label className="dropdown-item">
                                <input checked={this.state.newSchema.isUnique}
                                       onChange={(e) => {
                                           this.state.newSchema.isUnique = e.target.checked
                                           this.updateNewSchema(this.state.newSchema)
                                       }}
                                       type="checkbox"/>
                                &nbsp;
                                Unique
                            </label>
                            <label className="dropdown-item">
                                <input checked={this.state.newSchema.isArray}
                                       onChange={(e) => {
                                           this.state.newSchema.isArray = e.target.checked
                                           this.updateNewSchema(this.state.newSchema)
                                       }}
                                       type="checkbox"/>
                                &nbsp;
                                Array of
                            </label>
                            <label className="dropdown-item">
                                <input checked={this.state.newSchema.isReference}
                                       onChange={(e) => {
                                           this.state.newSchema.isReference = e.target.checked
                                           this.updateNewSchema(this.state.newSchema)
                                       }}
                                       type="checkbox"/>
                                &nbsp;
                                Reference
                            </label>
                            <label className="dropdown-item">
                                <input checked={this.state.newSchema.isRequired}
                                       onChange={(e) => {
                                           this.state.newSchema.isRequired = e.target.checked
                                           this.updateNewSchema(this.state.newSchema)
                                       }}
                                       type="checkbox"/>
                                &nbsp;
                                Required
                            </label>
                        </div>
                    </div>
                    <div className="input-group-append">
                        <button
                            onClick={this.addFieldToCollection}
                            className="btn btn-danger"><i className="fa fa-times"/></button>
                        <button
                            onClick={this.addFieldToCollection}
                            className="btn btn-primary"><i className="fa fa-plus"/></button>
                    </div>
                </div>
            </div>
        )
    }
}
