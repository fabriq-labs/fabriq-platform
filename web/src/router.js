// Router
import React, { useState, useEffect } from "react";
import Loadable from "react-loadable";
import { Router, Location, Redirect } from "@reach/router";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";

import { Skeleton } from "./components/Skeleton";
import MyQueries from "./containers/my_queries";
import Explore from "./containers/explore";
import OnBoarding from "./containers/onboard";
import { PipelineConnect } from "./pages/Pipelines/Creator";
import SalesforceEnvironment from "./containers/salesforce_environment";
import ContentAnalyticsRouter from "./content-analytics/contentAnalyticsRoutes";

// Router Path - Code Split
const EditorView = Loadable({
  loader: () => import("./containers/editor_view"),
  loading: Skeleton
});

const CreaterView = Loadable({
  loader: () => import("./containers/creator_view"),
  loading: Skeleton
});

const Viewer = Loadable({
  loader: () => import("./containers/pipeline_list"),
  loading: Skeleton
});

const PipelineView = Loadable({
  loader: () => import("./containers/pipeline_edit"),
  loading: Skeleton
});

const LoginPage = Loadable({
  loader: () => import("./pages/Login/login_page"),
  loading: Skeleton
});

const QueryPage = Loadable({
  loader: () => import("./pages/Query/query"),
  loading: Skeleton
});

const Home = Loadable({
  loader: () => import("./containers/home_view"),
  loading: Skeleton
});

const HomePage = Loadable({
  loader: () => import("./pages/DashboardHomePage/dashboard_homepage"),
  loading: Skeleton
});

const Dashboard = Loadable({
  loader: () => import("./containers/dashboard_view"),
  loading: Skeleton
});

const Setup = Loadable({
  loader: () => import("./containers/setup"),
  loading: Skeleton
});

const UserEdit = Loadable({
  loader: () => import("./containers/useredit"),
  loading: Skeleton
});

const SiteEdit = Loadable({
  loader: () => import("./containers/site_edit"),
  loading: Skeleton
});

const Destination = Loadable({
  loader: () => import("./containers/destination_view"),
  loading: Skeleton
});

const DestinationEdit = Loadable({
  loader: () => import("./pages/Destination/destination_edit"),
  loading: Skeleton
});

const QueryEdit = Loadable({
  loader: () => import("./containers/query_edit"),
  loading: Skeleton
});

const QueryView = Loadable({
  loader: () => import("./containers/query_view"),
  loading: Skeleton
});

const Inviteuser = Loadable({
  loader: () => import("./pages/Login/invite_user"),
  loading: Skeleton
});

const MultipleOrgs = Loadable({
  loader: () => import("./pages/SelectOrgs/select_orgs_page"),
  loading: Skeleton
});

const ChatPage = Loadable({
  loader: () => import("./pages/Chat/chat"),
  loading: Skeleton
});

const PageTransitionGroup = styled.div``;

const PageRouter = styled(Router)`
  position: absolute;
  top: 66px;
  left: 0;
  bottom: 0;
  right: 0;

  &.fade-enter > div {
    opacity: 0;
    z-index: 1;
  }

  &.fade-enter-active > div {
    opacity: 1;
    transition: opacity 450ms ease-in;
  }
`;

const PageRouterUnAuth = styled(PageRouter)`
  top: 0;
`;

const authPath = "/login";
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const organization = localStorage.getItem("organization");
  let parsed = null;

  if (organization) {
    parsed = JSON.parse(organization);
  }

  return localStorage.getItem("user_id") && parsed ? (
    <Component {...rest} />
  ) : (
    <Redirect from="" to="/login" noThrow />
  );
};

const PublicRoute = ({ component: Component, ...rest }) => {
  return localStorage.getItem("token") && rest.path === authPath ? (
    <Redirect to="/" noThrow />
  ) : (
    <Component {...rest} />
  );
};

const FadeTransitionRouter = (props) => {
  const [topValue, setTopValue] = useState(60);
  const organization = localStorage.getItem("organization");
  let parsed = null;

  if (organization) {
    parsed = JSON.parse(organization);
  }

  useEffect(() => {
    const updateContentHeight = () => {
      if (document.querySelector(".header-top") !== null) {
        const headerDiv = document.querySelector(".header-top");
        const contentHeight = headerDiv.offsetHeight;
        setTopValue(contentHeight);
      }
    };

    // Wait for DOM to be fully rendered
    updateContentHeight();

    // Add event listener for window resize
    window.addEventListener("resize", updateContentHeight);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateContentHeight);
    };
  }, []);

  const PageRouterBlock =
    localStorage.getItem("user_id") && parsed ? PageRouter : PageRouterUnAuth;
  return (
    <Location>
      {({ location }) => (
        <PageTransitionGroup>
          <CSSTransition key={location.key} classNames="fade" timeout={100}>
            <PageRouterBlock location={location} top={topValue}>
              {props.children}
            </PageRouterBlock>
          </CSSTransition>
        </PageTransitionGroup>
      )}
    </Location>
  );
};

const AppRouter = () => (
  <FadeTransitionRouter>
    <ProtectedRoute path="/" default component={Home} />
    <ProtectedRoute path="/home" component={HomePage} />
    <PublicRoute path="/login" component={LoginPage} />
    <PublicRoute path="/orgs" component={MultipleOrgs} />
    <PublicRoute path="/:org/invite/:token" component={Inviteuser} />
    <ProtectedRoute path="/destinations" component={Destination} />
    <ProtectedRoute path="/connect" component={Viewer} />
    <ProtectedRoute
      path="/pipelines/:pipelineId/view"
      component={PipelineView}
    />
    <ProtectedRoute path="/pipelines/create" component={CreaterView} />
    <ProtectedRoute path="/pipelines/:pipelineId/edit" component={EditorView} />
    <ProtectedRoute
      path="/destinations/:dataSourceId"
      component={DestinationEdit}
    />
    <ProtectedRoute path="/queries/create" component={QueryPage} />
    <ProtectedRoute path="/setup" component={Setup} />
    <ProtectedRoute path="/users/:userId" component={UserEdit} />
    <ProtectedRoute path="/site/:siteId" component={SiteEdit} />
    <ProtectedRoute path="/dashboards/:slug/edit" component={Dashboard} />
    <ProtectedRoute path="/queries/:queryId" component={QueryView} />
    <ProtectedRoute path="/queries/:queryId/source" component={QueryEdit} />
    <ProtectedRoute
      path="/pipeline/connect/callback"
      component={PipelineConnect}
    />
    <ProtectedRoute
      path="/pipeline/connect/init"
      component={SalesforceEnvironment}
    />
    <ProtectedRoute path="/explore" component={Explore} />
    <ProtectedRoute path="/explore/queries" component={MyQueries} />
    <ProtectedRoute path="/explore/queries/:folderId" component={MyQueries} />
    <ProtectedRoute path="/onboarding" component={OnBoarding} />
    <ProtectedRoute path="/chat" component={ChatPage} />
    {/* Spread the content analytics routes */}
    {/* {contentAnalyticsRoutes.map((route) => (
      <ProtectedRoute
        key={route.path}
        path={route.path}
        component={route.component}
      />
    ))} */}
    <ProtectedRoute
      path="/content/*"
      component={ContentAnalyticsRouter}
    />
  </FadeTransitionRouter>
);

export default AppRouter;
