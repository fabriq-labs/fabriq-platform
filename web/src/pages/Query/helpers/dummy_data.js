export const obj = {
  cubes: [
    {
      name: "TablematSalesCsv",
      title: "Tablemat Sales Csv",
      measures: [
        {
          name: "TablematSalesCsv.count",
          title: "Tablemat Sales Csv Count",
          shortTitle: "Count",
          cumulativeTotal: false,
          cumulative: false,
          type: "number",
          aggType: "count",
          drillMembers: ["TablematSalesCsv.date"],
          drillMembersGrouped: {
            measures: [],
            dimensions: ["TablematSalesCsv.date"]
          }
        },
        {
          name: "TablematSalesCsv.unitCost",
          title: "Tablemat Sales Csv Unit Cost",
          shortTitle: "Unit Cost",
          cumulativeTotal: false,
          cumulative: false,
          type: "number",
          aggType: "sum",
          drillMembers: [],
          drillMembersGrouped: {
            measures: [],
            dimensions: []
          }
        },
        {
          name: "TablematSalesCsv.total",
          title: "Tablemat Sales Csv Total",
          shortTitle: "Total",
          cumulativeTotal: false,
          cumulative: false,
          type: "number",
          aggType: "sum",
          drillMembers: [],
          drillMembersGrouped: {
            measures: [],
            dimensions: []
          }
        }
      ],
      dimensions: [
        {
          name: "TablematSalesCsv.date",
          title: "Tablemat Sales Csv Date",
          type: "string",
          shortTitle: "Date",
          suggestFilterValues: true
        },
        {
          name: "TablematSalesCsv.region",
          title: "Tablemat Sales Csv Region",
          type: "string",
          shortTitle: "Region",
          suggestFilterValues: true
        },
        {
          name: "TablematSalesCsv.item",
          title: "Tablemat Sales Csv Item",
          type: "string",
          shortTitle: "Item",
          suggestFilterValues: true
        }
      ],
      segments: []
    }
  ]
};
