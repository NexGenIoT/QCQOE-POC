/**
 * The section accordion is used when the content spans the whole width of the container, like page sections.
 *
 * @module views/components/AccordionGroup
 * @memberof -Common
 */
import React from 'react';
import PropTypes from 'prop-types';
import AccordionSection from '../AccordionSection/AccordionSection'
import classNames from 'classnames';
import './AccordionGroup.scss';

/**
 * Represents a AccordionGroup component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns AccordionGroup
 */

export const AccordionGroup = function( props ){
  const { accordionList } = props ;
  return (
    <div className={ classNames( 'AccordionGroup', {
      [`AccordionGroup__bottomSpacer--${props.spacerValue}`]:props.spacerValue
    } ) }
    >
      { accordionList?.length > 0 && accordionList.map( ( accordionLists, index ) => (
        <AccordionSection
          title={ accordionLists.title }
          body={ accordionLists.body }
          key={ index }
        />
      ) )
      }
    </div>
  )
}

/**
 * Property type definitions
 *
 * @type {object}
 * @property {array} accordionList - Array of accordion items (title, body, bodyStyle)
 */
export const propTypes =  {
  /** Sets the brand title text. */
  accordionList: PropTypes.arrayOf(
    PropTypes.shape( {
      title: PropTypes.string,
      body: PropTypes.string,
      bodyStyle: PropTypes.string
    } )
  )
};

AccordionGroup.propTypes = propTypes;

export default AccordionGroup;
