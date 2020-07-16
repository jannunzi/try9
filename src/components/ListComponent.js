import React from "react";
import {API_BASE_URL} from "../config";

export default class ListComponent extends React.Component {

    constructor(props) {
        debugger
        super(props);

    }

    state = {
        listName: '',
        listItems: [],
        title: '',
        baseUrl: '',
        hrefAppend: this.props.hrefAppend
    }

    componentDidMount() {
        const href = window.location.href
        const parts = href.split('/')
        console.log(parts)
        const baseUrl = href//parts.splice(0, parts.length - 1).join('/')
        console.log(parts)
        console.log(baseUrl)
        const listName = parts[parts.length - 1]
        this.findDocumentsForCollection(listName)
            .then(listItems => this.setState({
                listItems: listItems,
                listName: listName,
                baseUrl: baseUrl,
                hrefAppend: this.props.hrefAppend
            }))
    }

    addDocumentToCollection = () =>
        fetch(`${API_BASE_URL}/data/${this.state.listName}`, {
            method: 'POST',
            body: JSON.stringify({title: this.state.title}),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json())
            .then(newDoc => this.setState(prevState => ({
                title: '',
                listItems: [...prevState.listItems, newDoc]
            })))

    findDocumentsForCollection = (listName) =>
        fetch(`${API_BASE_URL}/data/${listName}`)
            .then(response => response.json())
            .catch(err => console.log(err))

    deleteDocumentForCollection = (documentId) =>
        fetch(`${API_BASE_URL}/data/${this.state.listName}/${documentId}`, {
            method: 'DELETE'
        }).then(result => this.setState(prevState => ({
            listItems: prevState.listItems.filter(doc => doc._id !== documentId)
        })))

    render() {
        return(
            <div>
                <h1>{this.state.listName} List</h1>

                <div className="input-group mb-3">
                    <input value={this.state.title}
                           onChange={(e) => this.setState({
                               title: e.target.value
                           })}
                           className='form-control'/>
                        <div className="input-group-append">
                            <button
                                onClick={this.addDocumentToCollection}
                                className='btn btn-primary'>
                                <i className='fa fa-plus'/>
                            </button>
                        </div>
                </div>
                    {
                        this.state.listItems.map(document =>
                                <div className="input-group mb-3" key={document._id}>
                                    <input value={document.title}
                                           onChange={(e) => this.setState({
                                               title: e.target.value
                                           })}
                                           className='form-control'/>
                                    <div className="input-group-append">
                                        <a href={`${this.state.baseUrl}/${document.title}/${this.state.hrefAppend}`} className="btn btn-warning">
                                            <i className='fa fa-link'/>
                                        </a>
                                        <button
                                            onClick={(e) => this.deleteDocumentForCollection(document._id)}
                                            className='btn btn-success'>
                                            <i className='fa fa-check'/>
                                        </button>
                                        <button
                                            onClick={(e) => this.deleteDocumentForCollection(document._id)}
                                            className='btn btn-danger'>
                                            <i className='fa fa-times'/>
                                        </button>
                                    </div>
                                </div>
                        )
                    }
            </div>
        )
    }
}
