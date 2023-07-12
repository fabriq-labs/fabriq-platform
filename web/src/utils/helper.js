import * as moment from "moment";
import React from "react";

export const numberConvertion = (labelValue) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? Math.abs(Number(labelValue)) / 1.0e6 + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
    : Math.abs(Number(labelValue)).toFixed(2)
    ? Math.abs(Number(labelValue)).toFixed(2)
    : `${labelValue}`;
};

export const articleData = () => {
  return {
    viewsPerMin: [
      {
        name: "Google",
        data: [10, 70, 150, 245, 350, 358, 450, 300, 230, 50, 10]
      },
      {
        name: "Facebook",
        data: [15, 125, 135, 175, 257, 456, 500, 620, 130, 450, 150]
      },
      {
        name: "Unknown -to content",
        data: [5, 75, 100, 120, 0, 155, 200, 244, 0, 120, 34]
      },
      {
        name: "Baidu",
        data: [0, 156, 235, 203, 567, 456, 234, 532, 334, 656, 10]
      },
      {
        name: "Yandex",
        data: [29, 35, 77, 170, 190, 340, 150, 70, 10, 24, 30]
      },
      {
        name: "Twitter",
        data: [35, 355, 235, 46, 100, 423, 234, 35, 55, 50, 10]
      },
      {
        name: "Reddit",
        data: [2, 135, 250, 255, 350, 245, 134, 120, 0, 50, 10]
      },
      {
        name: "Other",
        data: [5, 45, 50, 56, 25, 356, 325, 120, 230, 50, 10]
      }
    ],
    readData: [
      { country: "Saudi Arabia", count: 100000, percent: "67%" },
      { country: "Pakistan", count: 10000, percent: "32%" },
      { country: "Egypt", count: 10000, percent: "6%" },
      { country: "USA", count: 20000, percent: "12%" },
      { country: "Iraq", count: 34679, percent: "12%" },
      { country: "UAE", count: 12356, percent: "10%" },
      { country: "ALgeria", count: 35678, percent: "15%" },
      { country: "Rest of the world", count: 35000, percent: "11%" }
    ],
    wayPeopleRead: [
      { browser: "Desktop Browser", count: 25000 },
      { browser: "Phone Browser", count: 88000 },
      { browser: "Table Browser", count: 25000 },
      { browser: "Mobile App", count: 35000 },
      { browser: "Others", count: 0 }
    ],
    peopleFindData: [
      { site: "Google", views: 247841 },
      { site: "Bing", views: 65159 },
      { site: "Facebook", views: 394 },
      { site: "(Direct)", views: 18904 },
      { site: "Twitter", views: 1500 },
      { site: "Yahoo", views: 12796 },
      { site: "Baidu", views: 4134 },
      { site: "yandex", views: 3150 },
      { site: "Duckduckgo", views: 2165 },
      { site: "Naver", views: 984 }
    ]
  };
};

