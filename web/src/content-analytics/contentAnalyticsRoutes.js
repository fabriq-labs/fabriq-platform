import React from "react";
import { Router, Route, Redirect } from "@reach/router";
import Loadable from "react-loadable";
import { Skeleton } from "../components/Skeleton";

const OverviewPage = Loadable({
  loader: () => import("./containers/overview"),
  loading: Skeleton
});

const Authors = Loadable({
  loader: () => import("./pages/Authors/authors"),
  loading: Skeleton
});

const AuthorsPage = Loadable({
  loader: () => import("./pages/Authors/author_page"),
  loading: Skeleton
});

const Article = Loadable({
  loader: () => import("./pages/Article/article"),
  loading: Skeleton
});

const ArticlePage = Loadable({
  loader: () => import("./pages/Article/article_page"),
  loading: Skeleton
});

const ProfilePage = Loadable({
  loader: () => import("./pages/Profile/profile"),
  loading: Skeleton
});

const ContentAnalyticsRouter = () => {
  return (
    <Router>
      <OverviewPage path="/overview" />
      <Authors path="/author/:authorId" />
      <AuthorsPage path="/author" />
      <ArticlePage path="/article" />
      <Article path="/article/:articleId" />
      <ProfilePage path="/audience" />
    </Router>
  );
};

export default ContentAnalyticsRouter;
