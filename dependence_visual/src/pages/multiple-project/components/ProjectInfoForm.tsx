import React, { forwardRef, useImperativeHandle } from 'react'
import { Form, Input, Select, Button, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Store } from 'antd/lib/form/interface';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

interface ProjectInfoFormProps {
  onFinish(values: Store): void;
}
const ProjectInfoForm = (props: ProjectInfoFormProps, ref: any) => {
  const { onFinish } = props
  const [form] = useForm()

  useImperativeHandle(ref, () => ({
    submit: () => form.submit(),
    clear: () => form.resetFields(
      ['projectName', 'repoType', 'username', 'password', 'repo'])
  }))

  const isValidUrl = (value: string) => {
    return /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i.test(value)
  }

  return (
    <div className="project-info-form">
      <h2>创建新系统</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ repoType: 'GIT', repo: [""] }}>
        <Form.Item
          name="projectName"
          label="系统名称"
          rules={[{ required: true, message: '请输入系统名称！' }]}
          required>
          <Input placeholder="请输入系统名称" />
        </Form.Item>
        <Form.Item
          name="repoType"
          label="仓库类型"
          rules={[{ required: true, message: '请选择仓库类型！' }]}
          required>
          <Select>
            {['GIT', 'SVN'].map((value) => (
              <Select.Option
                value={value}
                key={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="username"
          label="仓库用户名">
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          label="仓库密码">
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.List name="repo">
          {(fields, { add, remove }) => {
            return (
              <div>
                <div style={{ paddingBottom: 8 }}>
                  <span style={{
                    marginRight: 4,
                    color: '#ff4d4f',
                    fontSize: 14,
                    fontFamily: 'SimSun, sans-serif',
                  }}>*</span>
                  <span>仓库地址</span>
                </div>
                {fields.map(field => (
                  <Form.Item
                    {...field}
                    name={field.name}
                    fieldKey={field.fieldKey}
                    rules={[{
                      required: true,
                      message: '请输入正确的仓库地址！',
                      validator: (_, value) =>
                        isValidUrl(value) ?
                        Promise.resolve() :
                        Promise.reject('请输入正确的仓库地址！'),
                    }]}
                    key={field.key}
                    required>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Input style={{ width: '100%' }} placeholder="请输入仓库地址" />
                      { fields.length > 1 ?
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          style={{ margin: '0 8px' }}
                          onClick={() => { remove(field.name) }}
                        /> : null
                      }
                    </div>
                  </Form.Item>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => { add() }}>
                  <PlusOutlined /> 添加仓库地址
                </Button>
              </Form.Item>
            </div>
            );
          }}
        </Form.List>
      </Form>
    </div>
  )
}
export default forwardRef(ProjectInfoForm);