export const overViewData = () => {
  return {
    heading: "A Busy day",
    iconOpt: [
      { label: "Hai", value: "Hai" },
      { label: "Hello", value: "Hello" }
    ],
    optAudiences: [
      { label: "All Day", value: "All Day" },
      { label: "All audiances", value: "All audiences" }
    ],
    optAllData: [
      { label: "All Day", value: "All Day" },
      { label: "All audiances", value: "All audiences" }
    ],
    trafficDetails: "30% more traffic than on an average Tuesday",
    description: "Yesterday was the 58th best Monday, 384th overall.",
    views: [
      { title: "Page Views", value: 63400 },
      { title: "Visitors", value: 216000 },
      { title: "Minutes", value: 46200 },
      { title: "Avg. Time", value: "2 : 11" },
      { title: "Soc. Interactions", value: 5263 },
      { title: "New Posts", value: 6 }
    ],
    chartValues: {
      labels: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z"
      ],
      series: [
        {
          name: "count",
          data: [31, 40, 28, 51, 42, 109, 100]
        }
      ]
    },
    data: [
      { id: 1, title: "Technology", views: 416313, type: "1", isTag: true },
      { id: 2, title: "type: report", views: 327040, type: "2", isTag: true },
      { id: 3, title: "Graphics", views: 216217, type: "3", isTag: true },
      { id: 4, title: "Apple Inc", views: 216217, type: "3", isTag: true },
      { id: 5, title: "Gadgets", views: 569825, type: "1", isTag: true },
      {
        id: 6,
        title: "Microsoft Windows",
        views: 15689,
        type: "2",
        isTag: true
      },
      { id: 7, title: "Ios MacOs", views: 216217, type: "3", isTag: true },
      { id: 8, title: "type: feature", views: 216217, type: "3", isTag: true },
      { id: 9, title: "macos", views: 216217, type: "2", isTag: true },
      { id: 10, title: "Graphics", views: 216217, type: "3", isTag: true }
    ],
    data1: [
      {
        id: 1,
        src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        views: 416313,
        type: "1",
        name: "Dan Godin",
        tech: "Biz&IT",
        title:
          "Passkeys--Microsoft, Apple, Google s password killer are finally here"
      },
      {
        id: 2,
        src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        views: 327040,
        type: "2",
        name: "Andrw",
        tech: "Tech",

        title: "macOs  13 Venture: The arc Technica review"
      },
      {
        id: 3,
        title: "We were not wowed by our first meta Quest pro experience",
        views: 216217,
        type: "3",
        name: "Kyle Orland",
        tech: "Gaming&Culture",
        src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      },
      {
        id: 4,
        title:
          "The ISS has had to maneuver yet again from Russia satellite debris",
        views: 216217,
        type: "3",
        name: "Erik Berger",
        tech: "Science",
        src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      },
      {
        id: 5,
        title: "We were not wowed by our first meta Quest pro experience",
        views: 216217,
        type: "3",
        name: "Kyle Orland",
        tech: "Gaming&Culture",
        src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      },
      {
        id: 6,
        title:
          "Comcats new higher upload speeds require $25-per-month x-Fi complete add-on",
        views: 853,
        type: "3",
        name: "John Brodkin",
        tech: "Ploicy",
        src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      },
      {
        id: 7,
        title: "Bayonetta 3 review: Updated over the top spectacle",
        views: 213,
        type: "3",
        name: "Ars staff",
        tech: "Gaming&Culture",
        src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      },
      {
        id: 8,
        title:
          "Slo Roads give chill, endless driving experience in your browser",
        views: 109,
        type: "3",
        name: "Kyle Orland",
        tech: "Gaming&Culture",
        src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      }
    ],
    data2: [
      { id: 1, title: "Technology", views: 416313, type: "1" },
      { id: 2, title: "type: report", views: 327040, type: "2" },
      { id: 3, title: "google", views: 216217, type: "3" },
      { id: 4, title: "reddit.com", views: 216217, type: "3" },
      { id: 5, title: "news.google.com", views: 216217, type: "3" },
      { id: 6, title: "flipboard", views: 216217, type: "3" },
      { id: 7, title: "duckduckgo", views: 216217, type: "3" },
      { id: 8, title: "bing", views: 216217, type: "3" },
      { id: 9, title: "linkedIn", views: 216217, type: "3" },
      { id: 10, title: "facebook", views: 216217, type: "3" }
    ]
  };
};

