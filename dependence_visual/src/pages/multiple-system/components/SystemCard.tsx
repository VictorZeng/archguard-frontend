import React from 'react'
import { Card, Button, Dropdown, Menu } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons'
import { SystemInfo } from '@/api/addition/systemInfo'

interface SystemCardProps {
  systemInfo?: SystemInfo;
  onClick?(): void;
  onEdit?(): void;
  onScanning?(): void;
}

const SystemCard = (props: SystemCardProps) => {
  const { systemInfo, onClick, onEdit, onScanning } = props

  const menuClick = (key: string) => {
    switch (key) {
      case 'reScanning': onScanning!();
        break;
      case 'editSystemInfo': onEdit!();
        break;
    }
  }

  const menu = (
    <Menu onClick={({ key }) => menuClick(key as string)}>
      <Menu.Item key="reScanning">重新扫描</Menu.Item>
      <Menu.Item key="editSystemInfo">修改系统信息</Menu.Item>
    </Menu>
  );

  const renderSystemButton = (systemInfo: SystemInfo) => {
    const { scanned } = systemInfo
    const onScannedClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      onScanning!()
      return event.stopPropagation()
    }

    return scanned === 'NONE' ? (<Button type="primary" onClick={onScannedClick}>扫描</Button>) :
           scanned === 'SCANNING' ? (<Button type="primary" loading>扫描中</Button>) :
          (<Button type="primary" onClick={onClick}>进入</Button>);
  }

  return (
    systemInfo ? (
      <Card
        hoverable
        className="multiple-system-card">
        <div className="multiple-system-card-content">
          <Dropdown
            overlay={menu}
            placement="bottomLeft"
            className="more"
            trigger={['click']}
            disabled={systemInfo.scanned === "SCANNING"}>
            <Button size="small" shape="circle" icon={<EllipsisOutlined />}></Button>
          </Dropdown>
          <img
            style={{ margin: '30px 0', width: '180px' }}
            src={require('@/assets/system-example.png')}
            alt="example" />
          <div className="card-btn">{ renderSystemButton(systemInfo) }</div>
        </div>
        <div className="multiple-system-card-title">
          <Meta
            title={systemInfo.systemName}
            description={systemInfo.repo.join(', ')} />
        </div>
      </Card>
    ) : (
      <Card
        hoverable
        className="multiple-system-card"
        onClick={onClick}>
        <div className="multiple-system-card-content add">
          <PlusOutlined />
        </div>
        <div className="multiple-system-card-title add">
          <span>新增系统</span>
        </div>
      </Card>
    )
  )
}

export default SystemCard
