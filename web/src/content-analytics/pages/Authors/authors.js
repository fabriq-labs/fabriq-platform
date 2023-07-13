// Author Page
import React, { useEffect, useState } from "react";
import { useParams } from "@reach/router";
import { Select, Radio } from "antd";
import Helmet from "react-helmet";
import { navigate, useLocation } from "@reach/router";

import * as moment from "moment";

// Component
import { Skeleton } from "../../../components/Skeleton";
import { months, quarters, years } from "../../../utils/helper";
import Category from "../../components/Category/category";
import BarChart from "../../components/Charts/Barchart/barchart";
import StackAreaChart from "../../components/Charts/Areachart/areachart";
import LineChart from "../../components/Charts/Linechart/linechart";


// API
import notification from "../../../api/notification";
import { AuthorQuery } from "../../api/author";

// Style
import "./author.css";

const Author = () => {
  const [data, setData] = useState([]);
  const [id, setID] = useState(0);
  const [countryListLabel, setCountryListLabel] = useState([]);
  const [countryListValue, setCountryListValue] = useState([]);
  const [distriputionData, setDistributionData] = useState({
    labels: [],
    series: [],
    name: ""
  });
  const [headerData, setHeaderData] = useState([]);
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
  const { Option } = Select;

  const [authorChartData, setAuthorChartData] = useState([]);
  const { authorId } = useParams();
  const location = useLocation();

  useEffect(() => {
    getRealtimeData(authorId);
    setSelectedChartValue("page_views");
    setSegementValue("real-time");
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
    setID(author_ID);
    setLoader(true);
    let real_time_date = localStorage.getItem("real_time_date");
    const currentDate = new Date();

    // Format the date to "YYYY-MM-DD" format
    const formattedDate = currentDate.toISOString().split("T")[0];
    let period_date = real_time_date ? real_time_date : formattedDate;
    let siteDetails =
      localStorage.getItem("view_id") &&
      JSON.parse(localStorage.getItem("view_id"));

    AuthorQuery.get_real_time_details(
      period_date,
      author_ID,
      siteDetails?.site_id
    )
      .then((res) => {
        if (res) {
          setHeaderData(res?.data?.data?.AuthorsPageViews[0]);
          chartData(res?.data?.data?.AuthorsDaily);
          setAuthorCurrentChartResponse(
            res?.data?.data?.AuthorsHourly
          );
          setData(res?.data?.data?.Authors[0]);
          setAuthorAverageChartResponse(
            res?.data?.data?.AuthorsHourlyAverage
          );
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
    let siteDetails =
      localStorage.getItem("view_id") &&
      JSON.parse(localStorage.getItem("view_id"));
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
    let siteDetails =
      localStorage.getItem("view_id") &&
      JSON.parse(localStorage.getItem("view_id"));
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
          setHistoricalChartResponse(res?.data?.data);
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
    let siteDetails =
      localStorage.getItem("view_id") &&
      JSON.parse(localStorage.getItem("view_id"));
    setLoader(true);

    AuthorQuery.get_yearly_details(
      siteDetails?.site_id,
      authorId,
      parseInt(value)
    )
      .then((res) => {
        if (res) {
          setHeaderData(res?.data?.data?.AuthorsYearly[0]);
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

    if (currentMonth) {
      const outputArrayReffer = labels?.map((label) => {
        const day = parseInt(label);

        const dataItem = list?.find(
          (item) =>
            new Date(item.period_date).getMonth() + 1 === month &&
            new Date(item.period_date).getDate() === day
        );

        return [day, dataItem ? dataItem?.medium_distribution : 0];
      });

      const uniqueKeys = Array.from(
        new Set(
          outputArrayReffer
            .filter(([_, obj]) => typeof obj === "object")
            .map(([_, obj]) => Object.keys(obj))
            .flat()
        )
      );

      const formattedData = outputArrayReffer.map(([x, y]) => {
        const dataPoint = {
          x: x
        };

        uniqueKeys.forEach((key) => {
          dataPoint[key] = 0;
        });

        if (typeof y === "object") {
          Object.entries(y).forEach(([key, value]) => {
            dataPoint[key] = value;
          });
        } else {
          dataPoint["unknown"] = y;
        }

        return dataPoint;
      });

      const finalFormattedData = [];

      const keys = Object.keys(formattedData[0]).filter((key) => key !== "x");

      keys.forEach((key) => {
        const data = formattedData.map((obj) => obj[key]);
        finalFormattedData.push({ name: key, data });
      });

      setDistributionData((prevState) => ({
        ...prevState,
        labels,
        series: finalFormattedData
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

    if (data?.AuthorsQuaterly) {
      const outputArrayReffer = labels?.map((label) => {
        const day = parseInt(label);
        const dataItem = list.find((item) => item?.period_month === day);

        return [day, dataItem ? dataItem?.medium_distribution : 0];
      });

      const uniqueKeys = Array.from(
        new Set(
          outputArrayReffer
            .filter(([_, obj]) => typeof obj === "object")
            .map(([_, obj]) => Object.keys(obj))
            .flat()
        )
      );

      const formattedData = outputArrayReffer.map(([x, y]) => {
        const dataPoint = {
          x: x
        };

        uniqueKeys.forEach((key) => {
          dataPoint[key] = 0;
        });

        if (typeof y === "object") {
          Object.entries(y).forEach(([key, value]) => {
            dataPoint[key] = value;
          });
        } else {
          dataPoint["unknown"] = y;
        }

        return dataPoint;
      });

      const finalFormattedData = [];

      const keys = Object.keys(formattedData[0]).filter((key) => key !== "x");

      keys.forEach((key) => {
        const data = formattedData.map((obj) => obj[key]);
        finalFormattedData.push({ name: key, data });
      });

      setDistributionData((prevState) => ({
        ...prevState,
        labels: monthLabels,
        series: finalFormattedData
      }));
    }
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
      const outputArrayReffer = labels?.map((label) => {
        const day = parseInt(label);
        const dataItem = list.find((item) => item?.period_month === day);

        return [day, dataItem ? dataItem?.medium_distribution : 0];
      });

      const uniqueKeys = Array.from(
        new Set(
          outputArrayReffer
            .filter(([_, obj]) => typeof obj === "object")
            .map(([_, obj]) => Object.keys(obj))
            .flat()
        )
      );

      const formattedData = outputArrayReffer.map(([x, y]) => {
        const dataPoint = {
          x: x
        };

        uniqueKeys.forEach((key) => {
          dataPoint[key] = 0;
        });

        if (typeof y === "object") {
          Object.entries(y).forEach(([key, value]) => {
            dataPoint[key] = value;
          });
        } else {
          dataPoint["unknown"] = y;
        }

        return dataPoint;
      });

      const finalFormattedData = [];

      const keys = Object.keys(formattedData[0]).filter((key) => key !== "x");

      keys.forEach((key) => {
        const data = formattedData.map((obj) => obj[key]);
        finalFormattedData.push({ name: key, data });
      });

      setDistributionData((prevState) => ({
        ...prevState,
        labels: monthLabels,
        series: finalFormattedData
      }));
    }
  };

  const areaChartData = (data) => {
    const areaJsonData = [];
    data.forEach((areadata) => {
      areaJsonData.push(areadata.medium_distribution);
    });
    const labels = Array.from(
      { length: new Date(selectedYear, selectedMonth, 0).getDate() },
      (_, i) => i + 1
    );

    const allKeys = areaJsonData.reduce((keys, obj) => {
      return [...keys, ...Object.keys(obj)];
    }, []);

    const newData = areaJsonData.map((obj) => {
      const newObj = {};
      allKeys.forEach((key) => {
        newObj[key] = obj[key] || 0;
      });
      return newObj;
    });
    const seriesData = Object.keys(newData[0]).map((key) => ({
      name: key,
      data: newData.map((item) => item[key])
    }));

    setDistributionData((prevState) => ({
      ...prevState,
      labels,
      series: seriesData
    }));
    // setDistributionData(seriesData);
  };

  const chartData = (data) => {
    // Country Distribution
    if (data && data?.[0]?.country_distribution) {
      let dataValue = data && data?.[0]?.country_distribution;
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
      setCountryListLabel(countryKeysArray);
      setCountryListValue(objValue);
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
      name: ""
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
      name: ""
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
      name: ""
    });
    setCountryListLabel([]);
    setCountryListValue([]);
  };

  const handleClickBack = () => {
    navigate("/content/author");
  };

  let totalNumberArticles = data && data?.articles?.length;
  let helmetTitle = data?.name ? data?.name : "Name";
  const yearsOption = years();

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
        {loader === true ? (
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
                  <div className="article-country-heading">Time of day</div>
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
                      <StackAreaChart
                        labels={distriputionData?.labels}
                        series={distriputionData?.series}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="article-country-content">
              <div className="article-country-heading">
                Where are the readers from?
              </div>
              <div className="article-country-chart">
                <BarChart
                  labels={countryListLabel}
                  series={countryListValue}
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