export const authorsData = () => {
  return {
    label1: [
      { id: 1, name: "PULSE" },
      { id: 2, name: "HISTORICAL" }
    ],
    label2: [
      { id: 1, name: "POSTS" },
      { id: 2, name: "VIDEOS" }
    ],
    views: [
      { title: "Search Refs", value: 75000 },
      { title: "Page Views", value: 89000 },
      { title: "Visitors", value: 26000 },
      { title: "New Posts", value: 4 }
    ],
    chartValues: {
      series: [
        "148.98K",
        "245.91K",
        "312.65K",
        "357.58K",
        "466.27K",
        "364.24K",
        "481.78K",
        "612.35K",
        "633.86K",
        "596.77K",
        "565.70K",
        "567.54K",
        "585.54K",
        "632.25K",
        "673.44K",
        "692.63K",
        "603.31K",
        "678.49K",
        "715.99K",
        "700.36K",
        "671.60K",
        "672.85K",
        "694.95K",
        "718.01K",
        "673.38K",
        "647.94K",
        "621.56K",
        "655.79K",
        "809.83K",
        "767.75K",
        "678.85K"
      ],
      labels: [
        "2022-10-10",
        "2022-10-11",
        "2022-10-12",
        "2022-10-13",
        "2022-10-15",
        "2022-10-16",
        "2022-10-17",
        "2022-10-18",
        "2022-10-19",
        "2022-10-20",
        "2022-10-21",
        "2022-10-22",
        "2022-10-23",
        "2022-10-24",
        "2022-10-25",
        "2022-10-26",
        "2022-10-27",
        "2022-10-28",
        "2022-10-29",
        "2022-10-30",
        "2022-11-01",
        "2022-11-02",
        "2022-11-03"
      ]
    },
    cardData: [
      { title: "Campaign", percentage: "1.4%" },
      { title: "Medium", percentage: "1.8%" },
      { title: "Content", percentage: "0.9%" },
      { title: "Source", percentage: "1.2%" },
      { title: "Term", percentage: "1.8%" },
      { title: "Group", percentage: "2/2" }
    ],
    tableData: [
      {
        id: 1,
        title: "Andrew Mortalenti",
        post: "254",
        refsperpost: "12",
        visitors: 23000,
        views: 17000,
        refs: 3432
      },
      {
        id: 2,
        title: "Clare Carr",
        post: "254",
        refsperpost: "10",
        views: 7200,
        visitors: 845,
        refs: 3432
      },
      {
        id: 3,
        title: "Alexa Benatar",
        post: "254",
        refsperpost: "58",
        visitors: 852,
        views: 526,
        refs: 263
      },
      {
        id: 4,
        title: "Medan Radogna",
        post: "254",
        refsperpost: "12",
        visitors: 552,
        views: 15200,
        refs: 455
      }
    ]
  };
};

export const pagesData = () => {
  return {
    label1: [
      { id: 1, name: "PULSE" },
      { id: 2, name: "HISTORICAL" }
    ],
    label2: [
      { id: 1, name: "POSTS" },
      { id: 2, name: "VIDEOS" }
    ],
    views: [
      { title: "Page Views", value: 0 },
      { title: "Visitors", value: 0 },
      { title: "Avg. Time", value: "00:00" },
      { title: "New Posts", value: 0 }
    ],
    chartValues: {
      series: [
        {
          name: "count",
          data: [
            5, 31, 40, 28, 585, 23, 85, 96, 12, 52, 35, 1, 12, 25, 45, 85, 65,
            52
          ]
        }
      ],
      labels: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z"
      ]
    },
    cardData: [
      { title: "Campaign", percentage: "1.4%" },
      { title: "Medium", percentage: "1.8%" },
      { title: "Content", percentage: "0.9%" },
      { title: "Source", percentage: "1.2%" },
      { title: "Term", percentage: "1.8%" },
      { title: "Group", percentage: "2/2" }
    ],
    tableData: [
      {
        id: 1,
        title: "www.http://parse.ly",
        date: "Marketingpage",
        site: "parsely.com",
        web: "parse.ly|Audience data and Content analytics for Digital Media",
        image:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        visitors: 14000,
        message: "PARSE.LY",
        time: "0:20",
        pageViews: 53122
      },
      {
        id: 2,
        title: "Log in to your parse.ly product",
        date: "Mar 25,2017",
        site: "Parsely.com",
        web: "parsely.com  Marketing Page",
        image:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        message: "PARSE.LY",
        visitors: 74000,
        time: "0:17",
        pageViews: 50233
      },
      {
        id: 3,
        title: "Parse.ly privacy policy | Abount Parse.ly",
        date: "Mar 25,2017",
        site: "Parsely.com",
        web: "parsely.com  Marketing Page",
        message: "PARSE.LY",
        image:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        visitors: 67000,
        time: "0:20",
        pageViews: 785
      }
    ]
  };
};

