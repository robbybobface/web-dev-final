import React from 'react';

const Dropdown = props => {

        const dropdownChanged = e => {
            props.changed(e.target.value);

        };
        // console.log(props.options);
        const isArtist = props.options.length <= 20;
        // console.log(isArtist);

        return (
            <>
                {!isArtist ?
                    <>
                        <div className="col-sm-6 form-group row px-0">
                            <label className="form-label col-sm-2">{props.label}</label>
                            <select value={props.selectedValue}
                                    onChange={dropdownChanged}
                                    className="form-control form-control-sm col-sm-10">
                                <option key={0}>Select...</option>
                                {props.options.map(
                                    (item) => <option key={item} value={item}>{item.charAt(
                                        0).toUpperCase() + item.slice(1)}</option>)}
                            </select>
                        </div>
                    </>
                    :
                    <>
                        <div className="col-sm-6 form-group row px-0">
                            <label className="form-label col-sm-2">{props.label}</label>
                            <select value={props.selectedValue}
                                    onChange={dropdownChanged}
                                    className="form-control form-control-sm col-sm-10">
                                <option key={0}>Select...</option>
                                {props.options.map((item, idx) => <option key={idx + 1}
                                                                          value={item.id}>{item.name}</option>)}
                            </select>
                        </div>
                    </>

                }
            </>
        );
    }
;

export default Dropdown;
