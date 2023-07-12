import React, { useEffect, useState } from "react";
import { Row, Col, Icon, Spin } from "antd";

import { TitleComp } from "../../../components/Title";
import { TagComp } from "../../../components/Tag";
import { ButtonComp } from "../../../components/ButtonGroup";
import { DatePickerComponent } from "../../../components/DatePicker";
import { BarCharts } from "../../../components/Charts";
import { FilterSection } from "../../../components/FilterSection";

import { numberConvertion, queryIds } from "../../../utils/helper";
import ContentAnalysis from "../../../api/content_analysis/content_analysis";

const TopSection = ({ views }) => {
  const [chartValues, setChartValues] = useState();
  const [loader, setLoader] = useState(false);
  const [dates, setDates] = useState(["2022-10-10", "2022-11-09"]);
  const [ranges, setRanges] = useState("Daily");

  useEffect(() => {
    let chart = {
      series: [],
      labels: []
    };
    const view_id = JSON.parse(localStorage.getItem("view_id"));
    setLoader(true);
    if (ranges === "Daily") {
      let q347params = { from: dates[0], to: dates[1], view_id: view_id?.id };
      let params = {
        id: queryIds?.pages?.page_view_by_day,
        parameters: q347params
      };
      ContentAnalysis.query(params.id, params.parameters).then((res) => {
        let result = res?.data?.query_result?.data?.rows;

        if (result?.length > 0) {
          result.forEach((e) => {
            chart.series.push(e?.page_views);
            chart.labels.push(e?.dt);
          });
        }

        setLoader(false);
        setChartValues(chart);
      });
    }
  }, [dates]);

  const handleDateRange = (daterange) => {
    if (daterange.length > 0) {
      setDates(daterange);
    }
  };

  const handleRangeChange = (r) => {
    setRanges(r);
  };
  return (
    <>
      <Row gutter={20}>
        <Col>
          <ButtonComp
            onChange={handleRangeChange}
            defaultActive="Daily"
            labels={[
              { name: "Daily" },
              { name: "Weekly" },
              { name: "Monthly" }
            ]}
          />
        </Col>
        <Col>
          <DatePickerComponent onChange={handleDateRange} />
        </Col>
      </Row>
      <Row style={{ marginTop: 60 }}>
        <Col span={24}>
          {loader ? (
            <Row style={{ justifyContent: "center", alignItems: "center" }}>
              <Spin size="large" />
            </Row>
          ) : chartValues?.labels.length > 0 &&
            chartValues?.series.length > 0 ? (
            <BarCharts
              labels={chartValues?.labels}
              series={chartValues?.series}
            />
          ) : (
            <Row align="center">No Data Available</Row>
          )}
        </Col>
      </Row>
      <Row style={{ marginTop: 30 }}>
        <Col span={24}>
          <FilterSection tab="author" />
        </Col>
      </Row>
      <Row style={{ marginTop: 35 }} gutter={24}>
        <Col span={19}>
          <Row>
            {views?.map((sec, i) => {
              return (
                <Col key={i} style={{ marginRight: 25 }}>
                  <Row>
                    <TitleComp title={sec.title} type="Description" />
                  </Row>
                  <Row>
                    <TitleComp
                      title={numberConvertion(sec.value)}
                      type="Heading3"
                    />
                  </Row>
                </Col>
              );
            })}
          </Row>
        </Col>
        <Col>
          <Row>
            <Col span={6}>
              <TagComp icon={<Icon type="export" />} title="Export" />
            </Col>
            <Col span={8}>
              <TagComp
                icon={<Icon type="schedule" theme="twoTone" />}
                TopSection
                title="Schedule"
              />
            </Col>
            <Col span={6}>
              <TagComp
                icon={<Icon type="star" theme="filled" />}
                title="Save Views"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default TopSection;