export const profileData = {
  insight: {
    value: 24870,
    score: "High"
  },
  orders: [
    {
      image: "/images/order_icon.png",
      name: "arabnews.com",
      rate: 154,
      date: "2022-10-24T20:45:00",
      time: "10:32 AM"
    }
  ],
  profiles: [
    {
      title: "Sports (29)",
      image:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    },
    {
      title: "Politics (121)",
      image:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    },
    {
      title: "Sudoku (67)",
      image:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    }
  ]
};

export const imageUrl = [
  {
    name: "Google Sheets",
    url: "https://storage.googleapis.com/fabirq_static_asset/images/googleSheets_logo.png"
  },
  {
    name: "GitHub",
    url: "https://storage.googleapis.com/fabirq_static_asset/images/github_logo.png"
  },
  {
    name: "PostgreSQL",
    url: "https://storage.googleapis.com/fabirq_static_asset/images/postgreSql_logo.png"
  },
  {
    name: "Pipedrive",
    url: "https://storage.googleapis.com/fabirq_static_asset/images/pipedrive_logo.png"
  },
  {
    name: "Salesforce",
    url: "https://storage.googleapis.com/fabirq_static_asset/images/salesforce.png"
  },
  {
    name: "Copper CRM",
    url: "https://storage.googleapis.com/fabirq_static_asset/images/copperCRM_logo.png"
  },
  {
    name: "Google Analytics",
    url: "https://storage.googleapis.com/fabirq_static_asset/images/google_analytics_logo.png"
  }
];

export const queryIds = {
  article: {
    articleQueryId: 368,
    searchArticleQueryId: 372,
    oneYearDataQuertId: 378,
    realtiemCurrentDataQueryId: 380,
    realtiemAverageDataQueryId: 381
  },
  articleByID: {
    historicalDataQueryId: 382,
    articleQueryId: 368
  },
  author: {
    authorQueryID: 375,
    searchAuthorQueryId: 373,
    authorHoursViewQueryId: 374
  },
  category: {
    categoryArticleQueryId: 369,
    categoryAuthorQueryID: 370
  },

  overView: {
    referenceQueryId: 14,
    postDataQueryId: 15,
    chartDataQueryId: 16,
    dailyChartCurrentDataQueryId: 377,
    dailyChartAverageDataQueryId: 379
  }
};

