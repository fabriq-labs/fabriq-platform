// Article Page
import React, { useState, useEffect } from "react";
import { Radio, Row, Col, Select, DatePicker, Button, Spin } from "antd";
import * as moment from "moment";
import { Link, useLocation } from "@reach/router";
import Helmet from "react-helmet";

// Component
import LineScatterChart from "../../components/Charts/Linechart/linescatterchart";
import LineChartTiny from "../../components/Charts/Linechart/tinychart";
import BarChart from "../../components/Charts/Barchart/barchart";
import { Skeleton } from "../../../components/Skeleton";
import notification from "../../../api/notification";

// API
import { ArticleList } from "../../api/article_list";
import { Overview } from "../../api/overview";

// Helper
import { months, quarters, years, formatDuration } from "../../../utils/helper";

// Style
import "./article_page.css";

const ArticleCountView = (props) => {
  const { title, value } = props;
  function formatNumber(value) {
    if (value >= 1000000) {
      return (
        <div className="count-view">
          <span>{(value / 1000000).toFixed(1)}</span>
          <span className="count-prefix">&nbsp;M</span>
        </div>
      );
    } else if (value >= 1000) {
      return (
        <div className="count-view">
          <span>{(value / 1000).toFixed(1)}</span>
          <span className="count-prefix">&nbsp;K</span>
        </div>
      );
    } else {
      return (
        <div className="count-view">
          <span>{value?.toString()}</span>
        </div>
      );
    }
  }

  function formatSecondsToTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Add leading zero for seconds less than 10
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return (
      <div className="count-view">
        <span>
          {minutes}:{formattedSeconds}
        </span>
      </div>
    );
  }

  return (
    <div className="article-count-view-wrapper">
      <div className="article-count-view-content">
        <div className="article-count-title">{title}</div>
        <div className="article-count-value">
          {title !== "Average Time Spent"
            ? formatNumber(value)
            : formatSecondsToTime(value)}
        </div>
        <div className="article-count-description">
          {title !== "Users" ? "Minutes" : "-"}
        </div>
      </div>
    </div>
  );
};

