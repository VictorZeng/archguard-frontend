import { queryModuleCoupling } from "@/api/module/module";
import CollapsibleCard from "@/components/CollapsibleCard";
import { exportJsonToExcel } from "@/utils/FileUtils.ts";
import QuestionCircleOutlined from "@ant-design/icons/lib/icons/QuestionCircleOutlined";
import { Button } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useModuleCoupling from "../../globalStates/useModuleCoupling";
import Report from "./report";

function ModuleCouplingTable(props) {
  const [moduleCoupling, setModuleCoupling] = useModuleCoupling();
  // const [, setSelectedNode] = useSelectedNode();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagedModuleCoupling, setPagedModuleCoupling] = useState([]);

  function onPageChange(page = 1, size = 10) {
    setPage(page);
    setPageSize(size);
  }

  function showAllModuleCoupling() {
    queryModuleCoupling().then((res) => {
      setModuleCoupling(res);
      onPageChange(1);
    });
  }

  function exportToExcel() {
    exportJsonToExcel(moduleCoupling, "moduleCoupling.xlsx");
  }

  // function onModuleClick() {
  //   setSelectedNode({ data: record.moduleName, key: "fullName" });
  // }

  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = moduleCoupling.slice(start, end);
    setPagedModuleCoupling(list);
  }, [moduleCoupling, page, pageSize, setPagedModuleCoupling]);

  return (
    <CollapsibleCard
      title={
        <Fragment>
          模块耦合度
          <Link
            to={{
              pathname: "/help/module-coupling",
            }}
            target="_blank"
          >
            {" "}
            <QuestionCircleOutlined />
          </Link>
        </Fragment>
      }
      extra={<Button onClick={() => exportToExcel()}>导出到Excel</Button>}
    >
      <div>
        <Button
          type="primary"
          onClick={() => showAllModuleCoupling()}
          style={{ marginBottom: "16px" }}
        >
          查询
        </Button>
        {moduleCoupling.length > 0 && <Report data={pagedModuleCoupling} />}
      </div>
    </CollapsibleCard>
  );
}

export default ModuleCouplingTable;
