export const generateTableData = (data, headers) => {
  const finalData = [];

  if (headers && headers.length > 0) {
    data &&
      data.forEach((item) => {
        let obj = {};
        item.forEach((val, i) => {
          obj[headers[i]] = val;
        });
        finalData.push(obj);
      });
  } else {
    data &&
      data.forEach((item) => {
        let obj = {};
        item.forEach((val, i) => {
          obj[`Column_${i + 1}`] = val;
        });
        finalData.push(obj);
      });
  }

  let columns = [];
  let rows = [];

  if (finalData?.length > 0) {
    const rowKeys = Object.keys(finalData[0]);

    if (headers && headers.length > 0) {
      columns = headers.map((key) => {
        return {
          title: key,
          dataIndex: key,
          key
        };
      });
    } else {
      columns = rowKeys?.map((key) => {
        return {
          title: key,
          dataIndex: key,
          key
        };
      });
    }

    finalData.forEach((row, index) => {
      const eachRow = {};
      eachRow.key = index + 1;
      rowKeys.forEach((eachRowKey) => {
        let value = row[eachRowKey];

        eachRow[eachRowKey] = value;
      });

      rows.push(eachRow);
    });
  }

  const tableData = {
    columns,
    rows
  };

  return tableData;
};

export const dataValue = {
  // headers: ["Name", "Value", "Age"],
  data: [
    ["Daniel", 10, 23],
    ["Katelyn", 9, 34],
    ["Elizabeth", 6, 22],
    ["Barbara", 5, 33],
    ["Stephanie", 4, 3],
    ["Paula", 4, 12],
    ["Sachin", 4, 14],
    ["Monica", 3, 20],
    ["Laurie", 2, 1],
    ["Cindy", 2, 26]
  ],
  type: "table",
  message:
    "The top 10 authors by the number of articles they have written are: Daniel with 10 articles, Katelyn with 9 articles, Elizabeth with 6 articles, Barbara with 5 articles, Stephanie with 4 articles, Paula with 4 articles, Sachin with 4 articles, Monica with 3 articles, Laurie with 2 articles, and Cindy with 2 articles.",
  query:
    "SELECT authors_product_table.name, COUNT(articles_product_mock.article_id) AS total_articles\nFROM authors_product_table\nLEFT JOIN articles_product_mock ON authors_product_table.author_id = articles_product_mock.author_id\nGROUP BY authors_product_table.name\nORDER BY total_articles DESC\nLIMIT 10;",
  question: "top 10 authors"
};
