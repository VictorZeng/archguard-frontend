import BarChartOutlined from "@ant-design/icons/BarChartOutlined";
import CloudSyncOutlined from "@ant-design/icons/CloudSyncOutlined";
import FileTextOutlined from "@ant-design/icons/FileTextOutlined";
import HomeOutlined from "@ant-design/icons/HomeOutlined";
import React from "react";
import { configForTargets } from "../../config/buildTargets";

export const menuList = configForTargets({
  default: [
    { key: "/home", text: "首页", icon: <HomeOutlined /> },
    { key: "/system-evaluation", text: "系统评估", icon: <FileTextOutlined /> },
    {
      key: "analysisTools",
      text: "分析工具",
      icon: <BarChartOutlined />,
      children: [
        { key: "/analysis/dependence", text: "依赖分析" },
        { key: "/quality-gate-profile", text: '质量阀' },
      ],
    },
    {
      key: "transformTools",
      text: "改造工具",
      icon: <CloudSyncOutlined />,
      children: [
        {
          key: "/retrofit-tools/plsql-to-kotlin",
          text: "PL/SQL转Kotlin",
        },
      ],
    },
  ],
  zh: [
    {
      key: "analysisTools",
      text: "分析工具",
      icon: <BarChartOutlined />,
      children: [{ key: "/analysis/dependence", text: "依赖分析" }],
    },
  ],
});
