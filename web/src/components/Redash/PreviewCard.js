/* eslint-disable react/jsx-props-no-spreading */
// PreviewCard
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styled from "styled-components";

const Content = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;

  img {
    margin-right: 5px;
  }

  .flex-fill {
    font-size: 12px;
    flex: 1 1 auto !important;
  }
`;

export function PreviewCard({
  imageUrl,
  roundedImage,
  title,
  body,
  children,
  className,
  ...props
}) {
  return (
    <Content
      {...props}
      className={`${className} w-100 d-flex align-items-center`}
    >
      <img
        src={imageUrl}
        width="32"
        height="32"
        className={classNames(
          { "profile__image--settings": roundedImage },
          "m-r-5"
        )}
        alt="Logo/Avatar"
      />
      <div className="flex-fill">
        <div>{title}</div>
        {body && <div className="text-muted">{body}</div>}
      </div>
      {children}
    </Content>
  );
}

PreviewCard.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  body: PropTypes.node,
  roundedImage: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};

PreviewCard.defaultProps = {
  body: null,
  roundedImage: true,
  className: "",
  children: null
};

// UserPreviewCard

export function UserPreviewCard({ user, withLink, children, ...props }) {
  const title = withLink ? (
    <a href={`users/${user.id}`}>{user.name}</a>
  ) : (
    user.name
  );
  return (
    <PreviewCard
      {...props}
      imageUrl={user.profile_image_url}
      title={title}
      body={user.email}
    >
      {children}
    </PreviewCard>
  );
}

UserPreviewCard.propTypes = {
  user: PropTypes.shape({
    profile_image_url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  withLink: PropTypes.bool,
  children: PropTypes.node
};

UserPreviewCard.defaultProps = {
  withLink: false,
  children: null
};

// DataSourcePreviewCard

export function DataSourcePreviewCard({
  dataSource,
  withLink,
  children,
  ...props
}) {
  const imageUrl = `/static/images/db-logos/${dataSource.type}.png`;
  const title = withLink ? (
    <a href={`data_sources/${dataSource.id}`}>{dataSource.name}</a>
  ) : (
    dataSource.name
  );
  return (
    <PreviewCard {...props} imageUrl={imageUrl} title={title}>
      {children}
    </PreviewCard>
  );
}

DataSourcePreviewCard.propTypes = {
  dataSource: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired,
  withLink: PropTypes.bool,
  children: PropTypes.node
};

DataSourcePreviewCard.defaultProps = {
  withLink: false,
  children: null
};
