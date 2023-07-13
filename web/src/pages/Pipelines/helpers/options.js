// Options - Pipeline
const menuItems = [
  {
    step: 1,
    identifier: "source",
    title: "Select source"
  },
  {
    step: 2,
    identifier: "connect",
    title: "Connect"
  },
  {
    step: 3,
    identifier: "configure",
    title: "Configure"
  },
  {
    step: 4,
    identifier: "data",
    title: "Data"
  }
];

const syncList = [
  {
    label: "Last one month",
    value: "lastonemonth"
  },
  {
    label: "Last one year",
    value: "lastoneyear"
  },
  {
    label: "Last one week",
    value: "lastoneweek"
  }
];

const syncTimeList = [
  {
    label: "Every Day",
    value: "everyday"
  },
  {
    label: "Every Week",
    value: "everyweek"
  },
  {
    label: "Every year",
    value: "everyyear"
  }
];

const replicationMethod = [
  {
    label: "LOG_BASED",
    value: "LOG_BASED"
  },
  {
    label: "INCREMENTAL",
    value: "INCREMENTAL"
  },
  {
    label: "FULL_TABLE",
    value: "FULL_TABLE"
  }
];

const regionList = [
  {
    label: "us-east",
    value: "us-east"
  },
  {
    label: "us-west",
    value: "us-west"
  },
  {
    label: "af-south",
    value: "af-south"
  },
  {
    label: "ap-east",
    value: "ap-east"
  },
  {
    label: "ap-south",
    value: "ap-south"
  },
  {
    label: "ap-northeast",
    value: "ap-northeast"
  },
  {
    label: "ap-southeast",
    value: "ap-southeast"
  },
  {
    label: "ca-central",
    value: "ca-central"
  },
  {
    label: "cn-north",
    value: "cn-north"
  },
  {
    label: "cn-northwest",
    value: "cn-northwest"
  },
  {
    label: "eu-central",
    value: "eu-central"
  },
  {
    label: "eu-west",
    value: "eu-west"
  },
  {
    label: "eu-south",
    value: "eu-south"
  },
  {
    label: "eu-north",
    value: "eu-north"
  },
  {
    label: "me-south",
    value: "me-south"
  },
  {
    label: "sa-east",
    value: "sa-east"
  },
  {
    label: "us-gov-east",
    value: "us-gov-east"
  },
  {
    label: "us-gov-west",
    value: "us-gov-west"
  }
];

const fileFormatList = [
  {
    label: "csv",
    value: "csv"
  }
];

const salesforceOption = [
  {
    label: "Sandbox",
    value: "sandbox"
  },
  {
    label: "Production",
    value: "production"
  }
];

const oAuthType = [
  {
    label: "UserName",
    value: "user"
  },
  {
    label: "OAuth",
    value: "oAuth"
  }
];

const delimiterList = [
  {
    label: ",",
    value: ","
  }
];

const getOptions = (options) => {
  let dataList = [];
  if (options.length > 0) {
    options.forEach((opt) => {
      dataList.push(opt.table_name);
    });
  }

  return dataList;
};

const getObjects = (options) => {
  let dataList = [];
  if (options.length > 0) {
    options.forEach((opt) => {
      dataList.push(opt.QualifiedApiName);
    });
  }

  return dataList;
};

const getSObjects = (options) => {
  let dataList = [];
  if (options.length > 0) {
    options.forEach((opt) => {
      dataList.push(opt.name);
    });
  }

  return dataList;
};

const getProjectName = (options) => {
  let dataList = [];
  if (options.length > 0) {
    options.forEach((opt) => {
      dataList.push({
        label: opt.name,
        value: opt.name
      });
    });
  }
  return dataList;
};

const getConfigureOptions = (options) => {
  let dataList = [];
  if (options.length > 0) {
    options.forEach((item) => {
      dataList.push({
        label: item.name,
        value: item.id,
        type: item.type
      });
    });
  }

  return dataList;
};

export {
  menuItems,
  syncList,
  syncTimeList,
  fileFormatList,
  delimiterList,
  getOptions,
  replicationMethod,
  regionList,
  getConfigureOptions,
  getProjectName,
  getObjects,
  getSObjects,
  salesforceOption,
  oAuthType
};
