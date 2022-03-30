import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from "react";
import CodeSupport from "@/pages/system/systemSummary/Summary/d3Support/CodeSupport";

interface ApiResourceTreeProps {
  dataSource: any
}

const ApiResourceTree = (props: ApiResourceTreeProps) => {
  const [dataSource] = useState(props.dataSource);
  const [options, setOptions] = useState(null)

  useEffect(() => {
    if (!dataSource) {
      return
    }

    let apiMap = {}
    for (let element of dataSource) {
      apiMap[element.sourceUrl] = {
        name: element.sourceUrl,
        value: element.className + "." + element.methodName
      }
    }

    let dataMap = Object.values(apiMap)
    let hierarchy = CodeSupport.hierarchy(dataMap).children[0];

    setOptions({
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          data: [hierarchy],
          top: '1%',
          left: '7%',
          bottom: '1%',
          right: '20%',
          symbolSize: 7,
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 12
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left'
            }
          },
          emphasis: {
            focus: 'descendant'
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    })
  }, dataSource, setOptions)

  return (
    options && <ReactECharts
      option={ options }
      style={ { height: '960px', width: '100%' } }/>
  )
}

export default ApiResourceTree;
