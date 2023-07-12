// Article Page
import React, { useEffect, useState } from "react";
import { navigate, useParams, useLocation } from "@reach/router";
import { Table, Radio, Select, Row, Col, Icon, Empty } from "antd";
import * as moment from "moment";
import Helmet from "react-helmet";

import {
  formatNumber,
  months,
  quarters,
  years,
  formatDuration
} from "../../../utils/helper";

// Component
import Category from "../../components/Category/category";
import BarChart from "../../components/Charts/Barchart/barchart";
import StackedBarChart from "../../components/Charts/Stackedchart/stackedBarChart";
import LineChart from "../../components/Charts/Linechart/linechart";
import FunnelRechart from "../../components/Charts/Funnelchart/funnelchart";
import notification from "../../../api/notification";
import { Skeleton } from "../../../components/Skeleton";


// Style
import "./article.css";

// API
import { ArticleQuery } from "../../api/article";

const DetailsCard = (props) => {
  const {
    title,
    current_percentage,
    average_percentage,
    description,
    subDescription
  } = props;
  let betterFormattedDuration;
  let betterAverageFormattedDuration;
  if (title === "Time on Page") {
    const duration = moment.duration(current_percentage, "seconds");
    const averageDuration = moment.duration(average_percentage, "seconds");

    betterFormattedDuration = formatDuration(duration, "35px", "45px");
    betterAverageFormattedDuration = formatDuration(
      averageDuration,
      "10px",
      "14px"
    );
  }

  let currentvalue =
    title === "Time on Page"
      ? betterFormattedDuration
      : `${current_percentage}%`;
  let averageValue =
    title === "Time on Page"
      ? betterAverageFormattedDuration
      : `${average_percentage}%`;
  return (
    <div className="details-id-card-wrapper">
      <div className="details-id-card-content">
        <div className="id-card-title">{title}</div>
        <div className="id-card-current-percentage">{currentvalue}</div>
        <div className="id-card-divider"></div>
        <div className="id-card-average-value">{averageValue}</div>
        <div
          className="id-card-description"
          style={{ margin: title === "Time on Page" ? "6px 0" : "0 0 34px 0" }}
        >
          {description}
        </div>
        {title === "Time on Page" && (
          <div className="id-card-subDescription">{subDescription}</div>
        )}
      </div>
    </div>
  );
};

const BreakDownData = (props) => {
  const { columns, data, tableValue } = props;

  return (
    <div className="breakdown-data-wrapper">
      <div className="breakdown-value-content">
        <div>
          {" "}
          <StackedBarChart
            series={data}
            colors={["#172a95", "#f8b633", "#e63111", "#0add54", "#7f9386"]}
            legend={false}
            height={80}
          />
        </div>
        <div style={{ padding: "0 30px" }}>
          <Table
            columns={columns}
            dataSource={tableValue}
            pagination={false}
            className="custom-table"
          />
        </div>
      </div>
    </div>
  );
};

