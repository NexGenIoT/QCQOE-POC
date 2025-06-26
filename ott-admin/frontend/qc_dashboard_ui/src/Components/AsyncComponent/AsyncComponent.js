/**
 * AsyncComponent
 * Code Splitting Component / Server Side Rendering
 */
import React from 'react';
import Loadable from 'react-loadable';

// rct page loader
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader'; 
  
//crm dashboard
const AsyncCrmComponent = Loadable({
	loader: () => import("Routes/crm/dashboard"),
	loading: () => <RctPageLoader />,
});

//Overview
const AsyncOverviewComponent = Loadable({
	loader: () => import("Components/OverviewPage/Overview"),
	loading: () => <RctPageLoader />,
});

//Real Time key Insights
const RealTimeKeyInsightComponent = Loadable({
	loader: () => import("Routes/qoe/realtime"),
	loading: () => <RctPageLoader />,
});

//User Engagement metrics
const UserEngagementComponent = Loadable({
	loader: () => import("Routes/qoe/userengagement"),
	loading: () => <RctPageLoader />,
});

//Quality Experience 
const QualityExperienceComponent = Loadable({
	loader: () => import("Routes/qoe/quality-experience"),
	loading: () => <RctPageLoader />,
});

const MitigationComponent = Loadable({
	loader: () => import("Routes/qoe/mitigation"),
	loading: () => <RctPageLoader />,
});

//Experience Insights
const ExperienceInsightsComponent = Loadable({
	loader: () => import("Routes/qoe/experience-insights"),
	loading: () => <RctPageLoader />,
});

//PartnerDetail
const PartnerContainer = Loadable({
	loader: () => import("Routes/qoe/experience-insights/PartnerContainer"),
	loading: () => <RctPageLoader />,
});

//Location
const Location = Loadable({
	loader: () => import("Routes/qoe/location/index"),
	loading: () => <RctPageLoader />,
});
//DetectedAnomalies
const DetectedAnomalies = Loadable({
	loader: () => import("Routes/qoe/expertSystem"),
	loading: () => <RctPageLoader />,
});

const FAQ = Loadable({
	loader: () => import("Routes/qoe/faq/index"),
	loading: () => <RctPageLoader />,
});


// Session Login
const AsyncSessionLoginComponent = Loadable({
	loader: () => import("Routes/session/login"),
	loading: () => <RctPageLoader />,
});
// Session Page 404
const AsyncSessionPage404Component = Loadable({
	loader: () => import("Routes/session/404"),
	loading: () => <RctPageLoader />,
});

// Error Screen
const ErrorScreenComponent = Loadable({
	loader: () => import("Routes/qoe/error-screen/index"),
	loading: () => <RctPageLoader />
});

export { 
	AsyncSessionLoginComponent,
	AsyncSessionPage404Component,
	AsyncCrmComponent,
	AsyncOverviewComponent,
	RealTimeKeyInsightComponent,
	UserEngagementComponent,
	QualityExperienceComponent,
	ExperienceInsightsComponent,
	PartnerContainer,
	Location,
	FAQ,
	DetectedAnomalies,
	MitigationComponent,
	ErrorScreenComponent,
};
