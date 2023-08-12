// Author Page
import React, { useEffect, useState } from "react";
import { useParams } from "@reach/router";
import { Select, Radio, Row, Col } from "antd";
import Helmet from "react-helmet";
import { navigate, useLocation } from "@reach/router";

import * as moment from "moment";

// Component
import { Skeleton } from "../../../components/Skeleton";
import { months, quarters, years, formatNumber } from "../../../utils/helper";
import Category from "../../components/Category/category";
import BarChart from "../../components/Charts/Barchart/barchart";
import StackedBarChart from "../../components/Charts/Stackedchart/stackedBarChart";
import LineChart from "../../components/Charts/Linechart/linechart";

// API
import notification from "../../../api/notification";
import { AuthorQuery } from "../../api/author";

// Style
import "./author.css";

const Author = () => {
  const [data, setData] = useState([]);
  const [countryListLabel, setCountryListLabel] = useState([]);
  const [countryListValue, setCountryListValue] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [distriputionData, setDistributionData] = useState({
    labels: [],
    series: [],
    name: "",
    referrer: null
  });
  const [headerData, setHeaderData] = useState([]);
  const [selectedDistribution, setSelectedDistribution] = useState(
    "country_distribution"
  );
  const [selectedChartValue, setSelectedChartValue] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [loader, setLoader] = useState(true);
  const [segementValue, setSegementValue] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [authorCurrentChartResponse, setAuthorCurrentChartResponse] = useState(
    []
  );
  const [authorAverageChartResponse, setAuthorAverageChartResponse] = useState(
    []
  );
  const [historicalChartResponse, setHistoricalChartResponse] = useState([]);
  const [barchartResponse, setBarChartResponse] = useState({
    labels: [],
    series: [],
    name: ""
  });
  const [topAuthorsMedium, setAuthorsMedium] = useState({});
  const { Option } = Select;

  const [authorChartData, setAuthorChartData] = useState([]);
  const { authorId } = useParams();
  const location = useLocation();
  let siteDetails =
    localStorage.getItem("view_id") !== "undefined" &&
    JSON.parse(localStorage.getItem("view_id"));
  const time_interval = localStorage.getItem("time_interval");
  const timeInterval = time_interval ? parseInt(time_interval) : 30 * 60 * 1000;

  useEffect(() => {
    const intervalId = setInterval(() => {
      getRealtimeData(authorId);
    }, timeInterval);

    getRealtimeData(authorId);
    setSelectedChartValue("page_views");
    setSegementValue("real-time");

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [authorId]);

  useEffect(() => {
    const state = location.state;
    if (state?.image) {
      setImageIndex(state.image);
    }
  }, []);

  useEffect(() => {
    if (authorCurrentChartResponse && authorAverageChartResponse) {
      realtimeChartDataFormat(selectedChartValue);
    }
  }, [authorCurrentChartResponse, authorAverageChartResponse]);

  const getRealtimeData = (author_ID) => {
    setLoader(true);
    let real_time_date = localStorage.getItem("real_time_date");
    const currentDate = new Date();

    // Format the date to "YYYY-MM-DD" format
    const formattedDate = currentDate.toISOString().split("T")[0];
    let period_date = real_time_date ? real_time_date : formattedDate;
    AuthorQuery.get_real_time_details(
      period_date,
      author_ID,
      siteDetails?.site_id
    )
      .then((res) => {
        if (res) {
          setHeaderData(res?.data?.data?.AuthorsPageViews[0]);
          setDataArray(res?.data?.data?.AuthorsDaily);
          let topMediumFormat = formatTopMedium(
            res?.data?.data?.AuthorsTopMedium
          );

          setAuthorsMedium(topMediumFormat);
          chartData(res?.data?.data?.AuthorsDaily);
          setAuthorCurrentChartResponse(res?.data?.data?.AuthorsHourly);
          setData(res?.data?.data?.Authors[0]);
          setAuthorAverageChartResponse(res?.data?.data?.AuthorsHourlyAverage);
          areaChartData(res?.data?.data?.AuthorsDaily);

          setLoader(false);
        }
      })
      .catch((err) => {
        notification.error(err?.message);
        setLoader(false);
      });
  };

  const getMonthlyData = (value) => {
    const currentYear = new Date().getFullYear();
    setLoader(true);

    AuthorQuery.get_monthly_details(
      siteDetails?.site_id,
      authorId,
      parseInt(value),
      currentYear
    )
      .then((res) => {
        if (res) {
          setHeaderData(res?.data?.data?.AuthorsMonthly?.[0]);
          setDataArray(res?.data?.data?.AuthorsMonthly);
          let topMediumFormat = formatTopMedium(
            res?.data?.data?.AuthorTopMediumMonthly
          );

          setAuthorsMedium(topMediumFormat);
          setHistoricalChartResponse(res?.data?.data);
          chartData(res?.data?.data?.AuthorsMonthly);
          generateDataForChart(res?.data?.data, parseInt(value));
          setLoader(false);
        }
      })
      .catch((err) => {
        notification.error(err?.message);
        setLoader(false);
      });
  };

  const getQuarterlyData = (value) => {
    const currentYear = new Date().getFullYear();
    setLoader(true);

    AuthorQuery.get_quaterly_details(
      siteDetails?.site_id,
      authorId,
      value,
      currentYear
    )
      .then((res) => {
        if (res) {
          setHeaderData(res?.data?.data?.AuthorsQuaterly[0]);
          setDataArray(res?.data?.data?.AuthorsQuaterly);
          setHistoricalChartResponse(res?.data?.data);
          let topMediumFormat = formatTopMedium(
            res?.data?.data?.AuthorsTopMediumQuaterly
          );

          setAuthorsMedium(topMediumFormat);
          chartData(res?.data?.data?.AuthorsQuaterly);
          generateDataForQuarterChart(res?.data?.data, value);
          setLoader(false);
        }
      })
      .catch((err) => {
        notification.error(err?.message);
        setLoader(false);
      });
  };

  const getYearlyData = (value) => {
    setLoader(true);

    AuthorQuery.get_yearly_details(
      siteDetails?.site_id,
      authorId,
      parseInt(value)
    )
      .then((res) => {
        if (res) {
          setHeaderData(res?.data?.data?.AuthorsYearly[0]);
          setDataArray(res?.data?.data?.AuthorsYearly);
          let topMediumFormat = formatTopMedium(
            res?.data?.data?.AuthorsTopMediumYearly
          );

          setAuthorsMedium(topMediumFormat);
          setHistoricalChartResponse(res?.data?.data);
          chartData(res?.data?.data?.AuthorsYearly);
          generateDataForYearChart(res?.data?.data, parseInt(value));
          setLoader(false);
        }
      })
      .catch((err) => {
        notification.error(err?.message);
        setLoader(false);
      });
  };

  const generateDataForChart = (data, month, value) => {
    const list = data?.AuthorsDaily;
    const currentMonth = data?.AuthorsMonthly?.[0];
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

    if (data?.AuthorsMonthly?.length > 0) {
      const list = data?.AuthorsMonthly;
      const areaJsonData = [];
      list.forEach((areadata) => {
        let result = areadata?.medium_distribution;

        if (typeof result === "string") {
          result = JSON.parse(result);
        }

        areaJsonData.push(result);
      });

      const newData = areaJsonData.map((obj) => {
        const newObj = {
          Social: obj["Social"] ? obj["Social"] : obj["social"] || 0,
          Referral: obj["Referral"] ? obj["Referral"] : obj["unknown"] || 0,
          Search: obj["search"] || 0,
          Internal: obj["Internal"] ? obj["Internal"] : obj["internal"] || 0,
          Direct: obj["Direct"] ? obj["Direct"] : obj["Other"] || 0
        };
        return newObj;
      });

      // Calculate the total sum of all values
      const total = Object.values(newData[0])?.reduce(
        (acc, value) => acc + value,
        0
      );

      // Convert each value to percentage and create the new format
      const result = Object.entries(newData[0])?.map(([name, value]) => ({
        name,
        data: [(value / total) * 100]
      }));

      const referrer = Object.entries(newData[0]).reduce(
        (acc, [name, value]) => {
          acc[name] = { value, percentage: ((value / total) * 100).toFixed(2) };
          return acc;
        },
        {}
      );

      setDistributionData((prevState) => ({
        ...prevState,
        series: result,
        referrer
      }));
    }
  };

  const generateDataForQuarterChart = (data, quarter, value) => {
    const list = data?.AuthorsMonthly;
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

    if (data?.AuthorsQuaterly?.length > 0) {
      const list = data?.AuthorsQuaterly;
      const areaJsonData = [];
      list.forEach((areadata) => {
        let result = areadata?.medium_distribution;

        if (typeof result === "string") {
          result = JSON.parse(result);
        }

        areaJsonData.push(result);
      });

      const newData = areaJsonData.map((obj) => {
        const newObj = {
          Social: obj["Social"] ? obj["Social"] : obj["social"] || 0,
          Referral: obj["Referral"] ? obj["Referral"] : obj["unknown"] || 0,
          Search: obj["search"] || 0,
          Internal: obj["Internal"] ? obj["Internal"] : obj["internal"] || 0,
          Direct: obj["Direct"] ? obj["Direct"] : obj["Other"] || 0
        };
        return newObj;
      });

      // Calculate the total sum of all values
      const total = Object.values(newData[0])?.reduce(
        (acc, value) => acc + value,
        0
      );

      // Convert each value to percentage and create the new format
      const result = Object.entries(newData[0])?.map(([name, value]) => ({
        name,
        data: [(value / total) * 100]
      }));

      const referrer = Object.entries(newData[0]).reduce(
        (acc, [name, value]) => {
          acc[name] = { value, percentage: ((value / total) * 100).toFixed(2) };
          return acc;
        },
        {}
      );

      setDistributionData((prevState) => ({
        ...prevState,
        series: result,
        referrer
      }));
    }
  };

  const formatTopMedium = (apiData) => {
    const formattedData = {};

    apiData.forEach((entry) => {
      const refrMedium = entry?.refr_medium;
      let refrValue;
      if (refrMedium === "unknown") {
        refrValue = entry?.refr_urlhost;
      } else if (refrMedium === "internal") {
        refrValue = entry?.page_urlpath;
      } else {
        refrValue = entry?.refr_source;
      }

      formattedData[refrMedium] = refrValue;
    });

    return formattedData;
  };

  const generateDataForYearChart = (data, year, value) => {
    const list = data?.AuthorsMonthly;
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

    if (data?.AuthorsYearly?.length > 0) {
      const list = data?.AuthorsYearly;

      const areaJsonData = [];
      list.forEach((areadata) => {
        let result = areadata?.medium_distribution;

        if (typeof result === "string") {
          result = JSON.parse(result);
        }

        areaJsonData.push(result);
      });

      const newData = areaJsonData.map((obj) => {
        const newObj = {
          Social: obj["Social"] ? obj["Social"] : obj["social"] || 0,
          Referral: obj["Referral"] ? obj["Referral"] : obj["unknown"] || 0,
          Search: obj["search"] || 0,
          Internal: obj["Internal"] ? obj["Internal"] : obj["internal"] || 0,
          Direct: obj["Direct"] ? obj["Direct"] : obj["Other"] || 0
        };
        return newObj;
      });

      // Calculate the total sum of all values
      const total = Object.values(newData[0])?.reduce(
        (acc, value) => acc + value,
        0
      );

      // Convert each value to percentage and create the new format
      const result = Object.entries(newData[0])?.map(([name, value]) => ({
        name,
        data: [(value / total) * 100]
      }));

      const referrer = Object.entries(newData[0]).reduce(
        (acc, [name, value]) => {
          acc[name] = { value, percentage: ((value / total) * 100).toFixed(2) };
          return acc;
        },
        {}
      );

      setDistributionData((prevState) => ({
        ...prevState,
        series: result,
        referrer
      }));
    }
  };

  const areaChartData = (data) => {
    const areaJsonData = [];
    if (data?.length > 0) {
      data.forEach((areadata) => {
        let result = areadata?.medium_distribution;

        if (typeof result === "string") {
          result = JSON.parse(result);
        }

        areaJsonData.push(result);
      });

      const labels = Array.from(
        { length: new Date(selectedYear, selectedMonth, 0).getDate() },
        (_, i) => i + 1
      );

      const newData = areaJsonData.map((obj) => {
        const newObj = {
          Social: obj["Social"] ? obj["Social"] : obj["social"] || 0,
          Referral: obj["Referral"] ? obj["Referral"] : obj["unknown"] || 0,
          Search: obj["search"] || 0,
          Internal: obj["Internal"] ? obj["Internal"] : obj["internal"] || 0,
          Direct: obj["Direct"] ? obj["Direct"] : obj["Other"] || 0
        };
        return newObj;
      });

      // Calculate the total sum of all values
      const total = Object.values(newData[0])?.reduce(
        (acc, value) => acc + value,
        0
      );

      // Convert each value to percentage and create the new format
      const result = Object.entries(newData[0])?.map(([name, value]) => ({
        name,
        data: [(value / total) * 100]
      }));

      const referrer = Object.entries(newData[0]).reduce(
        (acc, [name, value]) => {
          acc[name] = { value, percentage: ((value / total) * 100).toFixed(2) };
          return acc;
        },
        {}
      );

      setDistributionData((prevState) => ({
        ...prevState,
        labels,
        series: result,
        referrer
      }));
    }
  };

  const chartData = (data) => {
    // Country Distribution
    if (data?.[0]?.country_distribution) {
      let dataValue = data?.[0]?.country_distribution;

      if (typeof dataValue === "string") {
        dataValue = JSON.parse(dataValue);
      }

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

      // Select top 15 items
      countryKeysArray.splice(15);
      objValue.splice(15);

      setCountryListLabel(countryKeysArray);
      setCountryListValue(objValue);
    }
  };

  const convertDistribution = (data, selectedItem) => {
    if (selectedItem === "city_distribution") {
      let dataObj = data[0]?.country_wise_city;

      if (typeof dataObj === "string") {
        dataObj = JSON.parse(dataObj);
      }

      let districtData = dataObj?.["US"];

      const districtKeysArray = Object.keys(districtData);
      const districtValuesArray = Object.values(districtData);

      // Sort the districts in descending order based on the values
      const sortedIndices = districtValuesArray
        .map((_, index) => index)
        .sort((a, b) => districtValuesArray[b] - districtValuesArray[a]);

      const sortedDistrictKeys = sortedIndices.map(
        (index) => districtKeysArray[index]
      );
      const sortedDistrictValues = sortedIndices.map(
        (index) => districtValuesArray[index]
      );

      setCountryListLabel(sortedDistrictKeys);
      setCountryListValue(sortedDistrictValues);
    }
  };

  const realtimeChartDataFormat = (value) => {
    if (authorCurrentChartResponse && authorAverageChartResponse) {
      const lableValue = [
        0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23
      ];

      const currentUserValues = lableValue.map((hour) => {
        const matchingData = authorCurrentChartResponse.find(
          (obj) => obj.period_hour === hour
        );
        return matchingData ? matchingData.users : 0;
      });

      const currentPageViewsValues = lableValue.map((hour) => {
        const matchingData = authorCurrentChartResponse.find(
          (obj) => obj.period_hour === hour
        );
        return matchingData ? matchingData.page_views : 0;
      });

      const averagePageViewsValue = lableValue.map((hour) => {
        const matchingData = authorAverageChartResponse.find(
          (obj) => obj.period_hour === hour
        );
        return matchingData ? matchingData.page_views : 0;
      });

      const averageUserValues = lableValue.map((hour) => {
        const matchingData = authorAverageChartResponse.find(
          (obj) => obj.period_hour === hour
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

        setAuthorChartData(chartSeriesFormat);
      }
    }
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

    setSelectedDistribution("country_distribution");

    if (e.target.value === "monthly") {
      handleMonthChange(currentMonth);
    } else if (e.target.value === "yearly") {
      handleYearChange(currentYear);
    } else if (e.target.value === "quarterly") {
      handleQuarterlyChange(currentQuarter);
    } else {
      getRealtimeData(authorId);
    }
  };

  const handleMonthChange = (value) => {
    getMonthlyData(value);
    setSelectedMonth(value);
    setDistributionData({
      labels: [],
      series: [],
      name: "",
      referrer: null
    });
    setCountryListLabel([]);
    setCountryListValue([]);
  };

  const handleYearChange = (value) => {
    getYearlyData(value);
    setSelectedYear(value);
    setDistributionData({
      labels: [],
      series: [],
      name: "",
      referrer: null
    });
    setCountryListLabel([]);
    setCountryListValue([]);
  };

  const handleQuarterlyChange = (value) => {
    getQuarterlyData(value);
    setSelectedQuarter(value);
    setDistributionData({
      labels: [],
      series: [],
      name: "",
      referrer: null
    });
    setCountryListLabel([]);
    setCountryListValue([]);
  };

  const handleClickBack = () => {
    navigate("/content/author");
  };

  const handleChangeDistribution = (value) => {
    setSelectedDistribution(value);
    if (value === "city_distribution") {
      convertDistribution(dataArray, value);
    } else {
      chartData(dataArray);
    }
  };

  const formattedLabels = (labels) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Function to get the number of days in the current month
    const getDaysInMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    };

    // Generate the labels array for the current month
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    const formattedLabels = labels.map((day) => {
      if (day <= daysInMonth) {
        return `${monthNames[currentMonth]} ${day}`;
      } else {
        return ""; // Empty string for days beyond the current month
      }
    });

    return formattedLabels;
  };

  let totalNumberArticles = data?.articles_aggregate?.aggregate?.count;
  let helmetTitle = data?.name || "Name";
  const yearsOption = years();

  let chartTitle = "";
  if (segementValue === "real-time") {
    chartTitle = "Time of Day";
  } else if (segementValue === "monthly") {
    chartTitle = "Day of Month";
  } else if (segementValue === "quarterly") {
    chartTitle = "Month of Quarter";
  } else {
    chartTitle = "Month of Year";
  }

  return (
    <div className="article-wrapper">
      <Helmet>
        <title>{`${helmetTitle}`} | Author</title>
      </Helmet>
      <div className="author-content">
        <div style={{ display: "flex", marginTop: 25 }}>
          <div className="back-image" onClick={handleClickBack}>
            <img src="/images/back.png" alt="back" width={30} height={30} />
          </div>
          <div className="article-segement-wrapper">
            <Radio.Group onChange={handleChangeSegement} value={segementValue} disabled={loader}>
              <Radio.Button value="real-time">Real-Time</Radio.Button>
              <Radio.Button value="monthly">Month</Radio.Button>
              <Radio.Button value="quarterly">Quarter</Radio.Button>
              <Radio.Button value="yearly">Year</Radio.Button>
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
          <div className="article-content">
            <div className="article-heading">
              <div className="article-heading-row">
                <div className="heading-row-category">
                  <Category
                    id={authorId}
                    view="author"
                    totalNumber={totalNumberArticles}
                    data={headerData}
                    imageIndex={imageIndex}
                    authorName={helmetTitle}
                  />
                </div>
                <div className="flex" style={{ justifyContent: "flex-end" }}>
                  <div className="author-id-chart-header">
                    <div className="author-id-chart-select">
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
                <div className="article-country-author-content">
                  <div className="article-country-heading">{chartTitle}</div>
                  <div className="article-country-chart">
                    {segementValue === "real-time" ? (
                      <LineChart
                        labels={authorChartData?.label.map((item) => {
                          return moment(item, "h:mm a").format("h:mm a");
                        })}
                        series={authorChartData.series}
                        colors={["#A3E0FF", "#c4e0d7"]}
                      />
                    ) : (
                      <BarChart
                        labels={barchartResponse?.labels}
                        series={barchartResponse?.series}
                        logarithmic
                        tooltipLabels={
                          segementValue === "monthly"
                            ? formattedLabels(barchartResponse?.labels)
                            : null
                        }
                        name={barchartResponse?.name}
                        colors={["#A3E0FF"]}
                        width={"40%"}
                        tickAmount={true}
                      />
                    )}
                  </div>
                </div>
                <div className="view-row">
                  <div className="heading-row-author-details">
                    <div className="source-chart">
                      <div className="article-country-heading">
                        Referrer Source
                      </div>
                      <StackedBarChart
                        series={distriputionData?.series}
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
                  </div>
                </div>
                <div className="article-other-data-content">
                  <Row type="flex" justify="space-between">
                    <Col span={4}>
                      <div className="card">
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
                            distriputionData?.referrer?.["Social"]?.value ||
                            distriputionData?.referrer?.["social"]?.value ||
                            0
                          )}
                          &nbsp;
                          <span className="percentage">
                            {distriputionData?.referrer?.["Social"]
                              ?.percentage ||
                              distriputionData?.referrer?.["social"]
                                ?.percentage ||
                              0}
                            %
                          </span>
                        </div>
                        <div className="row3">
                          {(distriputionData?.referrer?.["Social"]?.value !==
                            0 ||
                            distriputionData?.referrer?.["social"]?.value !==
                            0) &&
                            (topAuthorsMedium?.["social"] ? (
                              <div>
                                <span
                                  style={{ color: "#172a95" }}
                                  title={topAuthorsMedium?.["social"]}
                                >
                                  {topAuthorsMedium?.["social"]}
                                </span>{" "}
                                is Top Social
                              </div>
                            ) : (
                              "-"
                            ))}{" "}
                        </div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className="card">
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
                            distriputionData?.referrer?.["Referral"]?.value ||
                            distriputionData?.referrer?.["unknown"]?.value ||
                            0
                          )}
                          &nbsp;
                          <span className="percentage">
                            {distriputionData?.referrer?.["Referral"]
                              ?.percentage ||
                              distriputionData?.referrer?.["unknown"]
                                ?.percentage ||
                              0}
                            %
                          </span>
                        </div>
                        <div className="row3">
                          {(distriputionData?.referrer?.["Referral"]?.value !==
                            0 ||
                            distriputionData?.referrer?.["unknown"]?.value !==
                            0) &&
                            (topAuthorsMedium?.["unknown"] ? (
                              <div>
                                <span
                                  style={{
                                    color: "#f8b633",
                                    cursor: "pointer"
                                  }}
                                  title={topAuthorsMedium?.["unknown"]}
                                >
                                  {topAuthorsMedium?.["unknown"].length > 10
                                    ? `${topAuthorsMedium?.[
                                      "unknown"
                                    ]?.substring(0, 10)}...`
                                    : topAuthorsMedium?.["unknown"]}
                                </span>{" "}
                                is Top Referral
                              </div>
                            ) : (
                              "-"
                            ))}{" "}
                        </div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className="card">
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
                          {formatNumber(
                            distriputionData?.referrer?.["search"]?.value ||
                            distriputionData?.referrer?.["Search"]?.value ||
                            0
                          )}
                          &nbsp;
                          <span className="percentage">
                            {distriputionData?.referrer?.["search"]
                              ?.percentage ||
                              distriputionData?.referrer?.["Search"]
                                ?.percentage ||
                              0}
                            %
                          </span>
                        </div>
                        <div className="row3">
                          {((distriputionData?.referrer?.["search"] &&
                            distriputionData?.referrer?.["search"]?.value !==
                            0) ||
                            (distriputionData?.referrer?.["Search"] &&
                              distriputionData?.referrer?.["Search"]?.value !==
                              0)) &&
                            (topAuthorsMedium?.["search"] ? (
                              <div>
                                <span
                                  style={{ color: "#e63111" }}
                                  title={topAuthorsMedium?.["search"]}
                                >
                                  {topAuthorsMedium?.["search"]}
                                </span>{" "}
                                is Top Search
                              </div>
                            ) : (
                              "-"
                            ))}
                        </div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className="card">
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
                            distriputionData?.referrer?.["Internal"]?.value ||
                            distriputionData?.referrer?.["internal"]?.value ||
                            0
                          )}
                          &nbsp;
                          <span className="percentage">
                            {distriputionData?.referrer?.["Internal"]
                              ?.percentage ||
                              distriputionData?.referrer?.["internal"]
                                ?.percentage ||
                              0}
                            %
                          </span>
                        </div>
                        <div className="row3">
                          {((distriputionData?.referrer?.["Internal"] &&
                            distriputionData?.referrer?.["Internal"]?.value !==
                            0) ||
                            (distriputionData?.referrer?.["internal"] &&
                              distriputionData?.referrer?.["internal"]
                                ?.value !== 0)) &&
                            (topAuthorsMedium?.["internal"] ? (
                              <div>
                                <span
                                  style={{
                                    color: "#0add54",
                                    cursor: "pointer"
                                  }}
                                  title={topAuthorsMedium?.["internal"]}
                                >
                                  {topAuthorsMedium?.["internal"].length > 10
                                    ? `${topAuthorsMedium?.[
                                      "internal"
                                    ]?.substring(0, 10)}...`
                                    : topAuthorsMedium?.["internal"]}
                                </span>{" "}
                                is Top Internal
                              </div>
                            ) : (
                              "-"
                            ))}
                        </div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className="card">
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
                            distriputionData?.referrer?.["Direct"]?.value ||
                            distriputionData?.referrer?.["Other"]?.value ||
                            0
                          )}
                          &nbsp;
                          <span className="percentage">
                            {distriputionData?.referrer?.["Direct"]
                              ?.percentage ||
                              distriputionData?.referrer?.["Other"]
                                ?.percentage ||
                              0}
                            %
                          </span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <div className="article-country-content">
              <div className="article-country-heading">
                Where are the readers from?
              </div>
              <div
                className="flex"
                style={{
                  justifyContent: "flex-end",
                  display: "flex",
                  width: "100%"
                }}
              >
                <div className="author-id-chart-header">
                  <div
                    className="author-id-chart-select"
                    style={{ marginRight: 10 }}
                  >
                    <Select
                      onChange={handleChangeDistribution}
                      value={selectedDistribution}
                      getPopupContainer={(triggerNode) =>
                        triggerNode?.parentNode || document.body
                      }
                    >
                      <Option value="country_distribution">
                        Country Distribution
                      </Option>
                      <Option value="city_distribution">
                        City Distribution
                      </Option>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="article-country-chart">
                <BarChart
                  labels={countryListLabel}
                  series={countryListValue}
                  logarithmic
                  colors={["#A3E0FF"]}
                  tickAmount={false}
                  name="Users"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Author;
