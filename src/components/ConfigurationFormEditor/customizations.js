import React from "react";

export const CustomCheckbox = (props) => {
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

export const CustomDescriptionField = ({id, description}) => {
    return (
        <div>
            {
                description &&
                <i title={description} className="my-description fa fa-2x fa-info-circle" aria-hidden="true"></i>
            }
        </div>
    )
};

export const CustomFieldTemplate = (props) => {
    const {classNames, help, description, errors, children} = props;
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

export const ArrayFieldTemplate = (props) => {
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

export const widgets = {
    CheckboxWidget: CustomCheckbox
};

export const fields = {
    DescriptionField: CustomDescriptionField
};
