import React, { useState } from 'react';
import SearchForm from "Components/SearchForm/SearchForm";
import AccordionGroup from 'Components/AccordionGroup/AccordionGroup';
import MatButton from "@material-ui/core/Button";

const props = {
    accordionList: [{
        title: 'Sample Title 1',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
        title: 'Sample Title 2',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
        title: 'Sample Title 3',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
        title: 'Sample Title 4',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    }]
}

export default function FAQ() {
    const [buttonStatus, setButtonStatus] = useState('All')
    const setText = (text) => {
        props.setText(text)
    }
    return (
        <div className='faq'>
            <div className='row'>
                <div className='col-md-6'><h1>FAQ</h1></div>
                <div className='col-md-6'>
                    <div className="auto-search">
                        <i className="zmdi zmdi-search"></i>
                        <SearchForm textInput={props.textInput || ''} setText={setText || ''} time={props.time || ''} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="monthely-status">
                        <MatButton onClick={()=>setButtonStatus('All')} className={`${buttonStatus === 'All' ? 'Status-btn-active' : 'Status-btn'}`}>All</MatButton>
                        <MatButton onClick={()=>setButtonStatus('Login')} className={`${buttonStatus === 'Login' ? 'Status-btn-active' : 'Status-btn'}`}>Login</MatButton>
                        <MatButton onClick={()=>setButtonStatus('QOE')} className={`${buttonStatus === 'QOE' ? 'Status-btn-active' : 'Status-btn'}`}>QOE</MatButton>
                        <MatButton onClick={()=>setButtonStatus('Video QC')} className={`${buttonStatus === 'Video QC' ? 'Status-btn-active' : 'Status-btn'}`}>Video QC</MatButton>
                        <MatButton onClick={()=>setButtonStatus('Mitigation')} className={`${buttonStatus === 'Mitigation' ? 'Status-btn-active' : 'Status-btn'}`}>Mitigation</MatButton>
                        <MatButton onClick={()=>setButtonStatus('Self-healing')} className={`${buttonStatus === 'Self-healing' ? 'Status-btn-active' : 'Status-btn'}`}>Self-healing</MatButton>
                        <MatButton onClick={()=>setButtonStatus('Account Details')} className={`${buttonStatus === 'Account Details' ? 'Status-btn-active' : 'Status-btn'}`}>Account Details</MatButton>
                        <MatButton onClick={()=>setButtonStatus('Issue Analysis')} className={`${buttonStatus === 'Issue Analysis' ? 'Status-btn-active' : 'Status-btn'}`}>Issue Analysis</MatButton>
                        <MatButton onClick={()=>setButtonStatus('Anomaly')} className={`${buttonStatus === 'Anomaly' ? 'Status-btn-active' : 'Status-btn'}`}>Anomaly</MatButton>
                    </div>
                </div>
            </div>
            <div className='row fagAccordion'>
                <div className='col-md-12'>
                    <AccordionGroup {...props} />
                </div>
            </div>

        </div>
    )
}