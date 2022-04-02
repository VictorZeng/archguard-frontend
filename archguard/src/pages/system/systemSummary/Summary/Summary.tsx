import React, { useEffect, useState } from "react";
import styles from "./Summary.less";
import { BaButton } from "@/components/Basic/Button/Button";
import { BaLabel } from "@/components/Basic/Label/Label";
import { BuGrade } from "@/components/Business/Grade/Grade";
import { useOverviewCount } from "@/api/module/codeLine";
import { history, useParams } from "umi";
import { storage } from "@/store/storage/sessionStorage";
import useSystemList from "@/store/global-cache-state/useSystemList";
import { queryContainerServices } from "@/api/module/containerService";
import { Table } from 'antd';
import FileChangeSizing from "@/pages/system/systemSummary/Summary/components/FileChangeSizing";
import FileSizing from "@/pages/system/systemSummary/Summary/components/FileSizing";
import { queryUnstableFiles } from "@/api/module/gitFile";
import { DonutChart } from "bizcharts";
import ApiResourceTree from "@/pages/system/systemSummary/Summary/components/ApiResourceTree";

function Summary() {
  // todo: load system id from url
  const { data: overviewCount } = useOverviewCount();
  const [services, setServices] = useState({} as any);
  const [unstableFiles, setUnstableFiles] = useState([]);

  const { systemId } = useParams();
  storage.setSystemId(systemId)

  const [systemList] = useSystemList();
  const [systemName, setSystemName] = useState<string>("");

  const getSystemName = (): string => {
    const list = systemList?.value || [];
    return list.find((system) => system.id === parseInt(systemId))?.systemName || "";
  };

  useEffect(() => {
    setSystemName(getSystemName());
  }, [systemList]);

  useEffect(() => {
    queryContainerServices(systemId).then((res) => {
      setServices(res);
    });
  }, []);

  useEffect(() => {
    queryUnstableFiles(systemId).then((res) => {
      setUnstableFiles(res as any);
    });
  }, []);

  const demandColumns = [
    { title: 'Source Method', dataIndex: 'sourceMethod', key: 'sourceMethod', },
    { title: 'URI', dataIndex: 'targetUrl', key: 'targetUrl', },
    { title: 'HTTP Method', dataIndex: 'targetHttpMethod', key: 'targetHttpMethod', },
  ];

  const resourceColumns = [
    { title: 'Package Name', dataIndex: 'packageName', key: 'packageName', },
    { title: 'className', dataIndex: 'className', key: 'className', },
    { title: 'methodName', dataIndex: 'methodName', key: 'methodName', },
    { title: 'sourceHttpMethod', dataIndex: 'sourceHttpMethod', key: 'sourceHttpMethod', },
    { title: 'sourceUrl', dataIndex: 'sourceUrl', key: 'sourceUrl', },
  ];

  const lineCountColumns = [
    { title: '语言', dataIndex: 'language', key: 'language', },
    { title: '行数', dataIndex: 'lineCount', key: 'lineCount', },
    { title: '文件数', dataIndex: 'fileCount', key: 'fileCount', },
  ];

  const unstableColumns = [
    { title: '路径', dataIndex: 'path', key: 'path', },
    { title: '变更', dataIndex: 'changes', key: 'changes', },
    { title: '行数', dataIndex: 'lineCount', key: 'lineCount', },
  ];

  return (
    <div>
      <div className={ styles.header }>
        <div className={ styles.title }>
          <div className={ styles.name }>{ systemName }</div>
        </div>
        <BaButton onClick={ () => history.push(`/${ storage.getSystemId() }/systemEvolving/MeasureIndicators`) }>
          查看指标看板
        </BaButton>
      </div>

      <div className={ styles.body }>
        <div className={ styles.detail }>
          <div className={ styles.overview }>
            <BaLabel value={ overviewCount?.repoCount } text="代码仓数"/>
            <BaLabel value={ overviewCount?.moduleCount } text="模块数"/>
            <BaLabel value={ overviewCount?.contributorCount } text="代码贡献人数"/>
            <BuGrade text="架构质量等级" grade={ overviewCount?.qualityLevel }/>
          </div>
        </div>
        <div className={ styles.changes }>
          <Table className={ styles.codeChart } dataSource={ overviewCount?.lineCounts } columns={ lineCountColumns }
                 size={ 'middle' } pagination={
            { defaultPageSize: 5 }
          }/>
          <DonutChart
            data={ overviewCount?.lineCounts || [] }
            autoFit
            height={ 350 }
            width={ 600 }
            radius={ 0.8 }
            padding="auto"
            angleField="lineCount"
            colorField="language"
            pieStyle={ { stroke: "white", lineWidth: 5 } }
          />
        </div>
      </div>
      <h2>不稳定性</h2>
      <div className={ styles.physical }>
        <div className={ styles.changes }>
          <div className={ styles.graph }>
            <h2>提交变更频率（大小）</h2>
            <FileSizing systemId={systemId}/>
          </div>
          <div className={ styles.graph }>
            <h2>提交变更频率（大小）-文件长度（颜色深浅）</h2>
            <FileChangeSizing systemId={systemId}/>
          </div>
        </div>
        <div>
          <h2>不稳定文件（Top 50 行数 + Top 50 变更）</h2>
          <Table dataSource={ unstableFiles } columns={ unstableColumns } pagination={
            { defaultPageSize: 5 }
          }/>
        </div>
      </div>
      <div className={ styles.physical }>
        <div className={ styles.demand }>
          <h2>API 使用清单 ({ services["demands"]?.length })</h2>
          <Table dataSource={ services["demands"] } columns={ demandColumns }/>
        </div>
        { services["resources"]?.length &&
          <div className={ styles.resource }>
            <h2>API 提供清单 ({ services["resources"]?.length })</h2>
            <Table dataSource={ services["resources"] } columns={ resourceColumns }/>
            <ApiResourceTree dataSource={ services["resources"] }/>
          </div>
        }
      </div>
    </div>
  );
}

export default Summary;