import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
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
   ErrorScreenComponent
} from 'Components/AsyncComponent/AsyncComponent';
import Favorite from 'Components/QualityExperience/favorite';
import NotificationsDetails from 'Components/Notifications/NotificationDetail';
import { isValidPermission } from 'Constants/constant';
import NotFound from 'Routes/session/404';

const Crm = ({ match }) => (
   <div className="Crm-wrapper">
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
         <Route path={`${match.url}/dashboard`} component={AsyncCrmComponent} /> 
         {isValidPermission("READ_LOG_DETAIL")||isValidPermission("READ_ISSUE_ANALYSIS")||isValidPermission("READ_PENDING_IN_QUEUE")||isValidPermission("READ_RESOURCE_MANAGEMENT")||isValidPermission("READ_INGESTION_INSIGHT")?<Route path={`${match.url}/overview`} component={AsyncOverviewComponent} />:<Route path={`${match.url}/overview`} component={NotFound} />}
         {isValidPermission("READ_REAL_TIME_KEY_INSIGHTS")?<Route  path={`${match.url}/realtime-key-insights`} component={RealTimeKeyInsightComponent} />:<Route  path={`${match.url}/realtime-key-insights`} component={NotFound} />}
         {isValidPermission("READ_USER_ENGAGEMENT_METRICS")?<Route path={`${match.url}/user-engagement-metrics`} component={UserEngagementComponent} />:<Route path={`${match.url}/user-engagement-metrics`} component={NotFound} />}
         {isValidPermission("READ_QUALITY_OF_EXPERIENCE")?<Route path={`${match.url}/quality-of-experience`} component={QualityExperienceComponent} />:<Route path={`${match.url}/quality-of-experience`} component={NotFound} />}
         {isValidPermission("READ_EXPERIENCE_INSIGHT")?<Route path={`${match.url}/experience-insights`} component={ExperienceInsightsComponent} />:<Route path={`${match.url}/experience-insights`} component={NotFound} />}
         {isValidPermission("READ_EXPERIENCE_INSIGHT")?<Route path={`${match.url}/PartnerDetail`} component={PartnerContainer} />:<Route path={`${match.url}/PartnerDetail`} component={NotFound} />}
         {isValidPermission("READ_LOCATION")?<Route path={`${match.url}/location`} component={Location} />:<Route path={`${match.url}/location`} component={NotFound} />}
         <Route path={`${match.url}/faq`} component={FAQ} />
         {isValidPermission("READ_DETECTED_ANOMALIES")||isValidPermission("READ_ESTIMATED_ROimport DashboardOT_CAUSE")||isValidPermission("READ_CONFIGURE_RCA")||isValidPermission("READ_CONFIGURE_MITIGATION")||isValidPermission("READ_AI_PIPELINE_INSIGHT")? <Route path={`${match.url}/DetectedAnomalies`} component={DetectedAnomalies} />:<Route path={`${match.url}/DetectedAnomalies`} component={NotFound} />}
         {isValidPermission("READ_MITIGATION")||isValidPermission("READ_ANALYTICS")?<Route path={`${match.url}/mitigation`} component={MitigationComponent} />:<Route path={`${match.url}/mitigation`} component={NotFound} />}
         {isValidPermission("READ_FAVORITE")?<Route path={`${match.url}/favorite`} component={Favorite} />:<Route path={`${match.url}/favorite`} component={NotFound} />}
         <Route path={`${match.url}/notifications`} component={NotificationsDetails} />
         {isValidPermission("READ_SSO_PLAYBACK_ERRORS")? <Route path={`${match.url}/error-screen`} component={ErrorScreenComponent} />:<Route path={`${match.url}/error-screen`} component={NotFound} />}
      </Switch>
   </div>
);

export default Crm;