const ArticlePage = () => {
  const [segementValue, setSegementValue] = useState("real-time");
  const [selectedChartValue, setSelectedChartValue] = useState("");
  const [overViewChartData, setOverViewChartData] = useState({});
  const [chartLoader, setChartLoader] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [filterData, setFilterData] = useState({});
  const [selectedFilter, setSelectedFilter] = useState("");
  const [historicalChartResponse, setHistoricalChartResponse] = useState([]);
  const [overViewCurrentChartResponse, setOverViewCurrentChartResponse] =
    useState([]);
  const [overViewAverageChartResponse, setOverViewAverageChartResponse] =
    useState([]);
  const [selectedFilterValue, setSelectedFilterValue] = useState(null);
  const [visitorsData, setVisitorsData] = useState([]);
  const [tableListData, setTableListData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [barchartResponse, setBarChartResponse] = useState({
    labels: [],
    series: [],
    name: ""
  });
  const [tableLoader, setTableLoader] = useState(false);
  const [newPost, setNewPost] = useState([]);
  const { Option } = Select;
  const location = useLocation();
  let siteDetails =
    localStorage.getItem("view_id") !== "undefined" &&
    JSON.parse(localStorage.getItem("view_id"));

  const time_interval = localStorage.getItem("time_interval");
  const timeInterval = time_interval ? parseInt(time_interval) : 30 * 60 * 1000;

  useEffect(() => {
    getArticleDetails("real-time");
    setSegementValue("real-time");
    setSelectedChartValue("page_views");
    setSelectedSort("page_views");

    const intervalId = setInterval(() => {
      getArticleDetails("real-time");
    }, timeInterval);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (
      overViewCurrentChartResponse &&
      overViewAverageChartResponse &&
      newPost
    ) {
      chartData(selectedChartValue);
    }
  }, [overViewCurrentChartResponse, overViewAverageChartResponse, newPost]);

  useEffect(() => {
    let real_time_date = localStorage.getItem("real_time_date");
    const currentDate = new Date();

    // Format the date to "YYYY-MM-DD" format
    const formattedDate = currentDate.toISOString().split("T")[0];
    let period_date = real_time_date ? real_time_date : formattedDate;

    const state = location.state;
    if (state?.author_name) {
      setSelectedFilter("author");
      setSelectedFilterValue(state?.author_name);
      let filterValue = state?.author_name;
      let filterSelect = "author";
      ArticleList.get_Table_List_Filter(
        period_date,
        filterValue,
        filterSelect,
        siteDetails?.site_id
      )
        .then((res) => {
          if (res) {
            const result = res?.data?.data?.real_time_sort;
            getTableChartSeries(result, true);
          }
        })
        .catch((err) => {
          notification.error(err.message);
        });
    } else {
      ArticleList.get_Table_List(period_date, "page_views", siteDetails.site_id)
        .then((res) => {
          if (res) {
            const result = res?.data?.data?.real_time_sort;

            getTableChartSeries(result, true);
          }
        })
        .catch((err) => {
          notification.error(err.message);
        });
    }
  }, []);

  const getTableChartSeries = async (result, realTime) => {
    let real_time_date = localStorage.getItem("real_time_date");
    const overviewIds = result?.map((item) => {
      return item?.article?.article_id;
    });

    const req = {
      period_date: real_time_date || moment.utc().format("YYYY-MM-DD"),
      site_id: siteDetails?.site_id,
      article_id: overviewIds
    };

    const res =
      realTime
        ? await Overview.getLast30Days(req)
        : await Overview.getLast30DaysArticle(req);

    let obj = {};

    const lableValue = Array.from({ length: 24 }, (_, i) => i);
    if (res?.data?.data?.last30DaysData?.length > 0) {
      res.data.data.last30DaysData.forEach((articleItem) => {
        const article_id = articleItem?.article?.article_id;

        if (!obj[article_id]) {
          obj[article_id] = {
            series: [
              {
                name: "Page Views",
                data: realTime ? lableValue.map(() => 0) : []
              }
            ],
            labels: []
          };
        }

        if (realTime) {
          obj[article_id].labels = lableValue.map((item) =>
            moment(item, "H").format("h:mm a")
          );
          const hourIndex = lableValue.indexOf(articleItem?.hour);
          if (hourIndex !== -1) {
            obj[article_id].series[0].data[hourIndex] = articleItem?.page_views;
          }
        } else {
          let dateFormat = moment(articleItem.period_date).format("MMM DD");
          obj[article_id].labels.push(dateFormat);
          obj[article_id].series[0].data.push(articleItem?.page_views);
        }
      });
    }

    // Loop through result to add series property based on author_id
    const updatedResult = result?.map((authorItem) => {
      const article_id = authorItem?.article?.article_id;
      const item = { ...authorItem };

      if (obj[article_id]) {
        item.series = obj[article_id].series;
        item.labels = obj[article_id].labels;
      }

      return item;
    });

    setTableListData(updatedResult);
  };

  const getArticleDetails = () => {
    getRealtimeData();
  };

  const getRealtimeData = () => {
    let real_time_date = localStorage.getItem("real_time_date");
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    let period_date = real_time_date ? real_time_date : formattedDate;
    let limit = 10;
    setChartLoader(true);
    ArticleList.get_Visitors_data(period_date, limit, siteDetails.site_id)
      .then((res) => {
        if (res) {
          let chartRes = res?.data?.data?.ArticleCurrentHours;
          setVisitorsData(res?.data?.data?.daily_data?.[0]);
          getfilterData(res?.data?.data?.TopPosts);
          setNewPost(res?.data?.data?.NewPostArticles);
          chartData();
          setOverViewCurrentChartResponse(chartRes);
          setOverViewAverageChartResponse(res?.data?.data?.ArticleAvgHours);
          setChartLoader(false);
        }
      })
      .catch((err) => {
        notification.error(err?.message);
        setChartLoader(false);
      });
  };

  const getMonthlyData = (value) => {
    const currentYear = new Date().getFullYear();
    setChartLoader(true);

    Promise.all([
      ArticleList.get_Monthly_Visitors(
        siteDetails?.site_id,
        parseInt(value),
        currentYear
      ),
      ArticleList.get_Monthly_Table_List(
        siteDetails?.site_id,
        parseInt(value),
        currentYear,
        selectedSort
      )
    ])
      .then((values) => {
        setVisitorsData(values?.[0]?.data?.data?.monthly_visitors?.[0]);
        getfilterData(values?.[0]?.data?.data?.TopPosts);
        getTableChartSeries(values?.[1]?.data?.data?.monthly_data);
        setHistoricalChartResponse(values?.[0]?.data?.data);
        generateDataForChart(values?.[0]?.data?.data, parseInt(value));
        setChartLoader(false);
      })
      .catch((err) => {
        notification.error(err?.message);
        setChartLoader(false);
      });
  };

  const getYearlyData = (value) => {
    setChartLoader(true);
    Promise.all([
      ArticleList.get_Yearly_Visitors(siteDetails?.site_id, parseInt(value)),
      ArticleList.get_Yearly_Table_List(
        siteDetails?.site_id,
        parseInt(value),
        selectedSort
      )
    ])
      .then((values) => {
        setVisitorsData(values?.[0]?.data?.data?.yearly_list?.[0]);
        getfilterData(values?.[0]?.data?.data?.TopPosts);
        setHistoricalChartResponse(values?.[0]?.data?.data);
        generateDataForYearChart(values?.[0]?.data?.data, parseInt(value));
        getTableChartSeries(values?.[1]?.data?.data?.yearly_data);
        setChartLoader(false);
      })
      .catch((err) => {
        notification.error(err?.message);
        setChartLoader(false);
      });
  };

  const getQuarterlyData = (value) => {
    const currentYear = new Date().getFullYear();
    setChartLoader(true);
    Promise.all([
      ArticleList.get_Quarterly_Visitors(
        siteDetails?.site_id,
        parseInt(value),
        currentYear
      ),
      ArticleList.get_Quaterly_Table_List(
        siteDetails?.site_id,
        parseInt(value),
        currentYear,
        selectedSort
      )
    ])
      .then((values) => {
        setVisitorsData(values?.[0]?.data?.data?.quarterly_visitors_list?.[0]);
        getfilterData(values?.[0]?.data?.data?.TopPosts);
        setHistoricalChartResponse(values?.[0]?.data?.data);
        generateDataForQuarterChart(values?.[0]?.data?.data, value);
        getTableChartSeries(values?.[1]?.data?.data?.quarterly_data);
        setChartLoader(false);
      })
      .catch((err) => {
        notification.error(err?.message);
        setChartLoader(false);
      });
  };

  const generateDataForChart = (data, month, value) => {
    const list = data?.monthly_visitor_daily;
    const currentMonth = data?.monthly_visitors?.[0];
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

  const generateDataForQuarterChart = (data, quarter, value) => {
    const list = data?.quarterly_visitors;
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
      const dataItem = list?.find((item) => item?.period_month === day);

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

  const generateDataForYearChart = (data, year, value) => {
    const list = data?.yearly_list_data;
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

    setVisitorsData([]);
    setTableListData([]);
    setSelectedFilter("");
    setSelectedFilterValue(null);

    if (e.target.value === "monthly") {
      handleMonthChange(currentMonth);
    } else if (e.target.value === "yearly") {
      handleYearChange(currentYear);
    } else if (e.target.value === "quarterly") {
      handleQuarterlyChange(currentQuarter);
    } else if (e.target.value === "real-time") {
      getArticleDetails(e.target.value);
      get_TableData_Sort(selectedSort, e.target.value);
    }
  };

  const handleMonthChange = (value) => {
    getMonthlyData(value);
    setSelectedMonth(value);
  };

  const handleYearChange = (value) => {
    getYearlyData(value);
    setSelectedYear(value);
  };

  const handleQuarterlyChange = (value) => {
    getQuarterlyData(value);
    setSelectedQuarter(value);
  };

  const handleChangeFilterSegment = (e) => {
    setSelectedFilter(e.target.value);
    setSelectedFilterValue(null);
  };

  const chartData = (value) => {
    if (
      overViewCurrentChartResponse &&
      overViewAverageChartResponse &&
      newPost
    ) {
      const lableValue = [
        0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23
      ];

      const currentUserValues = lableValue.map((hour) => {
        const matchingData = overViewCurrentChartResponse.find(
          (obj) => obj.hour === hour
        );
        return matchingData ? matchingData.users : 0;
      });

      const currentPageViewsValues = lableValue.map((hour) => {
        const matchingData = overViewCurrentChartResponse.find(
          (obj) => obj.hour === hour
        );
        return matchingData ? matchingData.page_views : 0;
      });

      const averageUserValues = lableValue.map((hour) => {
        const matchingData = overViewAverageChartResponse.find(
          (obj) => obj.hour === hour
        );
        return matchingData ? matchingData.users : 0;
      });

      const averagePageViewsValue = lableValue.map((hour) => {
        const matchingData = overViewAverageChartResponse.find(
          (obj) => obj.hour === hour
        );
        return matchingData ? matchingData.page_views : 0;
      });

      const articleCounts = new Array(24).fill(null);

      newPost.forEach((article) => {
        const publishedHour = new Date(article.published_date).getUTCHours();
        articleCounts[publishedHour]++;
      });

      let chartSeriesFormat = {
        series: [
          {
            name: "Current",
            type: "line",
            data:
              value === "page_views"
                ? currentPageViewsValues
                : currentUserValues,
            yaxis: "line-y-axis"
          },
          {
            name: "Average",
            type: "line",
            data:
              value === "page_views"
                ? averagePageViewsValue
                : averageUserValues,
            yaxis: "line-y-axis"
          },
          {
            name: "New Post",
            type: "scatter",
            data: articleCounts,
            yaxis: "scatter-y-axis"
          }
        ],
        label: lableValue
      };

      setOverViewChartData(chartSeriesFormat);
    }
  };

  const getfilterData = (data) => {
    let filterData = data;

    let categoryArray = filterData?.map((item) => item?.article?.category);
    let authorArray = filterData?.map((item) => item?.article?.authors?.name);

    let removedDuplicatesCategory = [...new Set(categoryArray)];
    let remodedDuplicatedAuthor = [...new Set(authorArray)];

    let categoryOption = removedDuplicatesCategory.map((item) => (
      <Option key={item} style={{ textTransform: "capitalize" }}>
        {item}
      </Option>
    ));
    let authorOption = remodedDuplicatedAuthor.map((item) => (
      <Option key={item}>{item}</Option>
    ));

    let finalFilterData = {
      tag: categoryOption,
      author: authorOption
    };
    setFilterData(finalFilterData);
  };

  const handleChangeChart = (value) => {
    setSelectedChartValue(value);
    chartData(value);
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
    }
  };

  const handleChangeSort = (value) => {
    setSelectedSort(value);
    get_TableData_Sort(value);
  };

  const get_TableData_Sort = (value, segement) => {
    let real_time_date = localStorage.getItem("real_time_date");
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    let period_date = real_time_date ? real_time_date : formattedDate;
    const currentYear = new Date().getFullYear();
    let segementValueFinal = segement ? segement : segementValue;
    if (segementValueFinal === "monthly") {
      ArticleList.get_Monthly_Table_List(
        siteDetails?.site_id,
        selectedMonth,
        currentYear,
        value
      )
        .then((res) => {
          if (res) {
            const data = res?.data?.data?.monthly_data;
            getTableChartSeries(data);
            handleFilterVistorData(data);
          }
        })
        .catch((err) => {
          notification.error(err?.message);
        });
    } else if (segementValueFinal === "yearly") {
      ArticleList.get_Yearly_Table_List(
        siteDetails?.site_id,
        selectedYear,
        value
      )
        .then((res) => {
          if (res) {
            const yearly_data = res?.data?.data?.yearly_data;
            getTableChartSeries(yearly_data);
            handleFilterVistorData(yearly_data);
          }
        })
        .catch((err) => {
          notification.error(err?.message);
        });
    } else if (segementValueFinal === "quarterly") {
      ArticleList.get_Quaterly_Table_List(
        siteDetails?.site_id,
        selectedQuarter,
        currentYear,
        value
      )
        .then((res) => {
          if (res) {
            const quarterly_data = res?.data?.data?.quarterly_data;
            getTableChartSeries(quarterly_data);
            handleFilterVistorData(quarterly_data);
          }
        })
        .catch((err) => {
          notification.error(err?.message);
        });
    } else {
      ArticleList.get_Table_List(period_date, value, siteDetails.site_id)
        .then((res) => {
          if (res) {
            const atomicDataList = res?.data?.data?.real_time_sort;

            getTableChartSeries(atomicDataList, true);
            handleFilterVistorData(atomicDataList);
          }
        })
        .catch((err) => {
          notification.error(err?.message);
        });
    }
  };

  const handleFilterVistorData = (list) => {
    const data = {
      total_time_spent: 0,
      users: 0,
      average_time_spent: 0,
      attention_time: 0
    };

    const totalData = {};
    list.forEach((atomicData, index) => {
      Object.keys(data).forEach((key) => {
        if (totalData[key] === undefined) {
          totalData[key] = 0;
        }
        totalData[key] += atomicData[key];
      });
    });
    setVisitorsData(totalData);
  };

  const filterFunction = (isFilter) => {
    let real_time_date = localStorage.getItem("real_time_date");
    const currentDate = new Date();
    setTableLoader(true);

    let filterVal = selectedFilterValue;

    if (isFilter) {
      filterVal = "";
    }

    // Format the date to "YYYY-MM-DD" format
    const formattedDate = currentDate.toISOString().split("T")[0];
    let period_date = real_time_date ? real_time_date : formattedDate;
    const currentYear = new Date().getFullYear();

    if (filterVal) {
      if (segementValue === "monthly") {
        ArticleList.get_Monthly_Table_List_Filter(
          selectedMonth,
          currentYear,
          filterVal,
          selectedFilter,
          siteDetails.site_id
        )
          .then((res) => {
            if (res) {
              const data = res?.data?.data?.monthly_data;

              getTableChartSeries(data);
              handleFilterVistorData(data);
              setTableLoader(false);
            }
          })
          .catch((err) => {
            notification.error(err?.message);
            setTableLoader(false);
          });
      } else if (segementValue === "quarterly") {
        ArticleList.get_Quaterly_Table_List_Filter(
          selectedQuarter,
          currentYear,
          filterVal,
          selectedFilter,
          siteDetails.site_id
        )
          .then((res) => {
            if (res) {
              const quarterly_data = res?.data?.data?.quarterly_data;
              getTableChartSeries(quarterly_data);
              handleFilterVistorData(quarterly_data);
              setTableLoader(false);
            }
          })
          .catch((err) => {
            notification.error(err?.message);
            setTableLoader(false);
          });
      } else if (segementValue === "yearly") {
        ArticleList.get_Yearly_Table_List_Filter(
          selectedYear,
          filterVal,
          selectedFilter,
          siteDetails.site_id
        )
          .then((res) => {
            if (res) {
              const yearly_data = res?.data?.data?.yearly_data;
              getTableChartSeries(yearly_data);
              handleFilterVistorData(yearly_data);
              setTableLoader(false);
            }
          })
          .catch((err) => {
            notification.error(err?.message);
            setTableLoader(false);
          });
      } else {
        ArticleList.get_Table_List_Filter(
          period_date,
          filterVal,
          selectedFilter,
          siteDetails.site_id
        )
          .then((res) => {
            if (res) {
              const atomicDataList = res?.data?.data?.real_time_sort;
              getTableChartSeries(atomicDataList, true);
              handleFilterVistorData(atomicDataList);
              setTableLoader(false);
            }
          })
          .catch((err) => {
            notification.error(err?.message);
            setTableLoader(false);
          });
      }
    } else {
      setSelectedFilterValue(null);
      get_TableData_Sort(selectedSort);
      setTableLoader(false);
    }
  };

  const handleClickFilter = () => {
    filterFunction();
  };

  function handleChange(value) {
    setSelectedFilterValue(value);
  }

  const handleCloseFilter = () => {
    setSelectedFilter("");
    setSelectedFilterValue(null);
    filterFunction(true);
  };

  function handleDateChange(date, dateString) {
    let dateFormat = dateString.replace(/\//g, "-");
    setSelectedFilterValue(`${dateFormat}%`);
  }

  const formatDurationCategory = (value) => {
    let formattedDuration;
    const duration = moment.duration(value, "seconds");
    formattedDuration = formatDuration(duration, "14px", "18px");
    return formattedDuration;
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

  let children =
    selectedFilter === "author" ? filterData.author : filterData.tag;
  const dateFormat = "YYYY/MM/DD";
  const yearsOption = years();

  if (overViewChartData?.label?.length > 0) {
    overViewChartData.label = overViewChartData.label.map((item) => {
      return moment(item, "h:mm a").format("h:mm a");
    });
  }

  function secondsToMinutes(seconds) {
    const duration = moment.duration(seconds, "seconds");
    const minutes = Math.floor(duration.asMinutes());
    return minutes;
  }

  const total_time_spent_minutes = secondsToMinutes(
    visitorsData?.total_time_spent ? visitorsData.total_time_spent : 0
  );

  let title = "Page Views: 30 Days";
  if (segementValue === "real-time") {
    title = "Page Views: 24 Hours";
  }

  return (
    <div className="article-page-wrapper">
      <Helmet>
        <title>Article</title>
      </Helmet>
      <div className="article-page-content">
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", flex: 1 }}>
            <div className="article-segement-wrapper">
              <Radio.Group
                onChange={handleChangeSegement}
                value={segementValue}
                disabled={chartLoader}
              >
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
          <div className="article-id-chart-header">
            <div className="article-page-chart-select">
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
        {chartLoader ? (
          <div>
            <Skeleton />
          </div>
        ) : (
          <div>
            <div className="article-page-chart">
              <div
                style={{ marginTop: "50px" }}
                className="article-chart-content"
              >
                {segementValue === "real-time" ? (
                  <LineScatterChart
                    labels={overViewChartData?.labels}
                    series={overViewChartData?.series}
                    colors={["#A3E0FF", "#c4e0d7", "#e89de1"]}
                    height={300}
                  />
                ) : (
                  <BarChart
                    labels={barchartResponse?.labels}
                    series={barchartResponse?.series}
                    name={barchartResponse?.name}
                    tooltipLabels={
                      segementValue === "monthly"
                        ? formattedLabels(barchartResponse?.labels)
                        : null
                    }
                    logarithmic
                    colors={["#A3E0FF"]}
                    width={"40%"}
                    tickAmount={true}
                  />
                )}
              </div>
            </div>
            <div className="article-page-filter-wrapper">
              <div className="article-page-filter-content">
                <div className="article-page-filter">
                  <div className="article-page-filter-title">Filter By:</div>
                  <div className="article-filter-button">
                    <Radio.Group
                      buttonStyle="solid"
                      size="large"
                      onChange={handleChangeFilterSegment}
                      value={selectedFilter}
                    >
                      <Radio.Button value="author">Author</Radio.Button>
                      <Radio.Button value="category">Category</Radio.Button>
                      <Radio.Button value="published_date">
                        Published Date
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
                <div className="article-page-sort">
                  <Select
                    onChange={handleChangeSort}
                    value={selectedSort}
                    getPopupContainer={(triggerNode) =>
                      triggerNode?.parentNode || document.body
                    }
                  >
                    <Option value="page_views">Page Views</Option>
                    <Option value="users">Users</Option>
                    <Option value="total_time_spent">View Time</Option>
                  </Select>
                </div>
              </div>
              {selectedFilter !== "" && (
                <div className="filter-content-wrapper">
                  {selectedFilter !== "published_date" ? (
                    <div className="filter-select">
                      <Select
                        size="large"
                        style={{ width: "100%" }}
                        onChange={handleChange}
                        value={selectedFilterValue}
                        getPopupContainer={(triggerNode) =>
                          triggerNode?.parentNode || document.body
                        }
                        allowClear
                      >
                        {children}
                      </Select>
                    </div>
                  ) : (
                    <div className="filter-select-date">
                      <DatePicker
                        defaultValue={moment(new Date(), dateFormat)}
                        format={dateFormat}
                        size="large"
                        onChange={handleDateChange}
                      />
                    </div>
                  )}
                  <div className="filter-apply-button">
                    <Button
                      size="large"
                      onClick={handleClickFilter}
                      disabled={
                        selectedFilter !== "published_date" &&
                        (selectedFilterValue === null ||
                          selectedFilterValue === "")
                      }
                    >
                      Apply Filter
                    </Button>
                    <Button
                      size="large"
                      onClick={handleCloseFilter}
                      style={{ marginLeft: 10 }}
                    >
                      Close Filter
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="article-page-list-count-wrapper">
              <div className="article-page-list-content">
                <div className="article-list-count-wrapper">
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <ArticleCountView
                        title={"Users"}
                        value={visitorsData?.users || 0}
                      />
                    </Col>
                    <Col span={8}>
                      <ArticleCountView
                        title={"Total Time Spent"}
                        value={
                          visitorsData?.total_time_spent
                            ? total_time_spent_minutes
                            : 0
                        }
                      />
                    </Col>
                    <Col span={8}>
                      <ArticleCountView
                        title={"Average Time Spent"}
                        value={
                          visitorsData?.average_time_spent
                            ? visitorsData?.average_time_spent
                            : 0
                        }
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <div className="article-list-table-wrapper">
              <Spin size="large" spinning={tableLoader}>
                <div className="article-list-table-content">
                  <div className="list-table-heading">
                    <div className="list-title-article">Article</div>
                    <div className="list-title-page-view">{title}</div>
                    <div className="list-title-visitors">Users</div>
                  </div>
                  <div className="article-divider"></div>
                  {tableListData?.map((item, index) => {
                    return (
                      <>
                        <div className="list-article-details-wrapper">
                          <div className="list-article-details">
                            <div className="list-article-key">{index + 1}</div>
                            <div className="list-article-logo">
                              {" "}
                              <img
                                src={
                                  index <= 4
                                    ? `/images/blog-${index + 1}.jpg`
                                    : `/images/blog-${index - 4}.jpg`
                                }
                                alt="blog"
                                style={{ width: "70px" }}
                              />
                            </div>
                            <div className="list-article-content">
                              <div style={{ display: "flex" }}>
                                <Link
                                  to={`/content/article/${item?.article?.article_id}`}
                                  className="list-article-title"
                                >
                                  {item?.article?.title}
                                </Link>
                                <div style={{ margin: "5px" }}>
                                  <img
                                    src={"/images/open-link.webp"}
                                    alt="link"
                                    style={{
                                      width: "15px",
                                      height: "15px",
                                      marginTop: "2px"
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="list-article-category-details">
                                <span className="list-article-published">
                                  {moment.utc(item.article.published_date).format(
                                    "MMM DD"
                                  )}
                                </span>
                                <span className="list-article-author-name">
                                  {item?.article?.authors.name}
                                </span>
                                <span className="list-article-category-name">
                                  {item?.article?.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="list-view-chart-wrapper">
                            <div className="list-view-chart">
                              <LineChartTiny
                                series={item?.series}
                                labels={item?.labels}
                              />
                            </div>
                          </div>
                          <div className="list-view-count">
                            <div className="list-view-minutes">
                              <div className="list-value">
                                {item?.total_time_spent
                                  ? formatDurationCategory(
                                      item?.total_time_spent
                                    )
                                  : 0}
                              </div>
                              &nbsp; &nbsp;
                              <div className="list-label">Total Spent</div>
                            </div>
                            <div className="list-minutes-vistor">
                              <div className="list-value">
                                {item?.average_time_spent
                                  ? formatDurationCategory(
                                      item?.average_time_spent
                                    )
                                  : 0}
                              </div>
                              &nbsp; &nbsp;
                              <div className="list-label">Per Visitor</div>
                            </div>
                          </div>
                          <div className="list-vistors-view">
                            <div className="list-total-vistors">
                              {" "}
                              {item?.users.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        {tableListData?.length !== index + 1 && (
                          <div className="article-divider"></div>
                        )}
                      </>
                    );
                  })}
                </div>
              </Spin>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
