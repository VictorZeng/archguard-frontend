import { defineConfig } from "umi";

export default defineConfig({
  nodeModulesTransform: {
    type: "none",
    exclude: [],
  },
  hash: true,
  antd: {},
  dva: false,
  locale: {
    default: 'zh-CN'
  },
  devServer: { port: 8081 },
  define: {
    "process.env.BUILD_TARGET": process.env.BUILD_TARGET,
  },
  lessLoader: { javascriptEnabled: true },
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
      secure: false,
    },
  },
  routes: [
    { path: "/", redirect: "/home" },
    { path: "/home", component: "@/pages/home" },
    { path: "/services-map", component: "@/pages/servicesMap/ServicesMap" },
    {
      exact: false,
      path: "/:systemId",
      component: "@/components/Business/Layouts/PageLayout",
      routes: [
        {
          path: "analysis/dependence",
          component: "@/pages/dependence",
        },
        {
          path: "systemSummary/Summary",
          component: "@/pages/system/systemSummary/Summary/Summary",
        },
        {
          path: "systemEvolving/MeasureIndicators",
          component: "@/pages/system/systemEvolving/MeasureIndicators/MeasureIndicators",
        },
        {
          path: "systemEvaluation/Redundancy",
          component: "@/pages/system/systemEvaluation/Redundancy/Redundancy",
        },
        {
          path: "systemEvaluation/SizingEvaluation",
          component: "@/pages/system/systemEvaluation/SizingEvaluation/SizingEvaluation",
        },
        {
          path: "systemEvaluation/CouplingEvaluation",
          component: "@/pages/system/systemEvaluation/CouplingEvaluation/CouplingEvaluation",
        },
        {
          path: "systemEvaluation/cohesionEvaluation",
          component: "@/pages/system/systemEvaluation/CohesionEvaluation/CohesionEvaluation",
        },
        {
          path: "analysis/metric/:type?",
          component: "@/pages/system/metrics",
        },
        {
          path: "systemEvolving",
          component: "@/pages/system/systemEvolving/SystemEvolving",
        },
        {
          path: "systemEvolving/QualityGateProfile",
          component: "@/pages/system/systemEvolving/QualityGateProfile/QualityGateProfile",
        },
        {
          path: "systemEvaluation/TestEvaluation",
          component: "@/pages/system/systemEvaluation/TestEvaluation/TestEvaluation",
        },
        {
          path: "systemEvolving/BadSmellThreshold",
          component: "@/pages/system/systemEvolving/BadSmellThreshold/BadSmellThreshold",
        },
        {
          path: "systemEvolving/BadSmellOverview",
          component: "@/pages/system/systemEvolving/BadSmellOverview/BadSmellOverview",
        },
      ],
    },
  ],
  theme: {
    "@primary-color": "#3AAFAE",
  },
});
