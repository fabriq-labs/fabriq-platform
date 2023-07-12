// Connect Right View Component
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import isEqual from "react-fast-compare";

import PipelineConnect from "../../../api/pipeline_connect";
import Connection from "../../../api/connection";
import { Skeleton } from "../../../components/Skeleton";
import { ErrorMessage } from "../../../components/ErrorMessage";
import elt_service from "../../../api/elt";
import { notification } from "antd";
import { useTranslation } from "react-i18next";

import {
  OauthService,
  PostgreSql,
  Files,
  Amazon,
  Shopify,
  MySql,
  SalesForce,
  FreshDesk,
  Chargebee,
  Stripe,
  Airtable,
  Slack,
  Jira,
  Teams,
  Salesmate,
  Netsuite,
  InterCom,
  PipeDrive,
  GoogleAnalytics
} from "./index";

const Wrapper = styled.div``;

// Main Component
const ConnectRightView = (props) => {
  const {
    item,
    onMenuItem,
    piplineId,
    pipelineMenu,
    updateRedirectUrl,
    updatePipelineId
  } = props;
  const [Loading, setLoading] = useState(true);
  const [Error, setError] = useState("");
  const [pipelineItem, setpipeline] = useState({});
  const [sourceLoader, setSourceLoader] = useState(false);
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const getPipeline = () => {
    Connection.getPipeline(piplineId, organization.fabriq_org_id)
      .then((res) => {
        const { data } = res;
        if (data && data.data && data.data.pipeline.length !== 0) {
          const pipeline = data.data.pipeline[0];
          setpipeline(pipeline);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err);
        return Promise.resolve(err);
      });
  };

  useEffect(() => {
    getPipeline();
  }, []);

  const CreateAirbyteSource = (pipelineId, obj) => {
    setSourceLoader(true);
    elt_service
      .create_source(pipelineId)
      .then((res) => {
        if (res) {
          onMenuItem("configure", obj);
          setSourceLoader(false);
        }
      })
      .catch((err) => {
        notification.warning({
          message: t("pipeline:base_configure.deployment_error"),
          description: err?.message
        });
      });
  };

  const { connection } = pipelineItem;

  const onClickMenuItem = (obj, isConfig = false) => {
    if (
      item.id === 11 ||
      item.id === 16 ||
      item.id === 17 ||
      item.id === 18 ||
      item.id === 20 ||
      isConfig ||
      item.id === 5 ||
      item.id === 22 ||
      item.id === 23 ||
      item.id === 25 ||
      item.id === 13 ||
      item.id === 27 ||
      item.id === 24 ||
      item.id === 32 ||
      item.id === 1 ||
      item.id === 33 ||
      item.id === 34
    ) {
      if (onMenuItem) {
        CreateAirbyteSource(piplineId, obj);
      }
    } else {
      PipelineConnect.get(piplineId)
        .then((res) => {
          const { data } = res;
          if (connection) {
            if (onMenuItem) {
              CreateAirbyteSource(piplineId, obj);
            }
          } else {
            if (item.id === 2) {
              updateRedirectUrl(data.url);
              updatePipelineId(piplineId);
              const popup = window.open(
                "/pipeline/connect/init",
                piplineId,
                "width=900, height=600"
              );

              const timer = setInterval(() => {
                if (popup && popup.closed) {
                  clearInterval(timer);
                  getPipeline();
                }
              }, 1000);
            } else {
              const popup = window.open(
                data.url,
                "windowname1",
                "width=800, height=600"
              );
              const timer = setInterval(() => {
                if (popup && popup.closed) {
                  clearInterval(timer);
                  getPipeline();
                }
              }, 1000);
            }
          }
        })
        .catch((err) => Promise.reject(err));
    }
  };

  const onClickReconnect = () => {
    PipelineConnect.get(piplineId)
      .then((res) => {
        const { data } = res;
        if (item.id === 2) {
          updateRedirectUrl(data.url);
          updatePipelineId(piplineId);
          const popup = window.open(
            "/pipeline/connect/init",
            piplineId,
            "width=800, height=600"
          );

          const timer = setInterval(() => {
            if (popup && popup.closed) {
              clearInterval(timer);
              getPipeline();
            }
          }, 1000);
        } else {
          const popup = window.open(
            data.url,
            "windowname1",
            "width=800, height=600"
          );
          const timer = setInterval(() => {
            if (popup && popup.closed) {
              clearInterval(timer);
              getPipeline();
            }
          }, 1000);
        }
      })
      .catch((err) => Promise.reject(err));
  };

  const onUpdate = (connectionId) => {
    Connection.updatePipeline(
      piplineId,
      connectionId,
      organization.fabriq_org_id
    ).then((res) => {
      const { data } = res;
      if (
        data &&
        data.data &&
        data.data.update_pipeline &&
        data.data.update_pipeline.returning[0]
      ) {
        getPipeline();
      }
    });
  };

  const syncList = [];

  if (Loading) {
    return <Skeleton />;
  }

  if (Error) {
    return <ErrorMessage error={Error} />;
  }

  if (!item || !pipelineItem || item === {} || pipelineItem === {}) {
    return null;
  }

  return (
    <Wrapper>
      {item &&
        (item.id === 12 ||
          item.id === 14 ||
          item.id === 31 ||
          item.id === 6 ||
          item.id === 37 ||
          item.id === 36) && (
          <OauthService>
            <OauthService.Connect
              item={item}
              pipeline={pipelineItem}
              onUpdate={onUpdate}
              onClickReconnect={onClickReconnect}
              onMenuItem={onClickMenuItem}
            />
          </OauthService>
        )}
      {item && item.id === 11 && (
        <PostgreSql>
          <PostgreSql.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
            loader={sourceLoader}
          />
        </PostgreSql>
      )}
      {item && item.id === 2 && (
        <SalesForce>
          <SalesForce.Connect
            item={item}
            syncList={syncList}
            onUpdate={onUpdate}
            pipelineMenu={pipelineMenu}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
            onClickReconnect={onClickReconnect}
          />
        </SalesForce>
      )}
      {item && item.id === 20 && (
        <MySql>
          <MySql.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
          />
        </MySql>
      )}
      {item && item.id === 16 && (
        <Files>
          <Files.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
          />
        </Files>
      )}
      {item && item.id === 17 && (
        <Amazon>
          <Amazon.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
          />
        </Amazon>
      )}
      {item && item.id === 18 && (
        <Shopify>
          <Shopify.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
            loader={sourceLoader}
          />
        </Shopify>
      )}
      {item && item.id === 13 && (
        <Slack>
          <Slack.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
            loader={sourceLoader}
          />
        </Slack>
      )}
      {item && item.id === 5 && (
        <FreshDesk>
          <FreshDesk.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
            loader={sourceLoader}
          />
        </FreshDesk>
      )}
      {item && item.id === 22 && (
        <Chargebee>
          <Chargebee.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
          />
        </Chargebee>
      )}
      {item && item.id === 1 && (
        <PipeDrive>
          <PipeDrive.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
          />
        </PipeDrive>
      )}
      {item && item.id === 25 && (
        <Airtable>
          <Airtable.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
          />
        </Airtable>
      )}
      {item && item.id === 23 && (
        <Stripe>
          <Stripe.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
          />
        </Stripe>
      )}
      {item && item.id === 27 && (
        <Jira>
          <Jira.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
          />
        </Jira>
      )}
      {item && item.id === 34 && (
        <GoogleAnalytics>
          <GoogleAnalytics.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
            loader={sourceLoader}
          />
        </GoogleAnalytics>
      )}
      {item && item.id === 24 && (
        <Teams>
          <Teams.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
            loader={sourceLoader}
          />
        </Teams>
      )}
      {item && item.id === 32 && (
        <Salesmate>
          <Salesmate.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
          />
        </Salesmate>
      )}
      {item && item.id === 33 && (
        <Netsuite>
          <Netsuite.Connect
            item={item}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
          />
        </Netsuite>
      )}
      {item && item.id === 7 && (
        <InterCom>
          <InterCom.Connect
            item={item}
            syncList={syncList}
            onUpdate={onUpdate}
            pipelineMenu={pipelineMenu}
            pipeline={pipelineItem}
            onMenuItem={onClickMenuItem}
            onClickReconnect={onClickReconnect}
            loader={sourceLoader}
          />
        </InterCom>
      )}
    </Wrapper>
  );
};

ConnectRightView.propTypes = {
  item: PropTypes.object,
  pipeline: PropTypes.object,
  onMenuItem: PropTypes.func,
  piplineId: PropTypes.number
};

ConnectRightView.defaultProps = {
  item: null,
  pipeline: null,
  onMenuItem: null,
  piplineId: 0
};

export default React.memo(ConnectRightView, isEqual);