export const overviewData = {
  overviewToadyPost: [
    {
      page_views: 2100,
      article: {
        category: "politics",
        published_date: "2022-12-01",
        title: "Company foreign ten fish relationship parent kind of.",
        article_id: 5,
        author: {
          name: "Stephanie"
        }
      }
    },
    {
      page_views: 2200,
      article: {
        category: "fashion",
        published_date: "2023-01-28",
        title: "Admit world rate experience be increase act.",
        article_id: 1,
        author: {
          name: "Katelyn"
        }
      }
    },
    {
      page_views: 2300,
      article: {
        category: "fashion",
        published_date: "2022-11-25",
        title: "Floor resource president want.",
        article_id: 0,
        author: {
          name: "Elizabeth"
        }
      }
    },
    {
      page_views: 2400,
      article: {
        category: "news",
        published_date: "2022-09-15",
        title: "Away one better despite describe.",
        article_id: 3,
        author: {
          name: "Elizabeth"
        }
      }
    },
    {
      page_views: 2500,
      article: {
        category: "politics",
        published_date: "2022-12-01",
        title: "Company foreign ten fish relationship parent kind of.",
        article_id: 5,
        author: {
          name: "Stephanie"
        }
      }
    }
  ],
  overvieLastMinutes: [
    {
      page_views: 2200,
      article: {
        category: "politics",
        published_date: "2022-12-01",
        title: "Company foreign ten fish relationship parent kind of.",
        article_id: 5,
        author: {
          name: "Stephanie"
        }
      }
    },
    {
      page_views: 2000,
      article: {
        category: "fashion",
        published_date: "2023-01-28",
        title: "Admit world rate experience be increase act.",
        article_id: 1,
        author: {
          name: "Katelyn"
        }
      }
    },
    {
      page_views: 2400,
      article: {
        category: "fashion",
        published_date: "2022-11-25",
        title: "Floor resource president want.",
        article_id: 0,
        author: {
          name: "Elizabeth"
        }
      }
    },
    {
      page_views: 2600,
      article: {
        category: "news",
        published_date: "2022-09-15",
        title: "Away one better despite describe.",
        article_id: 3,
        author: {
          name: "Elizabeth"
        }
      }
    },
    {
      page_views: 2300,
      article: {
        category: "politics",
        published_date: "2022-12-01",
        title: "Company foreign ten fish relationship parent kind of.",
        article_id: 5,
        author: {
          name: "Stephanie"
        }
      }
    }
  ],
  overviewTagsHour: [
    {
      type: "Fashion",
      page_view: 23565
    },
    {
      type: "Education",
      page_view: 5565
    },
    {
      type: "AI",
      page_view: 2365
    },
    {
      type: "Finance",
      page_view: 2565
    },
    {
      type: "News",
      page_view: 63565
    },
    {
      type: "Data Science",
      page_view: 43565
    }
  ],
  overViewChart: {
    labels: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24"
    ],
    seriesData: {
      page_views: {
        current: [
          1546, 1285, 1337, 1557, 1866, 1667, 1815, 1805, 1499, 1317, 1749,
          1283, 1037, 1714, 1663, 1240, 1182, 1766, 1720, 1261, 1112, 1993,
          1427, 1109
        ],
        average: [
          1246, 1585, 1137, 1457, 1266, 1867, 1515, 1705, 1899, 1417, 1149,
          1583, 1437, 1814, 1363, 1940, 1582, 1266, 1320, 1661, 1812, 1493,
          1727, 1909
        ]
      },
      users: {
        current: [
          1246, 1585, 1137, 1457, 1266, 1867, 1515, 1705, 1899, 1417, 1149,
          1583, 1437, 1814, 1363, 1940, 1582, 1266, 1320, 1661, 1812, 1493,
          1727, 1909
        ],
        average: [
          1546, 1285, 1337, 1557, 1866, 1667, 1815, 1805, 1499, 1317, 1749,
          1283, 1037, 1714, 1663, 1240, 1182, 1766, 1720, 1261, 1112, 1993,
          1427, 1109
        ]
      }
    },
    series: [
      {
        name: "current",
        data: [
          1546, 1285, 1337, 1557, 1866, 1667, 1815, 1805, 1499, 1317, 1749,
          1283, 1037, 1714, 1663, 1240, 1182, 1766, 1720, 1261, 1112, 1993,
          1427, 1109
        ]
      },
      {
        name: "avergae",
        data: [
          1246, 1585, 1137, 1457, 1266, 1867, 1515, 1705, 1899, 1417, 1149,
          1583, 1437, 1814, 1363, 1940, 1582, 1266, 1320, 1661, 1812, 1493,
          1727, 1909
        ]
      }
    ]
  },
  overrallData: {
    post_view: {
      title: "Post Views",
      value: 68903467
    },
    post_visitor: {
      title: "Post Visitors",
      value: 26600
    },
    minutes: {
      title: "Ttl Time Spent",
      value: 36100
    },
    total_shares: {
      title: "Total Shares",
      value: 5900
    },
    new_posts: {
      title: "New Posts",
      value: 10
    }
  }
};

