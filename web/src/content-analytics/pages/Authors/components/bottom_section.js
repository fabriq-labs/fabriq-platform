import React from "react";
import { Row, Col } from "antd";

import { TitleComp } from "../../../components/Title";
import { TagComp } from "../../../components/Tag";

import { numberConvertion } from "../../../utils/helper";

const BottomSection = ({ tab, tableData }) => {
  return (
    <>
      <Row style={{ marginBottom: 10, padding: "0px 20px 0px 20px" }}>
        <Col span={1} />
        <Col span={12}>
          <TitleComp title="Author" type="Heading2" />
        </Col>
        <Col span={2} align="right">
          <TitleComp title="Posts" type="Heading2" />
        </Col>
        <Col span={2} align="right">
          <TitleComp title="Page Views/Post" type="Heading2" />
        </Col>
        <Col span={3} align="center">
          <TitleComp title="Context" type="Heading2" />
        </Col>
        <Col span={2} align="right">
          <TitleComp title="Page Views" type="Heading2" />
        </Col>
      </Row>
      {tableData?.map((data, i) => {
        return (
          <Row
            key={i}
            style={{
              borderBottom: "2px solid #f6f5f7",
              marginTop: 16,
              padding: "0px 20px 30px 20px"
            }}
          >
            <Col span={1}>
              <TitleComp title={i + 1} type="Heading2" />
            </Col>
            <Col span={12}>
              {tab === "individualauthors" ? (
                <TitleComp title={data.author} type="Description" />
              ) : (
                <TagComp title={data?.author} type="2" />
              )}
            </Col>

            <Col span={2} align="right">
              <TitleComp title={data?.count_pub} type="Heading2" />
            </Col>
            <Col span={2} align="right">
              <TitleComp
                title={numberConvertion(data.pageviews / data.count_pub)}
                type="Heading2"
              />
            </Col>
            <Col span={3}>
              <Row style={{ justifyContent: "center", alignItems: "center" }}>
                <TitleComp
                  title={`${numberConvertion(data?.pageviews)} visitors`}
                  type="Description"
                />
              </Row>
              <Row style={{ justifyContent: "center", alignItems: "center" }}>
                <TitleComp
                  title={`${
                    data?.time || data?.count_pub + data?.pageviews
                  } avg. time`}
                  type="Description"
                />
              </Row>
            </Col>
            <Col span={2} align="right">
              <TitleComp
                title={Number(data?.pageviews).toLocaleString()}
                type="Description"
              />
            </Col>
          </Row>
        );
      })}
    </>
  );
};

export default BottomSection;
