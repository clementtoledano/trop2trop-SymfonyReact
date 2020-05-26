import React from 'react';
// import 'font-awesome/css/font-awesome.min.css'

const Field = ({text, loaded}) =>

    (<div className="form-group">
        {loaded && <button type="submit" className="btn btn-dark"><i className="fas fa-spinner fa-spin"/> ca va pas tarder !!</button> ||
        <button type="submit" className="btn btn-dark">{text}</button>}
    </div>);


export default Field;