export const articlePageData = {
  pageViewsData: {
    labels: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24"
    ],
    series: [
      {
        name: "current",
        data: [
          1546, 1285, 1337, 1557, 1866, 1667, 1815, 1805, 1499, 1317, 1749,
          1283, 1037, 1714, 1663, 1240, 1182, 1766, 1720, 1261, 1112, 1993,
          1427, 1109
        ]
      },
      {
        name: "avergae",
        data: [
          1246, 1585, 1137, 1457, 1266, 1867, 1515, 1705, 1899, 1417, 1149,
          1583, 1437, 1814, 1363, 1940, 1582, 1266, 1320, 1661, 1812, 1493,
          1727, 1909
        ]
      }
    ]
  },
  pageCountData: {
    vistiors: {
      title: "Visitors",
      value: 120900
    },
    minutes: {
      title: "Minutes",
      value: 220700
    },
    average_minutes: {
      title: "AVG Minutes",
      value: 45550
    }
  },
  articleListData: [
    {
      page_views: 2200,
      minutes: 12000,
      minutes_per_visitor: 3000,
      article: {
        category: "politics",
        published_date: "2022-12-01",
        title: "Company foreign ten fish relationship parent kind of.",
        article_id: 5,
        author: {
          name: "Stephanie"
        }
      }
    },
    {
      page_views: 2000,
      minutes: 21000,
      minutes_per_visitor: 4000,
      article: {
        category: "fashion",
        published_date: "2023-01-28",
        title: "Admit world rate experience be increase act.",
        article_id: 1,
        author: {
          name: "Katelyn"
        }
      }
    },
    {
      page_views: 2400,
      minutes: 10000,
      minutes_per_visitor: 300,
      article: {
        category: "fashion",
        published_date: "2022-11-25",
        title: "Floor resource president want.",
        article_id: 0,
        author: {
          name: "Elizabeth"
        }
      }
    },
    {
      page_views: 2600,
      minutes: 1800,
      minutes_per_visitor: 3200,
      article: {
        category: "news",
        published_date: "2022-09-15",
        title: "Away one better despite describe.",
        article_id: 3,
        author: {
          name: "Elizabeth"
        }
      }
    },
    {
      page_views: 2300,
      minutes: 27000,
      minutes_per_visitor: 5000,
      article: {
        category: "politics",
        published_date: "2022-12-01",
        title: "Company foreign ten fish relationship parent kind of.",
        article_id: 5,
        author: {
          name: "Stephanie"
        }
      }
    },
    {
      page_views: 2300,
      minutes: 27000,
      minutes_per_visitor: 5000,
      article: {
        category: "politics",
        published_date: "2022-12-01",
        title: "Company foreign ten fish relationship parent kind of.",
        article_id: 5,
        author: {
          name: "Stephanie"
        }
      }
    },
    {
      page_views: 2300,
      minutes: 27000,
      minutes_per_visitor: 5000,
      article: {
        category: "politics",
        published_date: "2022-12-01",
        title: "Company foreign ten fish relationship parent kind of.",
        article_id: 5,
        author: {
          name: "Stephanie"
        }
      }
    }
  ]
};

export const rangePresets = {
  Today: [moment(), moment()],
  "This Month": [moment().startOf("month"), moment().endOf("month")],
  "Last month": [
    moment().subtract(1, "months").startOf("month"),
    moment().subtract(1, "months").endOf("month")
  ],
  "This Week": [moment().startOf("week"), moment().endOf("week")],
  "Last Week": [
    moment().subtract(1, "weeks").startOf("isoWeek"),
    moment().subtract(1, "weeks").endOf("isoWeek")
  ],
  "6 Months": [
    moment().subtract(6, "months").startOf("month"),
    moment().subtract(1, "months").endOf("month")
  ]
};

