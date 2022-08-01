import React from 'react';

//? instead of passing in prop like this {prop}, you can use props instead
//* lifting state up => Dropdown component only handles props and rendering, NO state mgmt
//? once all state is removed, this is referred to as a stateless component

const Dropdown = (props) => {
    const dropdownChanged = (e) => {
        props.changed(e.target.value);
    };

    return (
        <div className="col-sm-6 form-group row px-0">
            <label className="form-label col-sm-2">{props.label}</label>
            <select
                value={props.selectedValue}
                onChange={dropdownChanged}
                className="form-control form-control-sm col-sm-10"
            >
                <option key={0}>Select...</option>
                {props.options.map((item, i) => (
                    <option key={i + 1} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;