const Article = () => {
  const [id, setID] = useState(0);
  const [countryListLabel, setCountryListLabel] = useState([]);
  const [countryListValue, setCountryListValue] = useState([]);
  const [exitPageData, setExitPageData] = useState(null);
  const [loader, setLoader] = useState(true);
  const [segementValue, setSegementValue] = useState("");
  const [selectedChartValue, setSelectedChartValue] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [articleChartData, setArticleChartData] = useState({});
  const [outerPageData, setOuterPageData] = useState([]);
  const [exitPageContent, setExitPageContent] = useState([]);
  const [selectedBreakdownValue, setSelectedBreakdownValue] = useState("");
  const [tableVistitorData, setTableVisitorData] = useState([]);
  const [scrollDepthData, setScrollDepthData] = useState([]);
  const [historicalChartResponse, setHistoricalChartResponse] = useState([]);
  const [barchartResponse, setBarChartResponse] = useState({
    labels: [],
    series: [],
    name: ""
  });
  const [articleCurrentChartResponse, setArticleCurrentChartResponse] =
    useState([]);
  const [articleAverageChartResponse, setArticleAverageChartResponse] =
    useState([]);
  const [trafficSourceData, setTrafficSourceData] = useState([]);
  const [mediumDistribution, setMediumDistribution] = useState({});
  const [breakdownDataObject, setBreakDownDataObject] = useState({});
  const [headerData, setHeaderData] = useState([]);
  const [averageTrafficSource, setAverageTrafficSource] = useState({});
  const [imageIndex, setImageIndex] = useState(0);
  const [searchTop, setSearchTop] = useState([]);
  const [internalTop, setInternalTop] = useState([]);
  const [socialTop, setSocialTop] = useState([]);
  const [referalTop, setReferalTop] = useState([]);
  const { articleId } = useParams();
  const { Option } = Select;
  const location = useLocation();

  useEffect(() => {
    getArticleDetails("real-time", articleId);
    setSegementValue("real-time");
    setSelectedChartValue("page_views");
    setSelectedBreakdownValue("social");
  }, [articleId]);

  useEffect(() => {
    const state = location.state;
    if (state?.image) {
      setImageIndex(state.image);
    }
  }, []);

  useEffect(() => {
    if (articleCurrentChartResponse && articleAverageChartResponse) {
      realtimeChartDataFormat(selectedChartValue);
    }
  }, [articleCurrentChartResponse, articleAverageChartResponse]);

  useEffect(() => {
    if (trafficSourceData) {
      trafficSourceFormat();
    }
  }, [trafficSourceData]);

  const getArticleDetails = (value, id) => {
    getRealtimeData(id);
  };

  const getMonthlyData = (value) => {
    const siteDetails = JSON.parse(localStorage.getItem("view_id"));
    const articleId = id;
    const currentYear = new Date().getFullYear();

    setLoader(true);
    ArticleQuery.getMonthlyData(
      siteDetails?.site_id,
      articleId,
      currentYear,
      parseInt(value)
    )
      .then((res) => {
        const data = res?.data?.data?.ArticleMonthly;
        setHistoricalChartResponse(res?.data?.data);
        setTrafficSourceData(res?.data?.data);
        setAverageTrafficSource(
          res?.data?.data?.ArticleMonthlyAgg?.aggregate
            ?.avg
        );
        setHeaderData(data?.[0]);
        generateDataForChart(res?.data?.data, parseInt(value));
        chartData(data[0], data?.[0]?.country_distribution);
        setExitPageContent(
          res?.data?.data?.ArticleExitDistributionMonthly
        );
        setExitPageData(
          res?.data?.data
            ?.ArticleExitDistributionMonthlyAgg
        );
        setSearchTop(res?.data?.data?.Search);
        setInternalTop(res?.data?.data?.Internal);
        setSocialTop(res?.data?.data?.Social);
        setReferalTop(res?.data?.data?.Refferal);

        // scroll depth data
        const scrollRes =
          res?.data?.data?.ArticleScrollDepthMonthly?.[0];

        const scrollData = [
          { name: "Scroll Depth 30%", value: scrollRes?.entered_users },
          { name: "Scroll Depth 70%", value: scrollRes?.crossed_70_users },
          { name: "Scroll Depth 100%", value: scrollRes?.crossed_100_users }
        ];

        setScrollDepthData(scrollData);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        notification.error(err?.message);
      });
  };

  const getYearlyData = (value) => {
    const siteDetails = JSON.parse(localStorage.getItem("view_id"));
    const articleId = id;

    setLoader(true);
    ArticleQuery.getYearlyData(siteDetails?.site_id, articleId, parseInt(value))
      .then((res) => {
        const data = res?.data?.data?.ArticleYearly;
        setHistoricalChartResponse(res?.data?.data);
        setTrafficSourceData(res?.data?.data);
        setAverageTrafficSource(
          res?.data?.data?.ArticleYearlyAgg?.aggregate
            ?.avg
        );
        setHeaderData(data?.[0]);
        setSearchTop(res?.data?.data?.Search);
        setInternalTop(res?.data?.data?.Internal);
        setSocialTop(res?.data?.data?.Social);
        setReferalTop(res?.data?.data?.Refferal);
        generateDataForYearChart(res?.data?.data, parseInt(value));
        chartData(data[0], data?.[0]?.country_distribution);
        setExitPageContent(
          res?.data?.data?.ArticleExitDistributionYearly
        );
        setExitPageData(
          res?.data?.data
            ?.ArticleExitDistributionYearlyAgg
        );

        // scroll depth data
        const scrollRes =
          res?.data?.data?.ArticleScrollDepthYearly?.[0];
        const scrollData = [
          { name: "Scroll Depth 30%", value: scrollRes?.entered_users },
          { name: "Scroll Depth 70%", value: scrollRes?.crossed_70_users },
          { name: "Scroll Depth 100%", value: scrollRes?.crossed_100_users }
        ];

        setScrollDepthData(scrollData);

        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        notification.error(err?.message);
      });
  };

  const getQuarterlyData = (value) => {
    const siteDetails = JSON.parse(localStorage.getItem("view_id"));
    const articleId = id;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    setLoader(true);
    ArticleQuery.getQuarterlyData(
      siteDetails?.site_id,
      articleId,
      currentYear,
      value
    )
      .then((res) => {
        const data = res?.data?.data?.ArticleQuaterly;
        setHistoricalChartResponse(res?.data?.data);
        setTrafficSourceData(res?.data?.data);
        setAverageTrafficSource(
          res?.data?.data?.ArticleQuaterlyAgg?.aggregate
            ?.avg
        );
        setHeaderData(data?.[0]);
        setSearchTop(res?.data?.data?.Search);
        setInternalTop(res?.data?.data?.Internal);
        setSocialTop(res?.data?.data?.Social);
        setReferalTop(res?.data?.data?.Refferal);
        generateDataForQuarterChart(res?.data?.data, value);
        chartData(data[0], data?.[0]?.country_distribution);
        setExitPageContent(
          res?.data?.data?.ArticleExitDistributionQuaterly
        );
        setExitPageData(
          res?.data?.data
            ?.ArticleExitDistributionQuaterlyAgg
        );

        const scrollRes =
          res?.data?.data?.ArticleScrollDepthQuaterly?.[0];
        const scrollData = [
          { name: "Scroll Depth 30%", value: scrollRes?.entered_users },
          { name: "Scroll Depth 70%", value: scrollRes?.crossed_70_users },
          { name: "Scroll Depth 100%", value: scrollRes?.crossed_100_users }
        ];

        setScrollDepthData(scrollData);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        notification.error(err?.message);
      });
  };

  const getRealtimeData = (article_ID, date) => {
    setID(article_ID);
    setLoader(true);
    let real_time_date = localStorage.getItem("real_time_date");
    const currentDate = new Date();

    // Format the date to "YYYY-MM-DD" format
    const formattedDate = currentDate.toISOString().split("T")[0];
    let period_date = real_time_date ? real_time_date : formattedDate;

    let siteDetails = JSON.parse(localStorage.getItem("view_id"));

    Promise.all([
      ArticleQuery.get_article_details(
        period_date,
        `${article_ID}`,
        siteDetails?.site_id
      )
    ])
      .then((values) => {
        if (values?.length > 0) {
          let chartRes =
            values?.[0]?.data?.data?.ArticleHourlyAverage;
          setArticleAverageChartResponse(chartRes);

          setHeaderData(
            values?.[0]?.data?.data?.ArticleDaily[0]
          );
          setTrafficSourceData(values?.[0]?.data?.data);
          setAverageTrafficSource(
            values?.[0]?.data?.data?.ArticleDailyAgg
              ?.aggregate?.avg
          );
          setSearchTop(values?.[0]?.data?.data?.Search);
          setInternalTop(values?.[0]?.data?.data?.Internal);
          setSocialTop(values?.[0]?.data?.data?.Social);
          setReferalTop(values?.[0]?.data?.data?.Refferal);
          setExitPageData(
            values?.[0]?.data?.data
              ?.ArticleExitDistributionDailyAgg
          );
          chartData(
            values?.[0]?.data?.data?.ArticleDaily[0],
            values?.[0]?.data?.data?.ArticleDaily[0]
              ?.country_distribution
          );
          let hours_view =
            values?.[0]?.data?.data?.ArticleHourly;

          setExitPageContent(
            values?.[0]?.data?.data
              ?.ArticleExitDistributionDaily
          );

          setArticleCurrentChartResponse(hours_view);
          const scrollRes =
            values?.[0]?.data?.data
              ?.ArticleScrollDepthDaily?.[0];

          const scrollData = [
            { name: "Scroll Depth 30%", value: scrollRes?.entered_users },
            { name: "Scroll Depth 70%", value: scrollRes?.crossed_70_users },
            { name: "Scroll Depth 100%", value: scrollRes?.crossed_100_users }
          ];
          setScrollDepthData(scrollData);
          setLoader(false);
        }
      })
      .catch((err) => {
        setLoader(false);
        notification.error(err?.message);
      });
  };

  const generateDataForChart = (data, month, value) => {
    const list = data?.ArticleDaily;
    const currentMonth = data?.ArticleMonthly?.[0];
    const labels = Array.from(
      { length: new Date(currentMonth?.period_year, month, 0).getDate() },
      (_, i) => i + 1
    );

    let selectedItem = "";
    if (value) {
      selectedItem = value;
    } else {
      selectedItem = selectedChartValue;
    }

    const outputArray = labels.map((label) => {
      const day = parseInt(label);
      const dataItem = list?.find(
        (item) =>
          new Date(item.period_date).getMonth() + 1 === month &&
          new Date(item.period_date).getDate() === day
      );

      return [
        day,
        dataItem
          ? selectedItem === "page_views"
            ? dataItem.page_views
            : dataItem.users
          : 0
      ];
    });

    let series = [
      {
        name: selectedItem === "page_views" ? "Page Views" : "Users",
        data: outputArray
      }
    ];

    const yValues = series?.[0]?.data.map((entry) => entry[1]);
    setBarChartResponse((prevState) => ({
      ...prevState,
      labels,
      series: yValues,
      name: selectedItem === "page_views" ? "Page Views" : "Users"
    }));
  };

  const generateDataForYearChart = (data, year, value) => {
    const list = data?.ArticleMonthly;
    const labels = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return month;
    });

    let selectedItem = "";
    if (value) {
      selectedItem = value;
    } else {
      selectedItem = selectedChartValue;
    }

    const outputArray = labels.map((label) => {
      const day = parseInt(label);
      const dataItem = list.find(
        (item) => item.period_year === year && item?.period_month === day
      );

      return [
        day,
        dataItem
          ? selectedItem === "page_views"
            ? dataItem.page_views
            : dataItem.users
          : 0
      ];
    });

    let series = [
      {
        name: selectedItem === "page_views" ? "Page Views" : "Users",
        data: outputArray
      }
    ];

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const yValues = series?.[0]?.data.map((entry) => entry?.[1]);
    const monthLabels = labels.map((number) => monthNames[number - 1]);
    setBarChartResponse((prevState) => ({
      ...prevState,
      labels: monthLabels,
      series: yValues,
      name: selectedItem === "page_views" ? "Page Views" : "Users"
    }));
  };

  const generateDataForQuarterChart = (data, quarter, value) => {
    const list = data?.ArticleMonthly;
    const labels = Array.from({ length: 3 }, (_, i) => {
      const startMonth = (quarter - 1) * 3 + 1;
      const month = startMonth + i;
      return month;
    });

    let selectedItem = "";
    if (value) {
      selectedItem = value;
    } else {
      selectedItem = selectedChartValue;
    }

    const outputArray = labels.map((label) => {
      const day = parseInt(label);
      const dataItem = list.find((item) => item?.period_month === day);

      return [
        day,
        dataItem
          ? selectedItem === "page_views"
            ? dataItem.page_views
            : dataItem.users
          : 0
      ];
    });

    let series = [
      {
        name: selectedItem === "page_views" ? "Page Views" : "Users",
        data: outputArray
      }
    ];

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const yValues = series?.[0]?.data.map((entry) => entry?.[1]);
    const monthLabels = labels.map((number) => monthNames[number - 1]);
    setBarChartResponse((prevState) => ({
      ...prevState,
      labels: monthLabels,
      series: yValues,
      name: selectedItem === "page_views" ? "Page Views" : "Users"
    }));
  };

  const trafficSourceFormat = () => {
    let trafficSourceInfo = [];
    let data = {};
    let data_Social = {};
    let data_Device = {};
    let totalUsers = 0;
    let newUsersPercentage = 0;
    let usersPercentage = 0;

    if (segementValue === "real-time") {
      trafficSourceInfo = trafficSourceData?.ArticleDaily?.[0];
      data = trafficSourceInfo?.referrer_distribution;
      data_Social = trafficSourceInfo?.social_distribution;
      data_Device = trafficSourceInfo?.device_distribution;
      totalUsers = trafficSourceInfo?.users + trafficSourceInfo?.new_users;
      newUsersPercentage = (trafficSourceInfo?.new_users / totalUsers) * 100;
      usersPercentage =
        ((totalUsers - trafficSourceInfo?.new_users) / totalUsers) * 100;
    } else if (segementValue === "monthly") {
      trafficSourceInfo =
        trafficSourceData?.ArticleMonthly?.[0];
      data = trafficSourceInfo?.referrer_distribution;
      data_Social = trafficSourceInfo?.social_distribution;
      data_Device = trafficSourceInfo?.device_distribution;
      totalUsers = trafficSourceInfo?.users + trafficSourceInfo?.new_users;
      newUsersPercentage = (trafficSourceInfo?.new_users / totalUsers) * 100;
      usersPercentage =
        ((totalUsers - trafficSourceInfo?.new_users) / totalUsers) * 100;
    } else if (segementValue === "yearly") {
      trafficSourceInfo = trafficSourceData?.ArticleYearly?.[0];
      data = trafficSourceInfo?.referrer_distribution;
      data_Social = trafficSourceInfo?.social_distribution;
      data_Device = trafficSourceInfo?.device_distribution;
      totalUsers = trafficSourceInfo?.users + trafficSourceInfo?.new_users;
      newUsersPercentage = (trafficSourceInfo?.new_users / totalUsers) * 100;
      usersPercentage =
        ((totalUsers - trafficSourceInfo?.new_users) / totalUsers) * 100;
    } else if (segementValue === "quarterly") {
      trafficSourceInfo =
        trafficSourceData?.ArticleQuaterly?.[0];
      data = trafficSourceInfo?.referrer_distribution;
      data_Social = trafficSourceInfo?.social_distribution;
      data_Device = trafficSourceInfo?.device_distribution;
      totalUsers = trafficSourceInfo?.users + trafficSourceInfo?.new_users;
      newUsersPercentage = (trafficSourceInfo?.new_users / totalUsers) * 100;
      usersPercentage =
        ((totalUsers - trafficSourceInfo?.new_users) / totalUsers) * 100;
    }
    const arr = [];
    if (trafficSourceInfo && Object.keys(trafficSourceInfo)?.length > 0) {
      const totalSum =
        data &&
        Object.keys(data).length > 0 &&
        Object.values(data).reduce((acc, val) => acc + val, 0);

      const totalSumSocial =
        data_Social &&
        Object.keys(data_Social).length > 0 &&
        Object.values(data_Social).reduce((acc, val) => acc + val, 0);

      const totalSumDevice =
        data_Device &&
        Object.keys(data_Device).length > 0 &&
        Object.values(data_Device).reduce((acc, val) => acc + val, 0);

      // Calculate percentage for each category
      const percentageData = {};
     
      const percentageSocial = {};
      const arrSocial = [];
      const percentageDevice = {};
      const arrDevice = [];
      if (data && Object.keys(data).length > 0) {
        for (const [category, value] of Object.entries(data)) {
          percentageData[category] = (value / totalSum) * 100;
        }
      }

      if (data_Social && Object.keys(data_Social).length > 0) {
        for (const [category, value] of Object.entries(data_Social)) {
          percentageSocial[category] = (value / totalSumSocial) * 100;
        }
      }

      if (data_Device && Object.keys(data_Device).length > 0) {
        for (const [category, value] of Object.entries(data_Device)) {
          percentageDevice[category] = (value / totalSumDevice) * 100;
        }
      }

      if (percentageData && Object.keys(percentageData).length > 0) {
        let newChartFormatData = {
          Social: percentageData["Social"]
            ? percentageData["Social"]
            : percentageData["social"],
          Referral: percentageData["Referral"]
            ? percentageData["Referral"]
            : percentageData["unknown"],
          Search: percentageData["search"],
          Internal: percentageData["Internal"]
            ? percentageData["Internal"]
            : percentageData["internal"],
          Direct: percentageData["Direct"]
            ? percentageData["Direct"]
            : percentageData["Other"]
        };

        for (const key in newChartFormatData) {
          arr.push({ name: key, data: [newChartFormatData[key] || 0] });
        }
      }

      if (percentageSocial && Object.keys(percentageSocial).length > 0) {
        for (const key in percentageSocial) {
          arrSocial.push({ name: key, data: [percentageSocial[key]] });
        }
      }

      if (percentageDevice && Object.keys(percentageDevice).length > 0) {
        for (const key in percentageDevice) {
          arrDevice.push({ name: key, data: [percentageDevice[key]] });
        }
      }

      let mediumDataFormat = {
        value: data,
        percentage: percentageData
      };

      let breakdownTempValue = {
        social: arrSocial,
        device: arrDevice,
        visitor: [
          { name: "New visitor", data: [newUsersPercentage] },
          { name: "Returning Visitor", data: [usersPercentage] }
        ]
      };

      const tableData = breakdownTempValue.social.map((item) => {
        return {
          key: item.name,
          name: item.name,
          data: item.data[0]
        };
      });

      setTableVisitorData(tableData);
      setOuterPageData(arr);
      setMediumDistribution(mediumDataFormat);
      setBreakDownDataObject(breakdownTempValue);
    } else {
      let mediumDataFormat = {
        value: data,
        percentage: []
      };

      let breakdownTempValue = {
        social: [],
        device: [],
        visitor: []
      };

      const tableData = breakdownTempValue.social.map((item) => {
        return {
          key: item.name,
          name: item.name,
          data: item.data[0]
        };
      });

      setTableVisitorData(tableData);
      setOuterPageData(arr);
      setMediumDistribution(mediumDataFormat);
      setBreakDownDataObject(breakdownTempValue);
    }
  };

  const chartData = (data, country_distribution_data) => {
    let dataValue = country_distribution_data;

    if (dataValue) {
      const arr = Object.entries(dataValue);

      // Sort the array in descending order based on the values
      arr.sort((a, b) => b[1] - a[1]);

      // Convert the sorted array back into an object
      const sortedObj = Object.fromEntries(arr);
      const countryKeysArray = [];
      Object.keys(sortedObj).forEach((key) => {
        countryKeysArray.push(key);
      });
      let objValue = Object.values(sortedObj);
      setCountryListLabel(countryKeysArray, sortedObj);
      setCountryListValue(objValue);
    }
    else {
      setCountryListLabel([]);
      setCountryListValue([]);
    }
  };

  const realtimeChartDataFormat = (value) => {
    if (articleCurrentChartResponse && articleAverageChartResponse) {
      const lableValue = [
        0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23
      ];

      const currentUserValues = lableValue.map((hour) => {
        const matchingData = articleCurrentChartResponse.find(
          (obj) => obj.hour === hour
        );
        return matchingData ? matchingData.users : 0;
      });

      const currentPageViewsValues = lableValue.map((hour) => {
        const matchingData = articleCurrentChartResponse.find(
          (obj) => obj.hour === hour
        );
        return matchingData ? matchingData.page_views : 0;
      });

      const averagePageViewsValue = lableValue.map((hour) => {
        const matchingData = articleAverageChartResponse.find(
          (obj) => obj.hour === hour
        );
        return matchingData ? matchingData.page_views : 0;
      });

      const averageUserValues = lableValue.map((hour) => {
        const matchingData = articleAverageChartResponse.find(
          (obj) => obj.hour === hour
        );
        return matchingData ? matchingData.users : 0;
      });

      if (
        currentPageViewsValues.length > 0 &&
        averagePageViewsValue.length > 0
      ) {
        let chartSeriesFormat = {
          series: [
            {
              name: "Current",
              data:
                value === "page_views"
                  ? currentPageViewsValues
                  : currentUserValues
            },
            {
              name: "Average",
              data:
                value === "page_views"
                  ? averagePageViewsValue
                  : averageUserValues
            }
          ],
          label: lableValue
        };

        setArticleChartData(chartSeriesFormat);
      }
    }
  };

  const columnsVisitor = [
    {
      title: "Visitor",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Percentage",
      dataIndex: "data",
      key: "data",
      render: (text) => <div>{`${text.toFixed(1)} %`}</div>
    }
  ];

  const handleChangeSegement = (e) => {
    setSegementValue(e.target.value);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const currentQuarter = Math.ceil(currentMonth / 3);

    setBarChartResponse((prevState) => ({
      ...prevState,
      labels: [],
      series: []
    }));
    setScrollDepthData([]);
    setSelectedBreakdownValue("social");

    if (e.target.value === "monthly") {
      handleMonthChange(currentMonth);
    } else if (e.target.value === "yearly") {
      handleYearChange(currentYear);
    } else if (e.target.value === "quarterly") {
      handleQuarterlyChange(currentQuarter);
    } else {
      getRealtimeData(articleId);
    }
  };

  const handleMonthChange = (value) => {
    setScrollDepthData([]);
    getMonthlyData(value);
    setSelectedMonth(value);
  };

  const handleYearChange = (value) => {
    setScrollDepthData([]);
    getYearlyData(value);
    setSelectedYear(value);
  };

  const handleQuarterlyChange = (value) => {
    setScrollDepthData([]);
    getQuarterlyData(value);
    setSelectedQuarter(value);
  };

  const handleChangeChart = (value) => {
    setSelectedChartValue(value);

    if (segementValue === "monthly") {
      generateDataForChart(historicalChartResponse, selectedMonth, value);
    } else if (segementValue === "yearly") {
      generateDataForYearChart(historicalChartResponse, selectedYear, value);
    } else if (segementValue === "quarterly") {
      generateDataForQuarterChart(
        historicalChartResponse,
        selectedQuarter,
        value
      );
    } else {
      realtimeChartDataFormat(value);
    }
  };

  const handleChangeBreakdownSegment = (e) => {
    setSelectedBreakdownValue(e.target.value);
    const tableData = breakdownDataObject[e.target.value].map((item) => {
      return {
        key: item.name,
        name: item.name,
        data: item.data[0]
      };
    });
    setTableVisitorData(tableData);
  };

  const redirectToArticlePage = (id) => {
    navigate(`/content/article/${id}`);
  };

  let bounceRate = 0;
  let timeOnPage = 0;
  if (segementValue === "real-time") {
    bounceRate =
      trafficSourceData?.ArticleDaily?.[0]?.bounce_rate;
    timeOnPage =
      trafficSourceData?.ArticleDaily?.[0]?.attention_time || 0;
  } else if (segementValue === "monthly") {
    bounceRate =
      trafficSourceData?.ArticleMonthly?.[0]?.bounce_rate;
    timeOnPage =
      trafficSourceData?.ArticleMonthly?.[0]
        ?.total_time_spent || 0;
  } else if (segementValue === "yearly") {
    bounceRate =
      trafficSourceData?.ArticleYearly?.[0]?.bounce_rate;
    timeOnPage =
      trafficSourceData?.ArticleYearly?.[0]?.total_time_spent ||
      0;
  } else if (segementValue === "quarterly") {
    bounceRate =
      trafficSourceData?.ArticleQuaterly?.[0]?.bounce_rate;
    timeOnPage =
      trafficSourceData?.ArticleQuaterly?.[0]
        ?.total_time_spent || 0;
  }

  let averagebounceRate = averageTrafficSource?.bounce_rate;
  function calculateReadability(bounceRate) {
    const score = (1 / bounceRate) * 100;
    return score.toFixed(2);
  }

  function getReadabilityValue(bounceRate) {
    if (bounceRate) {
      return calculateReadability(bounceRate);
    } else {
      return 0;
    }
  }

  const readabilityValue = getReadabilityValue(bounceRate);
  const averageReadabilityValue = getReadabilityValue(averagebounceRate);

  let helmetTitle = headerData?.article?.title
    ? headerData?.article?.title
    : "Title";

  const yearsOption = years();

  const handleClickBack = () => {
    navigate("/content/article");
  };

  if (articleChartData?.label?.length > 0) {
    articleChartData.label = articleChartData.label.map((item) => {
      return moment(item, "h:mm a").format("h:mm a");
    });
  }

  return (
    <div className="article-wrapper">
      <Helmet>
        <title>{`${helmetTitle}`} | Article</title>
      </Helmet>
      <div className="article-content">
        <div style={{ display: "flex", marginTop: 25 }}>
          <div className="back-image" onClick={handleClickBack}>
            <img src="/images/back.png" alt="back" width={30} height={30} />
          </div>
          <div className="article-segement-wrapper">
            <Radio.Group onChange={handleChangeSegement} value={segementValue}>
              <Radio.Button value="real-time">Real-Time</Radio.Button>
              <Radio.Button value="monthly">Monthly</Radio.Button>
              <Radio.Button value="quarterly">Quarterly</Radio.Button>
              <Radio.Button value="yearly">Yearly</Radio.Button>
            </Radio.Group>
          </div>
          {segementValue === "monthly" && (
            <div className="article-datepicker">
              <Select
                placeholder="Select a month"
                value={selectedMonth}
                onChange={handleMonthChange}
                getPopupContainer={(triggerNode) =>
                  triggerNode?.parentNode || document.body
                }
              >
                {months.map((month) => (
                  <Option key={month.value} value={month.value}>
                    {month.label}
                  </Option>
                ))}
              </Select>
            </div>
          )}
          {segementValue === "quarterly" && (
            <div className="article-datepicker">
              <Select
                placeholder="Select a quarter"
                value={selectedQuarter}
                onChange={handleQuarterlyChange}
                getPopupContainer={(triggerNode) =>
                  triggerNode?.parentNode || document.body
                }
              >
                {quarters.map((quarter) => (
                  <Option key={quarter.value} value={quarter.value}>
                    {quarter.label}
                  </Option>
                ))}
              </Select>
            </div>
          )}
          {segementValue === "yearly" && (
            <div className="article-datepicker">
              <Select
                placeholder="Select a year"
                value={selectedYear}
                onChange={handleYearChange}
                getPopupContainer={(triggerNode) =>
                  triggerNode?.parentNode || document.body
                }
              >
                {yearsOption?.map((year) => (
                  <Option key={year.value} value={year.value}>
                    {year.label}
                  </Option>
                ))}
              </Select>
            </div>
          )}
        </div>
        {loader ? (
          <div>
            <Skeleton />
          </div>
        ) : (
          <>
            <div className="article-heading">
              <div className="article-heading-row">
                <div className="heading-row-category">
                  <Category
                    id={articleId}
                    view="article"
                    data={headerData}
                    imageIndex={imageIndex}
                  />
                </div>
                <div className="flex" style={{ justifyContent: "flex-end" }}>
                  <div className="article-id-chart-header">
                    <div className="article-id-chart-select">
                      <Select
                        onChange={handleChangeChart}
                        value={selectedChartValue}
                        getPopupContainer={(triggerNode) =>
                          triggerNode?.parentNode || document.body
                        }
                      >
                        <Option value="page_views">Page Views</Option>
                        <Option value="users">Users</Option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="article-id-chart">
              <div style={{ marginTop: "50px" }} className="article-id-content">
                {segementValue === "real-time" ? (
                  <LineChart
                    labels={articleChartData?.label}
                    series={articleChartData?.series}
                    colors={["#A3E0FF", "#c4e0d7"]}
                    height={200}
                  />
                ) : (
                  <BarChart
                    labels={barchartResponse?.labels}
                    series={barchartResponse?.series}
                    name={barchartResponse?.name}
                    colors={["#A3E0FF"]}
                    width={"40%"}
                    tickAmount={true}
                  />
                )}
              </div>
            </div>
            <div className="article-country-content">
              <div className="article-country-heading">
                Where is this being read?
              </div>
              <div className="article-country-chart">
                <BarChart
                  labels={countryListLabel}
                  series={countryListValue}
                  name="Users"
                  colors={["#A3E0FF"]}
                  tickAmount={false}
                />
              </div>
            </div>
            <div className="article-id-details-card-warpper">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <DetailsCard
                    title="Readability"
                    current_percentage={readabilityValue}
                    average_percentage={averageReadabilityValue}
                    description="Site average"
                  />
                </Col>
                <Col span={8}>
                  <DetailsCard
                    title="Recirculation"
                    current_percentage={
                      exitPageData?.aggregate?.sum?.recirculation_count?.toFixed(
                        2
                      ) || 0
                    }
                    average_percentage={
                      exitPageData?.aggregate?.avg?.recirculation_count?.toFixed(
                        2
                      ) || 0
                    }
                    description="Site average"
                  />
                </Col>
                <Col span={8}>
                  <DetailsCard
                    title="Time on Page"
                    current_percentage={timeOnPage}
                    average_percentage={averageTrafficSource?.total_time_spent}
                    description="Time to read the article through"
                    subDescription="Average time displayed for all types of devices"
                  />
                </Col>
              </Row>
            </div>
            <div className="article-other-data-wrapper">
              <div className="article-referrers-heading">Referrers</div>
              <div className="article-other-stacked-content">
                <StackedBarChart
                  series={outerPageData}
                  colors={[
                    "#172a95",
                    "#f8b633",
                    "#e63111",
                    "#0add54",
                    "#7f9386"
                  ]}
                  max={100}
                  legend={false}
                  height={80}
                />
              </div>
              <div className="article-other-data-content">
                <Row type="flex" justify="space-between">
                  <Col span={4}>
                    <div class="card">
                      <div className="row1">
                        <img
                          src="/images/network.png"
                          alt="social"
                          width={24}
                          height={24}
                        />
                        <div className="row-title">Social</div>
                      </div>
                      <div className="row2" style={{ color: "#172a95" }}>
                        {formatNumber(
                          mediumDistribution?.value?.Social ||
                            mediumDistribution?.value?.social ||
                            0
                        )}
                        &nbsp;
                        <span className="percentage">
                          {mediumDistribution?.percentage?.Social?.toFixed(1) ||
                            mediumDistribution?.percentage?.social?.toFixed(
                              1
                            ) ||
                            0}
                          %
                        </span>
                      </div>
                      <div className="row3">
                        {mediumDistribution?.value?.social &&
                        mediumDistribution?.value?.social !== 0 &&
                        socialTop?.[0]?.refr_source ? (
                          <div>
                            <span style={{ color: "#172a95" }}>
                              {socialTop?.[0]?.refr_source}
                            </span>{" "}
                            is Top Social
                          </div>
                        ) : (
                          "-"
                        )}{" "}
                      </div>
                    </div>
                  </Col>
                  <Col span={4}>
                    <div class="card">
                      <div className="row1">
                        <img
                          src="/images/referral.png"
                          alt="referral"
                          width={24}
                          height={24}
                        />
                        <div className="row-title">Referral</div>
                      </div>
                      <div className="row2" style={{ color: "#f8b633" }}>
                        {formatNumber(
                          mediumDistribution?.value?.Referral ||
                            mediumDistribution?.value?.unknown?.toFixed(1) ||
                            0
                        )}
                        &nbsp;
                        <span className="percentage">
                          {mediumDistribution?.percentage?.Referral?.toFixed(
                            1
                          ) ||
                            mediumDistribution?.percentage?.unknown?.toFixed(
                              1
                            ) ||
                            0}
                          %
                        </span>
                      </div>
                      <div className="row3">
                      {(mediumDistribution?.value?.Referral &&
                          mediumDistribution?.value?.Referral !== 0 &&
                          referalTop?.[0]?.refr_urlhost) ||
                        (mediumDistribution?.value?.unknown &&
                          mediumDistribution?.value?.unknown !== 0 &&
                          referalTop?.[0]?.refr_urlhost) ? (
                          <div>
                            <span style={{ color: "#f8b633" }}>
                              {referalTop?.[0]?.refr_urlhost.length > 10
                                ? `${referalTop?.[0]?.refr_urlhost?.substring(
                                    0,
                                    10
                                  )}...`
                                : referalTop?.[0]?.refr_urlhost}
                            </span>{" "}
                            is Top Referral
                          </div>
                        ) : (
                          "-"
                        )}{" "}
                      </div>
                    </div>
                  </Col>
                  <Col span={4}>
                    <div class="card">
                      <div className="row1">
                        <img
                          src="/images/search.png"
                          alt="search"
                          width={24}
                          height={24}
                        />
                        <div className="row-title">Search</div>
                      </div>
                      <div className="row2" style={{ color: "#e63111" }}>
                        {formatNumber(mediumDistribution?.value?.search || 0)}
                        &nbsp;
                        <span className="percentage">
                          {mediumDistribution?.percentage?.search?.toFixed(1) ||
                            0}
                          %
                        </span>
                      </div>
                      <div className="row3">
                        {mediumDistribution?.value?.search &&
                        mediumDistribution?.value?.search !== 0 &&
                        searchTop?.[0]?.refr_source ? (
                          <div>
                            <span style={{ color: "#e63111" }}>
                              {searchTop?.[0]?.refr_source}
                            </span>{" "}
                            is Top Search
                          </div>
                        ) : (
                          "-"
                        )}{" "}
                      </div>
                    </div>
                  </Col>
                  <Col span={4}>
                    <div class="card">
                      <div className="row1">
                        <img
                          src="/images/minimize.png"
                          alt="internal"
                          width={24}
                          height={24}
                        />
                        <div className="row-title">Internal</div>
                      </div>
                      <div className="row2" style={{ color: "#0add54" }}>
                        {formatNumber(
                          mediumDistribution?.value?.Internal ||
                            mediumDistribution?.value?.internal ||
                            0
                        )}
                        &nbsp;
                        <span className="percentage">
                          {mediumDistribution?.percentage?.Internal?.toFixed(
                            1
                          ) ||
                            mediumDistribution?.percentage?.internal?.toFixed(
                              1
                            ) ||
                            0}
                          %
                        </span>
                      </div>
                      <div className="row3">
                      {(mediumDistribution?.value?.Internal &&
                          mediumDistribution?.value?.Internal !== 0 &&
                          internalTop?.[0]?.page_urlpath) ||
                        (mediumDistribution?.value?.internal &&
                          mediumDistribution?.value?.internal !== 0 &&
                          internalTop?.[0]?.page_urlpath) ? (
                          <div>
                            <span
                              style={{ color: "#0add54", cursor: "pointer" }}
                              title={internalTop?.[0]?.page_urlpath}
                            >
                              {internalTop?.[0]?.page_urlpath.length > 10
                                ? `${internalTop?.[0]?.page_urlpath?.substring(
                                    0,
                                    10
                                  )}...`
                                : internalTop?.[0]?.page_urlpath}
                            </span>{" "}
                            is Top Internal
                          </div>
                        ) : (
                          "-"
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col span={4}>
                    <div class="card">
                      <div className="row1">
                        <img
                          src="/images/direct.png"
                          alt="direct"
                          width={24}
                          height={24}
                        />
                        <div className="row-title">Direct</div>
                      </div>
                      <div className="row2" style={{ color: "#7f9386" }}>
                        {formatNumber(
                          mediumDistribution?.value?.Direct ||
                            mediumDistribution?.value?.Other ||
                            0
                        )}
                        &nbsp;
                        <span className="percentage">
                          {mediumDistribution?.percentage?.Direct?.toFixed(1) ||
                            mediumDistribution?.percentage?.Other?.toFixed(1) ||
                            0}
                          %
                        </span>
                      </div>
                      <div className="row3" style={{ color: "#7f9386" }}>
                        {" "}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="article-reading-depth-content">
              <div className="article-funnel-chart">
                <div className="article-scroll-heading">Scroll Depth</div>
                {scrollDepthData?.length > 0 ? (
                  <FunnelRechart data={scrollDepthData} />
                ) : (
                  <Empty />
                )}
              </div>
              <div className="article-reading-chart">
                <div className="article-exit-heading">
                  Where readers go next
                </div>
                <div className="exit-page-wrapper">
                  {exitPageContent?.length > 0 ? (
                    exitPageContent?.map((item) => {
                      return (
                        <div className="exit-page-content">
                          <div className="exit-click-count">
                            {item?.recirculation_count}
                          </div>
                          <div>
                            <Icon
                              type="paper-clip"
                              style={{ color: "#69bdfa" }}
                            />
                          </div>
                          <div
                            className="exit-page-title"
                            onClick={() =>
                              redirectToArticlePage(item?.next_page_article_id)
                            }
                          >
                            {item?.next_page_title}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <Empty />
                  )}
                </div>
              </div>
            </div>
            <div className="article-breakdown-wrapper">
              <div className="article-breakdown-content">
                <div className="article-breakdown-button">
                  <Radio.Group
                    buttonStyle="solid"
                    size="large"
                    onChange={handleChangeBreakdownSegment}
                    value={selectedBreakdownValue}
                  >
                    <Radio.Button value="social">Social Breakdown</Radio.Button>
                    <Radio.Button value="device">Device Breakdown</Radio.Button>
                    <Radio.Button value="visitor">
                      Visitor Breakdown
                    </Radio.Button>
                  </Radio.Group>
                </div>
                <div className="article-breakdown-data-content">
                  <div className="article-breakdown-title">
                    {`${selectedBreakdownValue} Breakdown`}
                  </div>
                  {Object.keys(breakdownDataObject).length > 0 && (
                    <div className="article-breakdown-data-value">
                      <BreakDownData
                        data={breakdownDataObject[selectedBreakdownValue]}
                        columns={columnsVisitor}
                        tableValue={tableVistitorData}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Article;
