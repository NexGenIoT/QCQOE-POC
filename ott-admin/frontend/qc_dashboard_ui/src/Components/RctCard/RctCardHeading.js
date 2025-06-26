import React from 'react';
import PropTypes from 'prop-types';

const RctCardHeading = ({ title, customClasses }) => (
    <div className={`rct-block-title ${customClasses ? customClasses : ''}`}>
        <h4>{title}</h4>
    </div>
);

RctCardHeading.propTypes = {
    title: PropTypes.any
}

export { RctCardHeading };