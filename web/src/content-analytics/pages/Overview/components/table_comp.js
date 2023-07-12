import React from "react";
import { Row, Col, Icon } from "antd";
import { navigate } from "@reach/router";

import { TitleComp } from "../../../components/Title";
import { TagComp } from "../../../components/Tag";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js"
});

const TableComp = ({ postsData, updateActiveTab, values, referenceData }) => {
  const navigateArticle = () => {
    updateActiveTab("");
    navigate("/content/article");
  };
  return (
    <div style={{ marginTop: 60 }}>
      <Row gutter={20}>
        <Col span={9}>
          <Row>
            <Col span={19}>
              <Row>
                <Col style={{ marginRight: 5 }}>
                  <TitleComp title="Top Posts Today" type="Heading1" />
                </Col>
                <Col>
                  <Icon type="setting" theme="twoTone" />
                </Col>
              </Row>
            </Col>
            <Col span={4} align="right">
              <TitleComp title="Page views" type="Heading2" />
            </Col>
          </Row>
          {postsData.slice(0, 15)?.map((dt, i) => (
            <div
              style={{
                borderBottom: "2px solid #f6f5f7",
                marginTop: 16,
                paddingBottom: 10
              }}
            >
              <Row key={i}>
                <Col span={20}>
                  <Row>
                    <Col span={2} style={{ marginTop: 2 }}>
                      <TitleComp title={dt.id} type="Heading2" />
                    </Col>
                    <Col span={3}>
                      <div style={{ width: 48, height: 46 }}>
                        <img
                          src={dt.src}
                          alt="connect"
                          width="46px"
                          height="48px"
                          style={{
                            borderRadius: 5,
                            width: 46,
                            height: 48
                          }}
                        />
                      </div>
                    </Col>
                    <Col span={18} style={{ marginLeft: 10 }}>
                      <Row>
                        <div>
                          <a
                            className="anchor"
                            href={dt.url}
                            without
                            rel="noreferrer"
                            target="_blank"
                          >
                            <TitleComp title={dt.title} type="Description" />
                          </a>
                          <span
                            className="anchor"
                            style={{ cursor: "pointer", marginLeft: 5 }}
                            onClick={() => navigateArticle(dt.url)}
                            target="_blank"
                          >
                            <IconFont type="icon-tuichu" />
                          </span>
                        </div>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col span={3} align="center">
                  <TitleComp
                    type="Heading1"
                    title={Number(dt.views).toLocaleString()}
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Col span={2} />
                <Col span={3}>
                  <TitleComp type="Heading2" title={dt.time} />
                </Col>
                <Col span={4} style={{ textOverflow: "ellipsis" }}>
                  <TitleComp type="Heading2" title={dt.name} />
                </Col>
                <Col span={3}>
                  <TitleComp type="Heading2" title={dt.tech} />
                </Col>
                <Col span={3}>
                  <a
                    className="anchor"
                    href={dt.tag}
                    without
                    rel="noreferrer"
                    target="_blank"
                  >
                    <TagComp type="1" title={dt.tag} />
                  </a>
                </Col>
              </Row>
            </div>
          ))}
        </Col>
        <Col span={8}>
          <Row>
            <Col span={18}>
              <Row>
                <Col style={{ marginRight: 5 }}>
                  <TitleComp title="Top Tags Today" type="Heading1" />
                </Col>
                <Col>
                  <Icon type="setting" theme="twoTone" />
                </Col>
              </Row>
            </Col>
            <Col span={4} align="right">
              <TitleComp title="Page views" type="Heading2" />
            </Col>
          </Row>
          {values?.data?.map((dt, i) => (
            <Row
              key={i}
              style={{
                borderBottom: "2px solid #f6f5f7",
                marginTop: 16,
                paddingBottom: 10
              }}
            >
              <Col span={18}>
                <Row>
                  <Col span={1}>
                    <TitleComp title={dt.id} type="Heading2" />
                  </Col>
                  <Col span={17}>
                    {(dt.isTag && (
                      <TagComp title={dt.title} type={dt.type} />
                    )) || <TitleComp title={dt.title} type="Description" />}
                  </Col>
                </Row>
              </Col>
              <Col span={6} align="center">
                <TitleComp
                  type="Heading1"
                  title={Number(dt.views).toLocaleString()}
                />
              </Col>
            </Row>
          ))}
        </Col>
        <Col span={7}>
          <Row>
            <Col span={18}>
              <Row>
                <Col style={{ marginRight: 5 }}>
                  <TitleComp title="Top References Today" type="Heading1" />
                </Col>
                <Col>
                  <Icon type="setting" theme="twoTone" />
                </Col>
              </Row>
            </Col>
            <Col span={4} align="right">
              <TitleComp title="Page views" type="Heading2" />
            </Col>
          </Row>
          {referenceData?.map((dt, i) => (
            <Row
              key={i}
              style={{
                borderBottom: "2px solid #f6f5f7",
                marginTop: 16,
                paddingBottom: 10
              }}
            >
              <Col span={18}>
                <Row>
                  <Col span={2} style={{ marginTop: 1 }}>
                    <TitleComp title={dt.id} type="Heading2" />
                  </Col>
                  <Col span={17}>
                    {(dt.isTag && (
                      <TagComp title={dt.title} type={dt.type} />
                    )) || <TitleComp title={dt.title} type="Description" />}
                  </Col>
                </Row>
              </Col>
              <Col span={6} align="center">
                <TitleComp
                  type="Heading1"
                  title={Number(dt.views).toLocaleString()}
                />
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default TableComp;
