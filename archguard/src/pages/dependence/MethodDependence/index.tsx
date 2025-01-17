import { queryMethodDependence } from "@/api/module/dependenceGraph";
import InvokeGraph from "@/components/Business/InvokeGraph";
import React, { useEffect, useState } from "react";
import { buildMethodTree, generateNodeEdges } from "../utils";
import { JMethod } from "../../../models/java";
import { GraphData } from "../../../models/graph";
import MethodDependenceArgsForm from './MethodDependenceArgsForm'
import useUrlQuery from '@/hooks/useUrlQuery';

enum MethodDependenceType {
  invokes = "invokes",
  callees = "callees",
  callers = "callers",
}

type MethodFormData = {
  module?: string;
  deep?: number;
  dependenceType: MethodDependenceType;
  className: string[];
  methodName?: string;
};

interface MethodDependenceProps {
  systemId: number
}

function MethodDependence(props: MethodDependenceProps) {
  const query = useUrlQuery();

  const [graphData, setGraphData] = useState<GraphData<JMethod>>({ nodes: [], edges: [] });
  const [className, setClassName] = useState("");
  const [methodName, setMethodName] = useState("");
  const [defaultFormData, setDefaultFormData] = useState({});

  useEffect(() => {
    if (query.className && query.methodName) {
      const defaultData:MethodFormData = {
        ...query,
        deep: 3,
        dependenceType: MethodDependenceType.invokes,
        className: query.className.split('.')
      };
      setDefaultFormData(defaultData);
      onShowClick(defaultData).then(r => {});
      setGraphData({ nodes: [], edges: [] });
    }
  }, [query]);

  function onShowClick(args: MethodFormData) {
    let className = args.className;
    if (className[0] === "") {
      className.shift()
    }

    return queryMethodDependence(className.join('.'), args.dependenceType, {
      name: args.methodName,
      module: args.module,
      deep: args.deep,
    }, props.systemId).then((res) => {
      const tree = buildMethodTree(res);
      const nodeEdges = generateNodeEdges(tree, 3);
      setGraphData(nodeEdges);
      setClassName(className.join('.'));
      setMethodName(args.methodName||'');
    });
  }

  return (
    <div>
      <div>
        <MethodDependenceArgsForm onFinish={ onShowClick } defaultFormData={ defaultFormData } systemId={props.systemId}/>
        <InvokeGraph
          id="methodDependenceGraph"
          data={graphData}
          title={className + "." + methodName}
          nodeLabel={{
            placeholder: "方法名显示",
            options: [
              { label: "方法名", value: "method" },
              { label: "类名.方法名", value: "class.method" },
              { label: "包名.类名.方法名", value: "package.class.method" },
            ],
            setLabel: (fullName: string, type: string) => {
              if (type === "method") {
                if (fullName.endsWith(".")) return "";
                return fullName.substring(fullName.lastIndexOf(".") + 1);
              }
              if (type === "class.method") {
                const names = fullName.split(".");
                return names.slice(-2).join(".");
              }
              return fullName;
            },
          }}
          showAllSelect={true}
         systemId={props.systemId}/>
      </div>
    </div>
  );
}

export default MethodDependence;
