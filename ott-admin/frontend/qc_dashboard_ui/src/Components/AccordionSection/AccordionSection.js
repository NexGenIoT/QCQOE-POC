/**
 * The AccordionSection is the content portion for each individual Accordion within the AccordionGroup.
 *
 * @module views/components/AccordionSection
 * @memberof -Common
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AccordionSection.scss';
import classNames from 'classnames';

/**
 * Represents a AccordionSection component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns AccordionSection
 */
export const AccordionSection = function( props ){
  const [isActive, setIsActive] = useState( false );
  return (
    <div className={ classNames( 'AccordionSection', {
      'AccordionSection--detailAccordion': props.detailAccordion
    } ) }
    >
      { props.title &&
        <button className='AccordionSection__title'
          tabIndex={ props.index }
          onClick={ () => setIsActive( !isActive ) }
        >
          <div>
              { props.title }
          </div>
          <div>
            { isActive ? <i className="zmdi zmdi-hc-2x zmdi-chevron-up"></i> : <i className="zmdi zmdi-hc-2x zmdi-chevron-down mx-3"></i>  }
          </div>
        </button>
      }
      {isActive && props.body &&
        <div className='AccordionSection__body'>
            {props.body }
        </div>
      }
      
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {string} title - sets the title value
 * @property {string} body - Sets the body value
 * @property {string} bodyStyle - Sets the body style tag
 */

export const propTypes =  {
  /** Sets the text for display */
  title: PropTypes.string,
  /** Sets the body for display */
  body: PropTypes.string,
  /** Sets the body styling tag for display */
};

AccordionSection.propTypes = propTypes;

export default AccordionSection;