export const formatNumber = (value) => {
  if (value >= 1000000) {
    return ` ${(value / 1000000).toFixed(1)} M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  } else {
    return value?.toString();
  }
};

export const exitPageContent = [
  { clicks: 1456, title: "Arab-News-Worldwide Latest Breakng News & Updates." },
  { clicks: 1326, title: "We should treat every day as Eart Day." },
  { clicks: 1256, title: "Columnist" },
  { clicks: 1126, title: "Australian Grand prix." },
  { clicks: 345, title: "Multilateral fronts key to fighting terrorism." },
  {
    clicks: 16,
    title: "Flambeed dish sparks Spain restaurant fire, killing two."
  }
];

export const breakdownData = {
  social: [
    { name: "New visitor", data: [58.6] },
    { name: "Returning Visitor", data: [27.1] },
    { name: "Channel Visitor", data: [14.3] }
  ],
  device: [
    { name: "New visitor", data: [38.6] },
    { name: "Returning Visitor", data: [37.1] },
    { name: "Channel Visitor", data: [24.3] }
  ],
  visitor: [
    { name: "New visitor", data: [58.6] },
    { name: "Returning Visitor", data: [27.1] },
    { name: "Channel Visitor", data: [14.3] }
  ]
};

export const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" }
];

export const quarters = [
  { value: 1, label: "Q1" },
  { value: 2, label: "Q2" },
  { value: 3, label: "Q3" },
  { value: 4, label: "Q4" }
];

export const years = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, index) => ({
    value: (currentYear - index).toString(),
    label: (currentYear - index).toString()
  }));

  return years;
};

export const formatDuration = (duration, textFontSize, numberFontSize) => {
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  if (hours > 0) {
    return (
      <span>
        <span style={{ fontSize: numberFontSize }}>{hours}</span>
        <span style={{ fontSize: textFontSize }}>h</span>{" "}
        <span style={{ fontSize: numberFontSize, marginLeft: "5px" }}>
          {minutes}
          <span style={{ fontSize: textFontSize }}>m</span>
        </span>
      </span>
    );
  } else if (minutes > 0) {
    return (
      <span>
        <span style={{ fontSize: numberFontSize }}>
          {minutes}
          <span style={{ fontSize: textFontSize }}>m</span>
        </span>
      </span>
    );
  } else {
    return (
      <span>
        <span style={{ fontSize: numberFontSize }}>
          {duration.seconds()}
          <span style={{ fontSize: textFontSize }}>s</span>
        </span>
      </span>
    );
  }
};

const default_is_empty_options = {
  ignore_whitespace: false
};

const numericNoSymbols = /^[0-9]+$/;

export const decimal = {
  "en-US": ".",
  ar: "٫"
};

export function isEmpty(str, options) {
  assertString(str);
  options = merge(options, default_is_empty_options);

  return (options.ignore_whitespace ? str.trim().length : str.length) === 0;
}

export function merge(obj = {}, defaults) {
  for (const key in defaults) {
    if (typeof obj[key] === "undefined") {
      obj[key] = defaults[key];
    }
  }
  return obj;
}

export function assertString(input) {
  const isString = typeof input === "string" || input instanceof String;

  if (!isString) {
    let invalidType = typeof input;
    if (input === null) invalidType = "null";
    else if (invalidType === "object") invalidType = input.constructor.name;

    throw new TypeError(`Expected a string but received a ${invalidType}`);
  }
}

export function isNumeric(str, options) {
  assertString(str);
  if (options && options.no_symbols) {
    return numericNoSymbols.test(str);
  }
  return new RegExp(
    `^[+-]?([0-9]*[${
      (options || {}).locale ? decimal[options.locale] : "."
    }])?[0-9]+$`
  ).test(str);
}
