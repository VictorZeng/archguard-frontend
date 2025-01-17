import { queryClassDependence } from "@/api/module/dependenceGraph.ts";
import InvokeGraph from "@/components/Business/InvokeGraph";
import React, { useEffect, useState } from "react";
import {
  buildClassDependenceTree,
  buildClassInvokesTree,
  buildClassMethodInvokesTree,
  generateNodeEdges,
} from "../utils";
import { GraphData } from "@/models/graph";
import { JClass, JMethod } from "@/models/java";
import ClassDependenceArgsForm from "./ClassDependenceArgsForm";
import useUrlQuery from '@/hooks/useUrlQuery';

enum ClassDependenceType {
  dependencies = "dependencies",
  invokes = "invokes",
  methods_callees = "methods_callees",
}

type JItem = JClass | JMethod;

const calculateNodeEdges = (
  dependenceType: ClassDependenceType,
  jclass: JClass,
  deep: number = 3,
): GraphData<JItem> => {
  const buildTreeFunctions: { [key in ClassDependenceType]: Function } = {
    [ClassDependenceType.dependencies]: buildClassDependenceTree,
    [ClassDependenceType.invokes]: buildClassInvokesTree,
    [ClassDependenceType.methods_callees]: buildClassMethodInvokesTree,
  };
  const rootNodes = buildTreeFunctions[dependenceType](jclass);
  const nodeEdges = generateNodeEdges(rootNodes, deep);
  return nodeEdges as GraphData<JItem>;
};

type ClassFormData = {
  deep: number;
  dependenceType: ClassDependenceType;
  className: string[];
  module?: string;
};

interface ClassDependenceProps {
  systemId: number
}

function ClassDependence(props: ClassDependenceProps) {
  const query = useUrlQuery();

  const [graphData, setGraphData] = useState<GraphData<JItem>>({ edges: [], nodes: [] });
  const [className, setClassName] = useState("");
  const [defaultFormData, setDefaultFormData] = useState({});

  useEffect(() => {
    if (query.className) {
      const defaultData: ClassFormData = {
        ...query,
        deep: 3,
        dependenceType: ClassDependenceType.dependencies,
        className: query.className.split("."),
      };
      onShowClick(defaultData);
      setDefaultFormData(defaultData);
      setGraphData({ edges: [], nodes: [] });
    }
  }, [query]);

  function onShowClick(args: ClassFormData) {
    const { className, dependenceType, deep, module } = args;
    if (className[0] === "") {
      className.shift()
    }

    queryClassDependence(className.join("."), dependenceType, {
      deep: deep,
      module: module,
    }, props.systemId).then((res) => {
      const nodeEdges = calculateNodeEdges(dependenceType, res);
      setGraphData(nodeEdges);
      setClassName(className.join("."));
    });
  }

  return (
    <div>
      <ClassDependenceArgsForm
        onFinish={onShowClick}
        defaultFormData={defaultFormData}
        systemId={props.systemId}
       />
      {/* <Graph graphData={graphData}/> */}
      <InvokeGraph
        id="classDependenceGraph"
        data={graphData}
        title={className}
        systemId={props.systemId}
        nodeLabel={{
          placeholder: "类名显示",
          options: [
            { label: "类名", value: "class" },
            { label: "包名.类名", value: "package.class" },
          ],
          setLabel: (fullName: string, type: string) => {
            if (type === "class") {
              if (fullName.endsWith(".")) return "";
              return fullName.substring(fullName.lastIndexOf(".") + 1);
            }
            return fullName;
          },
        }}
        showAllSelect={true}
      />
    </div>
  );
}

export default ClassDependence;
